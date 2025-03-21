import { Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  // Determine if message is from user or character
  const isOutgoing = message.isUser === 1;
  
  // Format timestamp
  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div className={cn(
      "flex items-start mb-4",
      isOutgoing ? "justify-end" : ""
    )}>
      {/* Avatar for character messages */}
      {!isOutgoing && (
        <div className="w-9 h-9 rounded-full bg-gray-300 mr-2 flex-shrink-0 overflow-hidden">
          <img 
            src={message.avatar || ""} 
            alt={`${message.sender} Avatar`} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Message bubble */}
      <div 
        className={cn(
          "py-2 px-3 shadow-sm max-w-[85%] relative",
          isOutgoing 
            ? "bg-[#DCF8C6] ml-12 chat-bubble-outgoing" 
            : "bg-white mr-12 chat-bubble-incoming",
          "rounded-lg"
        )}
        style={{
          borderRadius: "7.5px",
          position: "relative"
        }}
      >
        {/* Sender name for character messages */}
        {!isOutgoing && (
          <div className="font-semibold text-xs text-[#128C7E] mb-1">
            {message.sender}
          </div>
        )}
        
        {/* Message content */}
        <div>{message.content}</div>
        
        {/* Timestamp */}
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500">
            {message.timestamp ? formatMessageTime(new Date(message.timestamp)) : ''}
          </span>
        </div>
        
        {/* Chat bubble tails using CSS */}
        <style jsx>{`
          .chat-bubble-outgoing::after {
            content: "";
            position: absolute;
            right: -8px;
            bottom: 0;
            width: 16px;
            height: 16px;
            background: radial-gradient(circle at top right, transparent 16px, #DCF8C6 0);
          }
          
          .chat-bubble-incoming::after {
            content: "";
            position: absolute;
            left: -8px;
            bottom: 0;
            width: 16px;
            height: 16px;
            background: radial-gradient(circle at top left, transparent 16px, #FFFFFF 0);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChatMessage;
