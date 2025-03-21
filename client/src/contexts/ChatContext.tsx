import { createContext, useState, useContext, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Define typing information type
interface TypingInfo {
  name: string;
  avatar: string;
}

// Define the context type
interface ChatContextType {
  messages: Message[];
  typingInfo: TypingInfo | null;
  conversationActive: boolean;
  isConnected: boolean;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendMessage: (content: string) => void;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Define provider props
interface ChatProviderProps {
  children: ReactNode;
}

// WebSocket instance
let socket: WebSocket | null = null;

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingInfo, setTypingInfo] = useState<TypingInfo | null>(null);
  const [conversationActive, setConversationActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const { toast } = useToast();

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to chat server. Please try again later.",
        variant: "destructive",
      });
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message_received':
            // User message received confirmation
            setMessages(prev => [...prev, data.message]);
            break;
            
          case 'character_message':
            // Character message received
            setTypingInfo(null);
            setMessages(prev => [...prev, data.message]);
            break;
            
          case 'typing':
            // Character is typing
            setTypingInfo({
              name: data.character.name,
              avatar: data.character.avatar
            });
            break;
            
          case 'messages_history':
            // Received message history
            setMessages(data.messages);
            break;
            
          case 'conversation_complete':
            // Conversation chain completed
            setConversationActive(false);
            setTypingInfo(null);
            break;
            
          case 'error':
            // Error message from server
            toast({
              title: "Error",
              description: data.message,
              variant: "destructive",
            });
            setConversationActive(false);
            setTypingInfo(null);
            break;
            
          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };
  }, [toast]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
      setIsConnected(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "Not connected to chat server. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Set conversation as active
    setConversationActive(true);

    // Send the message
    socket.send(JSON.stringify({
      type: 'user_message',
      content,
      conversationId
    }));
  }, [conversationId, toast]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        typingInfo,
        conversationActive,
        isConnected,
        connectWebSocket,
        disconnectWebSocket,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
