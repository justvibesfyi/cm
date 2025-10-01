import {
	Building,
	Calendar,
	Check,
	ChevronRight,
	Clock,
	Edit3,
	Globe,
	MapPin,
	MessageSquare,
	Phone,
	Plus,
	Smartphone,
	Trash2,
	User,
	UserPlus,
	X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChat } from "@/providers/chat";

interface Note {
	id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	createdBy: {
		id: string;
		name: string;
		avatar: string;
	};
	updatedBy?: {
		id: string;
		name: string;
		avatar: string;
	};
}

interface CustomerInfo {
	platform: string;
	username: string;
	phone: string;
	assignedEmployee: {
		id: string;
		name: string;
		avatar: string;
		status: "online" | "away" | "offline";
	};
	location: {
		city: string;
		country: string;
		countryCode: string;
		timezone: string;
	};
	device: {
		type: string;
		os: string;
		browser: string;
	};
	ipAddress: string;
}

const CustomerSupportSidebar: React.FC = () => {
	const [isMobileOpen, setIsMobileOpen] = useState(true);
	const [notes, setNotes] = useState<Note[]>([
		{
			id: "1",
			content:
				"Customer reported issue with payment processing. They were trying to use Visa card ending in 4242.",
			createdAt: new Date("2024-01-15T10:30:00"),
			updatedAt: new Date("2024-01-15T10:30:00"),
			createdBy: {
				id: "emp1",
				name: "Sarah Johnson",
				avatar:
					"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
			},
		},
		{
			id: "2",
			content:
				"Followed up with customer. Issue resolved after updating billing address.",
			createdAt: new Date("2024-01-15T14:20:00"),
			updatedAt: new Date("2024-01-15T14:20:00"),
			createdBy: {
				id: "emp2",
				name: "Mike Chen",
				avatar:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
			},
		},
	]);
	const [isAddingNote, setIsAddingNote] = useState(false);
	const [newNoteContent, setNewNoteContent] = useState("");
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const [editingContent, setEditingContent] = useState("");
	const [localTime, setLocalTime] = useState("");
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

	const { selectedConvo: customerInfo } = useChat();

	if (!customerInfo) {
		return null;
	}

	// // Update local time
	// useEffect(() => {
	// 	const updateTime = () => {
	// 		const time = new Date().toLocaleTimeString("en-US", {
	// 			timeZone: customerInfo.location.timezone,
	// 			hour: "2-digit",
	// 			minute: "2-digit",
	// 		});
	// 		setLocalTime(time);
	// 	};

	// 	updateTime();
	// 	const interval = setInterval(updateTime, 60000);
	// 	return () => clearInterval(interval);
	// }, [customerInfo.location.timezone]);

	const handleAddNote = () => {
		if (newNoteContent.trim()) {
			const newNote: Note = {
				id: Date.now().toString(),
				content: newNoteContent,
				createdAt: new Date(),
				updatedAt: new Date(),
				createdBy: {
					id: "current-user",
					name: "You",
					avatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
				},
			};
			setNotes([newNote, ...notes]);
			setNewNoteContent("");
			setIsAddingNote(false);
		}
	};

	const handleEditNote = (noteId: string) => {
		const note = notes.find((n) => n.id === noteId);
		if (note) {
			setEditingContent(note.content);
			setEditingNoteId(noteId);
		}
	};

	const handleSaveEdit = () => {
		if (editingContent.trim() && editingNoteId) {
			setNotes(
				notes.map((note) =>
					note.id === editingNoteId
						? {
								...note,
								content: editingContent,
								updatedAt: new Date(),
								updatedBy: {
									id: "current-user",
									name: "You",
									avatar:
										"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
								},
							}
						: note,
				),
			);
			setEditingNoteId(null);
			setEditingContent("");
		}
	};

	const handleDeleteNote = (noteId: string) => {
		setNotes(notes.filter((note) => note.id !== noteId));
	};

	const getFlagEmoji = (countryCode: string | null) => {
		if(!countryCode)
			return '🌐';

		const codePoints = countryCode
			.toUpperCase()
			.split("")
			.map((char) => 127397 + char.charCodeAt(0));
		return String.fromCodePoint(...codePoints);
	};

	const getStatusColor = (status: "online" | "away" | "offline") => {
		switch (status) {
			case "online":
				return "bg-green-500";
			case "away":
				return "bg-yellow-500";
			case "offline":
				return "bg-gray-400";
			default:
				return "bg-gray-400";
		}
	};

	const sidebarContent = (
		<div className="flex flex-col h-full bg-white border-r border-gray-200">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-gray-200">
				<h2
					className={cn(
						"font-semibold text-gray-900 transition-all duration-300 block",
					)}
				>
					Customer Details
				</h2>
			</div>
			{/* Customer Info */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{/* Platform Info */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
						<span className="text-sm font-medium text-gray-700">Platform</span>
					</div>
					<div className="ml-6 space-y-1">
						<Badge
							variant="secondary"
							className="bg-blue-100 text-blue-700 text-xs"
						>
							{customerInfo.platform}
						</Badge>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<User className="h-3 w-3" />
							<span>{customerInfo.username}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Phone className="h-3 w-3" />
							<span>{customerInfo.phone ?? '-'}</span>
						</div>
					</div>
				</div>

				{/* Assigned Employee */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<User className="h-4 w-4 text-gray-500 flex-shrink-0" />
						<span className="text-sm font-medium text-gray-700">
							Assigned To
						</span>
					</div>
					{customerInfo.assignedEmployee ? (
						<div className="ml-6 flex items-center gap-3">
							<div className="relative">
								<Avatar className="h-8 w-8">
									<AvatarImage src={customerInfo.assignedEmployee.avatar} />
									<AvatarFallback>SJ</AvatarFallback>
								</Avatar>
								<div
									className={cn(
										"absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
										getStatusColor(customerInfo.assignedEmployee.status),
									)}
								/>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-900">
									{customerInfo.assignedEmployee.name}
								</p>
								<p className="text-xs text-gray-500 capitalize">
									{customerInfo.assignedEmployee.status}
								</p>
							</div>
						</div>
					) : (
						<div className="ml-6">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="w-full justify-start">
										<UserPlus className="h-4 w-4 mr-2" />
										Assign to team member
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-56">
									<DropdownMenuLabel>Available Team Members</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Avatar className="h-6 w-6 mr-2">
											<AvatarFallback>JD</AvatarFallback>
										</Avatar>
										John Doe
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Avatar className="h-6 w-6 mr-2">
											<AvatarFallback>SM</AvatarFallback>
										</Avatar>
										Sarah Miller
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Avatar className="h-6 w-6 mr-2">
											<AvatarFallback>MJ</AvatarFallback>
										</Avatar>
										Mike Johnson
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>

				{/* Location */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
						<span className="text-sm font-medium text-gray-700">Location</span>
					</div>
					<div className="ml-6 space-y-1">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span className="text-lg">
								{getFlagEmoji(customerInfo.country)}
							</span>
							<span>
								{customerInfo.city}, {customerInfo.country}
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Clock className="h-3 w-3" />
							<span>{localTime} (Local Time)</span>
						</div>
					</div>
				</div>

				{/* Device Info */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Smartphone className="h-4 w-4 text-gray-500 flex-shrink-0" />
						<span className="text-sm font-medium text-gray-700">Device</span>
					</div>
					<div className="ml-6 space-y-1 text-sm text-gray-600">
						<p>{customerInfo.device}</p>
					</div>
				</div>

				{/* IP Address */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
						<span className="text-sm font-medium text-gray-700">
							IP Address
						</span>
					</div>
					<p className="ml-6 text-sm text-gray-600 font-mono">
						{customerInfo.ipAddress}
					</p>
				</div>

				{/* Notes Section */}
				<Separator />
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<MessageSquare className="h-4 w-4 text-gray-500" />
							<span className="text-sm font-medium text-gray-700">Notes</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsAddingNote(true)}
							className="h-7 w-7 p-0"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>

					{/* Add Note Form */}
					{isAddingNote && (
						<div className="border border-blue-200 rounded-lg bg-blue-50/50 p-3 space-y-2">
							<Textarea
								placeholder="Add a note..."
								value={newNoteContent}
								onChange={(e) => setNewNoteContent(e.target.value)}
								className="min-h-[80px] resize-none text-sm"
								autoFocus
							/>
							<div className="flex gap-2">
								<Button size="sm" onClick={handleAddNote} className="h-7">
									<Check className="h-3 w-3 mr-1" />
									Save
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => {
										setIsAddingNote(false);
										setNewNoteContent("");
									}}
									className="h-7"
								>
									<X className="h-3 w-3 mr-1" />
									Cancel
								</Button>
							</div>
						</div>
					)}

					{/* Notes List */}
					<div className="space-y-3 max-h-96 overflow-y-auto">
						{notes.map((note) => (
							<div
								key={note.id}
								className="group border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200 relative"
							>
								{editingNoteId === note.id ? (
									<div className="space-y-2">
										<Textarea
											value={editingContent}
											onChange={(e) => setEditingContent(e.target.value)}
											className="min-h-[60px] resize-none text-sm"
											autoFocus
										/>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={handleSaveEdit}
												className="h-6 text-xs"
											>
												Save
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => {
													setEditingNoteId(null);
													setEditingContent("");
												}}
												className="h-6 text-xs"
											>
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<>
										<div className="mb-2">
											<p className="text-sm text-gray-700 pr-2">
												{note.content}
											</p>
										</div>

										{/* Action Buttons - Full width, only visible on hover */}
										<div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditNote(note.id)}
													className="flex-1 h-7 text-xs"
												>
													<Edit3 className="h-3 w-3 mr-1" />
													Edit
												</Button>

												<Button
													variant={
														deleteConfirmId === note.id
															? "destructive"
															: "outline"
													}
													size="sm"
													onClick={() => {
														if (deleteConfirmId === note.id) {
															handleDeleteNote(note.id);
															setDeleteConfirmId(null);
														} else {
															setDeleteConfirmId(note.id);
														}
													}}
													className={cn(
														"flex-1 h-7 text-xs transition-all duration-200",
														deleteConfirmId !== note.id &&
															"text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300",
													)}
												>
													{deleteConfirmId === note.id ? (
														<>
															<Check className="h-3 w-3 mr-1" />
															Confirm Delete
														</>
													) : (
														<>
															<Trash2 className="h-3 w-3 mr-1" />
															Delete
														</>
													)}
												</Button>
											</div>
										</div>

										{/* Footer with date and avatar stack */}
										<div className="flex items-center justify-between pt-2 border-t border-gray-100">
											<div className="flex items-center gap-1 text-xs text-gray-400">
												<Calendar className="h-3 w-3" />
												<span>{note.createdAt.toLocaleDateString()}</span>
												{note.updatedAt.getTime() !==
													note.createdAt.getTime() && <span>• Updated</span>}
											</div>

											{/* Avatar Stack */}
											<div className="flex items-center -space-x-2">
												<Avatar className="h-6 w-6 border-2 border-white">
													<AvatarImage src={note.createdBy.avatar} />
													<AvatarFallback className="text-xs">
														{note.createdBy.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												{note.updatedBy &&
													note.updatedBy.id !== note.createdBy.id && (
														<Avatar className="h-6 w-6 border-2 border-white">
															<AvatarImage src={note.updatedBy.avatar} />
															<AvatarFallback className="text-xs">
																{note.updatedBy.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
													)}
											</div>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<>
			{sidebarContent}
			{/* Desktop Sidebar */}
			<div className="block md:block">
				<div className="transition-all duration-300 h-full w-80"></div>
			</div>

			{/* Mobile Sidebar */}
			<div className="block md:hidden">
				<Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
					<SheetContent side="right" className="w-80 p-0">
						{sidebarContent}
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
};

export default CustomerSupportSidebar;
