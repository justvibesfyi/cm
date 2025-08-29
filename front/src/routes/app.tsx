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
import { Button } from "@/components/ui/button";
import ChatWindow from "../components/ChatWindow";
import ContactsList from "../components/ContactsList";
import UserProfile from "../components/UserProfile";

export const Route = createFileRoute("/app")({
	component: AppComponent,
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

function AppComponent() {
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Mock data
	const currentUser: User = {
		id: "user-1",
		name: "John Doe",
		avatar:
			"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
		title: "Product Manager",
		status: "online",
	};

	const contacts: Contact[] = [
		{
			id: "1",
			name: "Sarah Wilson",
			avatar:
				"https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
			platform: "telegram",
			lastMessage: "Hey! How are you doing today?",
			lastMessageTime: "2:30 PM",
			unreadCount: 2,
			isOnline: true,
		},
		{
			id: "2",
			name: "Mike Johnson",
			avatar:
				"https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
			platform: "whatsapp",
			lastMessage: "Can we schedule a meeting for tomorrow?",
			lastMessageTime: "1:45 PM",
			unreadCount: 0,
			isOnline: false,
		},
		{
			id: "3",
			name: "Emily Chen",
			avatar:
				"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
			platform: "telegram",
			lastMessage: "Thanks for the help with the project!",
			lastMessageTime: "12:20 PM",
			unreadCount: 1,
			isOnline: true,
		},
		{
			id: "4",
			name: "David Brown",
			avatar:
				"https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
			platform: "whatsapp",
			lastMessage: "See you at the conference next week",
			lastMessageTime: "11:30 AM",
			unreadCount: 0,
			isOnline: false,
		},
		{
			id: "5",
			name: "Lisa Anderson",
			avatar:
				"https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
			platform: "telegram",
			lastMessage: "Great work on the presentation!",
			lastMessageTime: "Yesterday",
			unreadCount: 0,
			isOnline: true,
		},
	];

	const filteredContacts = contacts;

	const handleContactSelect = (contact: Contact) => {
		setSelectedContact(contact);
		setIsSidebarOpen(false);
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
					<ContactsList
						contacts={filteredContacts}
						selectedContact={selectedContact}
						onContactSelect={handleContactSelect}
					/>
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
					{selectedContact && (
						<div className="flex items-center flex-1">
							<img
								src={selectedContact.avatar}
								alt={selectedContact.name}
								className="w-8 h-8 rounded-full mr-3"
							/>
							<div>
								<h2 className="font-medium text-gray-900">
									{selectedContact.name}
								</h2>
								<p className="text-xs text-gray-500">
									{selectedContact.isOnline ? "Online" : "Last seen recently"}
								</p>
							</div>
						</div>
					)}
					{selectedContact && (
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
				{selectedContact ? (
					<ChatWindow contact={selectedContact} />
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