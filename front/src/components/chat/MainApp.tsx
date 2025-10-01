import {
	Check,
	CheckCheck,
	ChevronLeft,
	Info,
	Menu,
	Paperclip,
	Phone,
	Send,
	Smile,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getStatusColor } from "@/lib/utils";
import { useChat } from "@/providers/chat";
// Import the sidebar component we created earlier
import CustomerSupportSidebar from "./ChatSidebar";
import { ContactsList } from "./ContactsList";

// Types for our data structures
interface Contact {
	id: string;
	name: string;
	avatar: string;
	platform: string;
	assignedTo: {
		id: string;
		name: string;
		avatar: string;
	};
	lastMessage: string;
	lastMessageTime: string;
	unread: number;
	status: "online" | "away" | "offline";
}

interface Message {
	id: string;
	content: string;
	sender: "customer" | "employee";
	senderId: string;
	senderName: string;
	senderAvatar: string;
	timestamp: Date;
	type: "text" | "image" | "file" | "system";
	status?: "sent" | "delivered" | "read";
}

// Mock messages for the selected contact
const mockMessages: Message[] = [
	{
		id: "1",
		content: "Hi, I need help with my recent order",
		sender: "customer",
		senderId: "1",
		senderName: "John Doe",
		senderAvatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
		timestamp: new Date("2024-01-15T10:30:00"),
		type: "text",
	},
	{
		id: "2",
		content:
			"Hello! I'd be happy to help you with your order. Could you please provide your order number?",
		sender: "employee",
		senderId: "emp1",
		senderName: "Sarah Johnson",
		senderAvatar:
			"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
		timestamp: new Date("2024-01-15T10:32:00"),
		type: "text",
		status: "read",
	},
	{
		id: "3",
		content: "Sure, it's #12345",
		sender: "customer",
		senderId: "1",
		senderName: "John Doe",
		senderAvatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
		timestamp: new Date("2024-01-15T10:35:00"),
		type: "text",
	},
	{
		id: "4",
		content:
			"Thank you! Let me check that for you. I see your order is currently in transit and should arrive by tomorrow.",
		sender: "employee",
		senderId: "emp1",
		senderName: "Sarah Johnson",
		senderAvatar:
			"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
		timestamp: new Date("2024-01-15T10:38:00"),
		type: "text",
		status: "read",
	},
	{
		id: "5",
		content: "Great, thank you for the quick response!",
		sender: "customer",
		senderId: "1",
		senderName: "John Doe",
		senderAvatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
		timestamp: new Date("2024-01-15T10:40:00"),
		type: "text",
	},
];

const ChatApplication: React.FC = () => {
	const { selectedConvo } = useChat();
	const [messages, setMessages] = useState<Message[]>(mockMessages);
	const [newMessage, setNewMessage] = useState("");
	const [showSidebar, setShowSidebar] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages are added
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Handle sending a new message
	const handleSendMessage = () => {
		if (newMessage.trim() && selectedConvo) {
			const newMsg: Message = {
				id: Date.now().toString(),
				content: newMessage,
				sender: "employee",
				senderId: "current-user",
				senderName: "You",
				senderAvatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
				timestamp: new Date(),
				type: "text",
				status: "sent",
			};

			setMessages([...messages, newMsg]);
			setNewMessage("");

			// // Update the last message in the contacts list
			// setContacts(
			// 	contacts.map((contact) =>
			// 		contact.id === selectedContact.id
			// 			? {
			// 					...contact,
			// 					lastMessage: newMessage,
			// 					lastMessageTime: "Just now",
			// 				}
			// 			: contact,
			// 	),
			// );
		}
	};

	// Format message timestamp
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const { setShowContacts } = useChat();

	return (
		<div className="flex h-screen bg-gray-50 overflow-hidden">
			{/* Contacts List - Left Side */}
			<ContactsList />

			{/* Chat Messages - Middle */}
			<div className="flex-1 flex flex-col bg-white">
				{selectedConvo ? (
					<>
						{/* Chat Header */}
						<div className="p-4 border-b border-gray-200 flex items-center justify-between">
							<div className="flex items-center">
								<Button
									variant="ghost"
									size="sm"
									className="md:hidden mr-2"
									onClick={() => setShowContacts(true)}
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>

								<div className="relative mr-3">
									<Avatar className="h-10 w-10">
										<AvatarImage src={selectedConvo.avatar} />
										<AvatarFallback>
											{selectedConvo.full_name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div
										className={cn(
											"absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
											getStatusColor(selectedConvo.status),
										)}
									/>
								</div>

								<div>
									<p className="font-medium text-gray-900">
										{selectedConvo.name}
									</p>
									<p className="text-xs text-gray-500">
										{selectedConvo.platform} • {selectedConvo.status}
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm" disabled>
									<Phone className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="flex md:hidden"
									onClick={() => setShowSidebar(!showSidebar)}
								>
									<Info className="h-4 w-4" />
								</Button>
								{/* <Button variant="ghost" size="sm">
									<MoreVertical className="h-4 w-4" />
								</Button> */}
							</div>
						</div>

						{/* Messages Area */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={cn(
										"flex",
										message.sender === "employee"
											? "justify-end"
											: "justify-start",
									)}
								>
									<div
										className={cn(
											"flex max-w-xs lg:max-w-md",
											message.sender === "employee"
												? "flex-row-reverse"
												: "flex-row",
										)}
									>
										<Avatar className="h-8 w-8 mx-2">
											<AvatarImage src={message.senderAvatar} />
											<AvatarFallback className="text-xs">
												{message.senderName
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>

										<div>
											<div
												className={cn(
													"px-4 py-2 rounded-lg",
													message.sender === "employee"
														? "bg-blue-500 text-white"
														: "bg-gray-100 text-gray-900",
												)}
											>
												<p className="text-sm">{message.content}</p>
											</div>

											<div
												className={cn(
													"flex items-center mt-1 text-xs text-gray-500",
													message.sender === "employee"
														? "justify-end"
														: "justify-start",
												)}
											>
												<span>{formatTime(message.timestamp)}</span>
												{message.sender === "employee" && message.status && (
													<span className="ml-1">
														{message.status === "sent" && (
															<Check className="h-3 w-3 inline" />
														)}
														{message.status === "delivered" && (
															<CheckCheck className="h-3 w-3 inline" />
														)}
														{message.status === "read" && (
															<CheckCheck className="h-3 w-3 inline text-blue-500" />
														)}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>

						{/* Message Input */}
						<div className="p-4 border-t border-gray-200">
							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm" disabled>
									<Paperclip className="h-4 w-4" />
								</Button>
								<Button variant="ghost" size="sm" disabled>
									<Smile className="h-4 w-4" />
								</Button>
								<Input
									placeholder="Type a message..."
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
									className="flex-1"
								/>
								<Button onClick={handleSendMessage} size="sm">
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center">
							<div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Menu className="h-10 w-10 text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-1">
								Select a conversation
							</h3>
							<p className="text-sm text-gray-500">
								Choose a contact from the list to start messaging
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Customer Sidebar - Right Side */}
			<div
				className={cn(
					"hidden md:block transition-all duration-300",
					showSidebar ? "w-80" : "w-0",
				)}
			>
				{showSidebar && selectedConvo && <CustomerSupportSidebar />}
			</div>
		</div>
	);
};

export default ChatApplication;
