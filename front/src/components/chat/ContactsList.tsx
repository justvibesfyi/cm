import type { CustomerStatus } from "@back/types";
import { Badge, Filter, Search, X } from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getStatusColor } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import { useChat } from "@/providers/chat";
import PlatformIcon from "../PlatformIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import UserProfile from "./UserProfile";

export const ContactsList = () => {
	const { showContacts, setShowContacts, selectedConvo, selectConvo, convos } =
		useChat();
	const { user } = useAuth();

	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">(
		"all",
	);

	// Filter contacts based on search query and filter selection
	const filteredContacts = convos.filter((contact) => {
		const matchesSearch = contact.full_name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesFilter =
			filter === "all" ||
			(filter === "assigned" && contact.assigned_to === user?.id) ||
			(filter === "unassigned" && !contact.assigned_to);
		return matchesSearch && matchesFilter;
	});

	return (
		<div
			className={cn(
				"flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
				"w-full md:w-80 md:relative absolute z-20 h-full",
				showContacts ? "block" : "hidden md:block",
			)}
		>
			<div className="p-4 border-b border-gray-200">
				{/* Search Bar */}
				<div className="relative mb-3">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search contacts..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-full justify-between">
							<span>
								Filter:{" "}
								{filter === "all"
									? "All"
									: filter === "assigned"
										? "Assigned"
										: "Unassigned"}
							</span>
							<Filter className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-full">
						<DropdownMenuItem onClick={() => setFilter("all")}>
							All Contacts
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setFilter("assigned")}>
							Assigned to Me
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setFilter("unassigned")}>
							Unassigned
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex-1 overflow-y-auto">
				{filteredContacts.map((contact) => (
					<button
						type="button"
						key={contact.id}
						className={cn(
							"flex w-full items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100",
							selectedConvo?.id === contact.id && "bg-blue-50",
						)}
						onClick={() => {
							selectConvo(contact);
							setShowContacts(false);
						}}
					>
						<div className="relative mr-3">
							<Avatar className="h-12 w-12">
								<AvatarImage src={contact.avatar || undefined} />
								<AvatarFallback>
									{contact.full_name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
									getStatusColor(contact.status),
								)}
							/>
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between mb-1">
								<p className="text-sm font-medium text-gray-900 truncate flex gap-2 items-center">
									<PlatformIcon
										className="w-4 h-4"
										platform={contact.platform}
									/>
									{contact.full_name}
								</p>
								<span className="text-xs text-gray-500">
									{contact.lastActivity
										? new Date(contact.lastActivity).toLocaleTimeString(
												"en-US",
												{
													hour: "2-digit",
													minute: "2-digit",
													hour12: true,
												},
											)
										: "N/A"}
								</span>
							</div>

							<div className="flex items-center">
								<p className="text-sm text-gray-600 truncate mr-2">
									...
								</p>
								{contact.unread > 0 && (
									<Badge className="bg-blue-500 text-white text-xs h-5 min-w-[20px] px-1 flex items-center justify-center">
										{contact.unread}
									</Badge>
								)}
							</div>

							{contact.assigned_to && (
								<div className="flex items-center mt-1">
									<Avatar className="h-4 w-4 mr-1">
										<AvatarImage src={contact.assigned_to?.avatar} />
										<AvatarFallback className="text-xs">
											{contact.assigned_to?.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<span className="text-xs text-gray-500">
										{contact.assigned_to?.name}
									</span>
								</div>
							)}
						</div>
					</button>
				))}
			</div>

			<div className="">
				<UserProfile />
			</div>
		</div>
	);
};
