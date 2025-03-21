import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatHeader = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-[#128C7E] text-white py-2 px-4 flex items-center z-10">
      <div className="flex items-center space-x-3">
        {isMobile && (
          <button className="focus:outline-none">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&h=80" 
            alt="Group Icon" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-bold">Famous Characters Chat</h1>
          <p className="text-xs opacity-80">10 participants</p>
        </div>
      </div>
      <div className="ml-auto flex space-x-4">
        <button className="focus:outline-none">
          <Video className="h-5 w-5" />
        </button>
        <button className="focus:outline-none">
          <Phone className="h-5 w-5" />
        </button>
        <button className="focus:outline-none">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
