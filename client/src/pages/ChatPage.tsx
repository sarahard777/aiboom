import { useEffect, useRef } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatContainer from "@/components/ChatContainer";
import ChatInput from "@/components/ChatInput";
import { useChatContext } from "@/contexts/ChatContext";

const ChatPage = () => {
  const { connectWebSocket, disconnectWebSocket, isConnected } = useChatContext();
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (!hasConnectedRef.current) {
      connectWebSocket();
      hasConnectedRef.current = true;
    }

    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  return (
    <div className="flex flex-col h-screen bg-whatsapp-lightGray text-whatsapp-textDark">
      <ChatHeader />
      <ChatContainer />
      <ChatInput />
    </div>
  );
};

export default ChatPage;
