import { useState } from "react";
import { Send as SendIcon, SmileIcon, PaperclipIcon } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, conversationActive } = useChatContext();
  const { toast } = useToast();

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      return;
    }
    
    if (conversationActive) {
      toast({
        description: "Please wait for the current conversation to finish.",
        variant: "destructive",
      });
      return;
    }
    
    sendMessage(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-50 p-3 border-t">
      <div className="flex items-center">
        <button 
          className="text-gray-500 px-2 focus:outline-none"
          aria-label="Emoji"
        >
          <SmileIcon className="h-6 w-6" />
        </button>
        <button 
          className="text-gray-500 px-2 focus:outline-none"
          aria-label="Attach file"
        >
          <PaperclipIcon className="h-6 w-6" />
        </button>
        <div className="flex-grow mx-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#25D366]"
            disabled={conversationActive}
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || conversationActive}
          className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
          aria-label="Send message"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
