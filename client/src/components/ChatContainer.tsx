import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { useChatContext } from "@/contexts/ChatContext";

const ChatContainer = () => {
  const { messages, typingInfo } = useChatContext();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingInfo]);

  return (
    <div 
      ref={containerRef}
      className="flex-grow overflow-y-auto chat-container scrollbar-hide p-4"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Today's date */}
      <div className="flex justify-center mb-6 mt-2">
        <div className="bg-white rounded-lg py-1 px-3 shadow-sm">
          <p className="text-xs text-gray-500">Today</p>
        </div>
      </div>

      {/* Welcome message */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-lg py-2 px-4 shadow-sm">
          <p className="text-sm text-center text-gray-500">
            Welcome to Famous Characters Chat! Ask a question and watch as famous characters respond in a chain conversation.
          </p>
        </div>
      </div>

      {/* Message container */}
      <div>
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message}
          />
        ))}
      </div>

      {/* Typing indicator */}
      {typingInfo && (
        <TypingIndicator 
          name={typingInfo.name} 
          avatar={typingInfo.avatar} 
        />
      )}
    </div>
  );
};

export default ChatContainer;
