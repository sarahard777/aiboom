interface TypingIndicatorProps {
  name: string;
  avatar: string;
}

const TypingIndicator = ({ name, avatar }: TypingIndicatorProps) => {
  return (
    <div className="flex items-start mb-4">
      <div className="w-9 h-9 rounded-full bg-gray-300 mr-2 flex-shrink-0 overflow-hidden">
        <img 
          src={avatar} 
          alt={`${name} Avatar`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div 
        className="py-2 px-3 shadow-sm bg-white mr-12 rounded-lg relative chat-bubble-incoming"
        style={{
          borderRadius: "7.5px",
          position: "relative"
        }}
      >
        <div className="font-semibold text-xs text-[#128C7E] mb-1">
          {name}
        </div>
        <div className="typing-indicator inline-flex items-center">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {/* Chat bubble tail using CSS */}
        <style jsx>{`
          .chat-bubble-incoming::after {
            content: "";
            position: absolute;
            left: -8px;
            bottom: 0;
            width: 16px;
            height: 16px;
            background: radial-gradient(circle at top left, transparent 16px, #FFFFFF 0);
          }
          
          .typing-indicator {
            display: inline-flex;
            align-items: center;
          }
          
          .typing-indicator span {
            height: 8px;
            width: 8px;
            margin: 0 1px;
            background-color: #9e9e9e;
            border-radius: 50%;
            display: inline-block;
            animation: typing 1.4s infinite ease-in-out both;
          }
          
          .typing-indicator span:nth-child(1) {
            animation-delay: 0s;
          }
          
          .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes typing {
            0% {
              transform: scale(1);
              opacity: 0.4;
            }
            20% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0.4;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TypingIndicator;
