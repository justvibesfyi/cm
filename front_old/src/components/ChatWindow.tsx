import { MoreHorizontal, Send } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import type { Contact, Message } from "../types";
import MessageList from "./MessageList";



interface ChatWindowProps {
	contact: Contact;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact }) => {
	const [messageText, setMessageText] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	// Mock messages for demonstration
	useEffect(() => {
		const mockMessages: Message[] = [
			{
				id: "1",
				senderId: contact.id,
				senderName: contact.name,
				content: "Hey! How are you doing today?",
				timestamp: new Date(Date.now() - 3600000),
				type: "text",
				isOwn: false,
			},
			{
				id: "2",
				senderId: "user-1",
				senderName: "You",
				content: "I'm doing great! Just finished a big project. How about you?",
				timestamp: new Date(Date.now() - 3500000),
				type: "text",
				isOwn: true,
			},
			{
				id: "3",
				senderId: contact.id,
				senderName: contact.name,
				content: "That sounds awesome! I'd love to hear more about it.",
				timestamp: new Date(Date.now() - 3400000),
				type: "text",
				isOwn: false,
			},
			{
				id: "4",
				senderId: "user-1",
				senderName: "You",
				content:
					"Sure! It was a React application with real-time features. Took about 3 months to complete.",
				timestamp: new Date(Date.now() - 3300000),
				type: "text",
				isOwn: true,
			},
			{
				id: "5",
				senderId: contact.id,
				senderName: contact.name,
				content:
					"Impressive! React is such a powerful framework. I've been learning it myself.",
				timestamp: new Date(Date.now() - 3200000),
				type: "text",
				isOwn: false,
			},
			// Add more messages for scrolling demonstration
			...Array.from({ length: 20 }, (_, i) => ({
				id: `msg-${i + 6}`,
				senderId: i % 2 === 0 ? contact.id : "user-1",
				senderName: i % 2 === 0 ? contact.name : "You",
				content: `This is message ${i + 6}. ${i % 2 === 0 ? "From contact" : "From you"}.`,
				timestamp: new Date(Date.now() - (3100000 - i * 60000)),
				type: "text" as const,
				isOwn: i % 2 !== 0,
			})),
		];
		setMessages(mockMessages);
	}, [contact.id, contact.name]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageText.trim()) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			senderId: "user-1",
			senderName: "You",
			content: messageText.trim(),
			timestamp: new Date(),
			type: "text",
			isOwn: true,
		};

		setMessages((prev) => [...prev, newMessage]);
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
					<Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
						<MoreHorizontal size={20} className="text-gray-600" />
					</Button>
					<Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
						<MdClose size={20} className="text-gray-600" />
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

					<button
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
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatWindow;
