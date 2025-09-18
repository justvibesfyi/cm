import { createFileRoute } from "@tanstack/react-router";
import {
	Menu,
	MessageCircle,
	MoreHorizontal,
	Phone,
	Video,
	X,
} from "lucide-react";
import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import ContactsList from "@/components/ContactsList";
import UserProfile from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { useChat } from "@/providers/chat";

export const Route = createFileRoute("/_authenticated/app")({
	component: MainApp,
});

type User = {
	id: string;
	name: string;
	avatar: string;
	title: string;
	status: "online" | "offline";
};

type Contact = {
	id: string;
	name: string;
	avatar: string;
	platform: "telegram" | "whatsapp";
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number;
	isOnline: boolean;
};

export default function MainApp() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	// const [searchQuery, setSearchQuery] = useState("");

	const { selectedConvo } = useChat();

	// Mock data
	const currentUser: User = {
		id: "user-1",
		name: "John Doe",
		avatar:
			"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
		title: "Product Manager",
		status: "online",
	};

	return (
		<div className="h-screen bg-white flex overflow-hidden">
			{/* Mobile Sidebar Overlay */}
			{isSidebarOpen && (
				<Button
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`
        fixed md:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
			>
				{/* Sidebar Header */}
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-semibold text-gray-900">Messages</h1>
						<Button
							onClick={() => setIsSidebarOpen(false)}
							className="md:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
						>
							<X size={20} />
						</Button>
					</div>
				</div>

				{/* Contacts List */}
				<div className="flex-1 overflow-hidden">
					<ContactsList />
				</div>

				{/* User Profile */}
				<UserProfile user={currentUser} />
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Mobile Header */}
				<div className="md:hidden flex items-center p-4 border-b border-gray-200 bg-white">
					<Button
						onClick={() => setIsSidebarOpen(true)}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
					>
						<Menu size={20} />
					</Button>
					{selectedConvo && (
						<div className="flex items-center flex-1">
							<img
								src={selectedConvo.avatar}
								alt={selectedConvo.name}
								className="w-8 h-8 rounded-full mr-3"
							/>
							<div>
								<h2 className="font-medium text-gray-900">
									{selectedConvo.name}
								</h2>
								<p className="text-xs text-gray-500">
									{selectedConvo.isOnline ? "Online" : "Last seen recently"}
								</p>
							</div>
						</div>
					)}
					{selectedConvo && (
						<div className="flex items-center space-x-2">
							<Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<Phone size={18} />
							</Button>
							<Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<Video size={18} />
							</Button>
							<Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<MoreHorizontal size={18} />
							</Button>
						</div>
					)}
				</div>

				{/* Chat Window */}
				{selectedConvo ? (
					<ChatWindow contact={selectedConvo} />
				) : (
					<div className="flex-1 flex items-center justify-center bg-gray-50">
						<div className="text-center">
							<MessageCircle size={64} className="text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Select a conversation
							</h3>
							<p className="text-gray-500">
								Choose a contact to start messaging
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
