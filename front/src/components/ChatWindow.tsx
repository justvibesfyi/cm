import type { Customer } from "@back/types";
import { MoreHorizontal, Send, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useChat } from "@/providers/chat";
import MessageList from "./MessageList";
import { Button } from "./ui/button";

interface ChatWindowProps {
	contact: Customer;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact }) => {
	const [messageText, setMessageText] = useState("");
	const { messages, selectConvo, sendMessage } = useChat();

	console.log("Messages:", messages);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (messageText.trim() !== "") {
			sendMessage(messageText, contact.id);
		}
		setMessageText("");
	};

	return (
		<div className="flex flex-col h-full">
			{/* Chat Header - Hidden on mobile (shown in App.tsx) */}
			<div className="hidden md:flex items-center justify-between p-2 border-b border-gray-200 bg-white">
				<div className="flex items-center">
					<img
						src={contact.avatar}
						alt={contact.name}
						className="w-10 h-10 rounded-full mr-3"
					/>
					<div>
						<h2 className="font-semibold text-gray-900">{contact.name}</h2>
						<p className="text-sm text-gray-500">
							{contact.isOnline ? "Online" : "Last seen recently"}
						</p>
					</div>
				</div>

				<div className="flex items-center space-x-3">
					{/* <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Video size={20} className="text-gray-600" />
          </button> */}
					<Button disabled variant="outline" className="p-2 rounded-full">
						<MoreHorizontal size={20} className="" />
					</Button>
					<Button
						onClick={() => selectConvo(null)}
						variant="outline"
						className="p-2 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-600" />
					</Button>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-hidden bg-gray-50">
				<MessageList messages={messages} />
			</div>

			{/* Message Input */}
			<form
				onSubmit={handleSendMessage}
				className="p-3 border-t border-gray-200 bg-white"
			>
				<div className="flex items-center space-x-3">
					{/* <button 
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Paperclip size={20} className="text-gray-500" />
          </button> */}

					<div className="flex-1 relative">
						<input
							type="text"
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							placeholder="Type a message..."
							className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
						/>
						{/* <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Smile size={18} className="text-gray-500" />
            </button> */}
					</div>

					<Button
						type="submit"
						disabled={!messageText.trim()}
						className={`
              p-3 rounded-full transition-all duration-200
              ${
								messageText.trim()
									? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
									: "bg-gray-100 text-gray-400"
							}
            `}
					>
						<Send size={18} />
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ChatWindow;
