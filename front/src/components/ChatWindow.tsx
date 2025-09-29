import type { Customer, CustomerNote, Employee } from "@back/types";
import { MoreHorizontal, Send, Sidebar, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useChat } from "@/providers/chat";
import CustomerSidebar from "./ChatSidebar";
import MessageList from "./MessageList";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface ChatWindowProps {
	contact: Customer;
}

const customerData = {
	platform: "Shopify",
	username: "johndoe_store",
	phone: "+1 (555) 123-4567",
	assignedEmployee: {
		id: "emp1",
		name: "Sarah Johnson",
		avatar: "/avatars/sarah.jpg",
	},
	location: {
		city: "New York",
		country: "United States",
		countryCode: "US",
		timezone: "America/New_York",
	},
	device: "Desktop - Chrome",
	ip: "192.168.1.1",
};

const notesData = [
	{
		id: "note1",
		content: "Customer reported issue with payment processing",
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
		updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
		createdBy: {
			id: "emp1",
			name: "Sarah Johnson",
			avatar: "/avatars/sarah.jpg",
		},
	},
	{
		id: "note2",
		content: "Followed up with customer, issue resolved",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
		createdBy: {
			id: "emp2",
			name: "Mike Chen",
			avatar: "/avatars/mike.jpg",
		},
		updatedBy: {
			id: "emp1",
			name: "Sarah Johnson",
			avatar: "/avatars/sarah.jpg",
		},
	},
];

const ChatWindow: React.FC<ChatWindowProps> = ({ contact }) => {
	const [messageText, setMessageText] = useState("");
	const [showSidebar, setShowSidebar] = useState(true);
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

	const handleAddNote = (content: string) => {
		console.log("Adding note:", content);
	};

	const handleDeleteNote = (noteId: string) => {
		console.log("Deleting note:", noteId);
	};

	return (
		<div className="flex h-full">
			{/* Main Chat Area */}
			<div className="flex flex-col flex-1">
				{/* Chat Header - Hidden on mobile (shown in App.tsx) */}
				<div className="hidden md:flex items-center justify-between p-2 border-b border-gray-200 bg-white">
					<div className="flex items-center">
						<Avatar className="mr-3">
							<AvatarImage src={contact.avatar} />
							<AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="font-semibold text-gray-900">{contact.name}</h2>
							<p className="text-sm text-gray-500">Last seen recently</p>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<Button
							onClick={() => setShowSidebar(!showSidebar)}
							variant="outline"
							className="p-2 rounded-full"
						>
							<Sidebar size={20} className="" />
						</Button>
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
						<div className="flex-1 relative">
							<input
								type="text"
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								placeholder="Type a message..."
								className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
							/>
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

			{/* Customer Sidebar */}
			{showSidebar && (
				<CustomerSidebar
					customer={customerData}
					notes={notesData}
					onAddNote={handleAddNote}
					onDeleteNote={handleDeleteNote}
				/>
			)}
		</div>
	);
};

export default ChatWindow;
