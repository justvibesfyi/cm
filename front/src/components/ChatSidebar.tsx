import { formatDistanceToNow } from "date-fns";
import {
	Calendar,
	Clock,
	Computer,
	Edit3,
	Globe,
	MapPin,
	MoreVertical,
	Phone,
	Plus,
	Trash2,
	User,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface Employee {
	id: string;
	name: string;
	avatar: string;
}

interface Customer {
	platform: string;
	username: string;
	phone: string;
	assignedEmployee: Employee;
	location: {
		city: string;
		country: string;
		countryCode: string;
		timezone: string;
	};
	device?: string;
	ip?: string;
}

interface Note {
	id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	createdBy: Employee;
	updatedBy?: Employee;
}

interface CustomerSidebarProps {
	customer: Customer;
	notes: Note[];
	onAddNote: (content: string) => void;
	onDeleteNote: (noteId: string) => void;
	onEditNote: (noteId: string, content: string) => void;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
	customer,
	notes,
	onAddNote,
	onDeleteNote,
	onEditNote,
}) => {
	const [newNote, setNewNote] = useState("");
	const [showAddNote, setShowAddNote] = useState(false);
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const [editNoteContent, setEditNoteContent] = useState("");
	const [localTime, setLocalTime] = useState("");

	// Update local time every minute
	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const timeString = now.toLocaleTimeString("en-US", {
				timeZone: customer.location.timezone,
				hour: "2-digit",
				minute: "2-digit",
			});
			setLocalTime(timeString);
		};

		updateTime();
		const interval = setInterval(updateTime, 60000);
		return () => clearInterval(interval);
	}, [customer.location.timezone]);

	const handleAddNote = () => {
		if (newNote.trim()) {
			onAddNote(newNote.trim());
			setNewNote("");
			setShowAddNote(false);
		}
	};

	const handleEditNote = (noteId: string) => {
		const note = notes.find((n) => n.id === noteId);
		if (note) {
			setEditingNoteId(noteId);
			setEditNoteContent(note.content);
		}
	};

	const handleSaveEdit = () => {
		if (editingNoteId && editNoteContent.trim()) {
			onEditNote(editingNoteId, editNoteContent.trim());
			setEditingNoteId(null);
			setEditNoteContent("");
		}
	};

	const getCountryFlag = (countryCode: string) => {
		return countryCode
			.toUpperCase()
			.split("")
			.map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
			.join("");
	};

	// Get unique employees involved in a note (creator and updater)
	const getNoteEmployees = (note: Note) => {
		const employees = [note.createdBy];
		if (note.updatedBy && note.updatedBy.id !== note.createdBy.id) {
			employees.push(note.updatedBy);
		}
		return employees;
	};

	return (
		<div className="flex flex-col h-full w-full md:w-80 bg-background border-r">
			<ScrollArea className="flex-1">
				<div className="p-4 space-y-6">
					{/* Customer Info Header */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<Avatar className="h-10 w-10">
									<AvatarImage src={customer.assignedEmployee.avatar} />
									<AvatarFallback>
										{customer.assignedEmployee.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="font-semibold text-lg">{customer.username}</h2>
									<p className="text-sm text-muted-foreground">
										{customer.platform} Customer
									</p>
								</div>
							</div>
							<Badge variant="outline" className="text-xs">
								Active
							</Badge>
						</div>

						<Separator />

						{/* Customer Details - Simplified Layout */}
						<div className="space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">
										Platform
									</span>
									<div className="flex items-center space-x-1">
										<div className="w-2 h-2 rounded-full bg-green-500"></div>
										<span className="text-sm font-medium">
											{customer.platform}
										</span>
									</div>
								</div>

								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">
										Username
									</span>
									<span className="text-sm font-medium truncate">
										{customer.username}
									</span>
								</div>

								<div className="flex flex-col space-y-1 col-span-2">
									<span className="text-xs text-muted-foreground">Contact</span>
									<div className="flex items-center space-x-2">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{customer.phone}</span>
									</div>
								</div>

								<div className="flex flex-col space-y-1 col-span-2">
									<span className="text-xs text-muted-foreground">
										Location
									</span>
									<div className="flex items-center space-x-2">
										<MapPin className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">
											{customer.location.city}, {customer.location.country}{" "}
											{getCountryFlag(customer.location.countryCode)}
										</span>
									</div>
								</div>

								<div className="flex flex-col space-y-1">
									<span className="text-xs text-muted-foreground">
										Local Time
									</span>
									<div className="flex items-center space-x-2">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{localTime}</span>
									</div>
								</div>

								{customer.device && (
									<div className="flex flex-col space-y-1">
										<span className="text-xs text-muted-foreground">
											Device
										</span>
										<div className="flex items-center space-x-2">
											<Computer className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{customer.device}</span>
										</div>
									</div>
								)}

								{customer.ip && (
									<div className="flex flex-col space-y-1 col-span-2">
										<span className="text-xs text-muted-foreground">
											IP Address
										</span>
										<div className="flex items-center space-x-2">
											<Globe className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{customer.ip}</span>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Assigned Employee */}
						<div className="flex items-center justify-between py-2">
							<div className="flex items-center space-x-3">
								<Avatar className="h-8 w-8">
									<AvatarImage src={customer.assignedEmployee.avatar} />
									<AvatarFallback>
										{customer.assignedEmployee.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-sm font-medium">Assigned to</h3>
									<p className="text-sm text-muted-foreground">
										{customer.assignedEmployee.name}
									</p>
								</div>
							</div>
							<Badge variant="secondary" className="text-xs">
								Support Agent
							</Badge>
						</div>
					</div>

					{/* Notes Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-medium">Notes</h3>
							<Badge variant="secondary">{notes.length}</Badge>
						</div>

						{/* Scrollable Notes List */}
						<div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
							{notes.map((note) => (
								<div
									key={note.id}
									className="border border-border rounded-lg p-3 space-y-2 relative flex flex-col"
								>
									{/* Note Content */}
									<div className="flex-1">
										{editingNoteId === note.id ? (
											<Textarea
												value={editNoteContent}
												onChange={(e) => setEditNoteContent(e.target.value)}
												className="min-h-20 text-sm"
											/>
										) : (
											<p className="text-sm">{note.content}</p>
										)}
									</div>

									{/* Note Footer */}
									<div className="flex items-center justify-between pt-2 border-t border-border">
										<div className="flex items-center space-x-3">
											{/* Stacked Avatars */}
											<div className="flex -space-x-2">
												{getNoteEmployees(note).map((employee) => (
													<Avatar
														key={employee.id}
														className="h-6 w-6 border-2 border-background"
													>
														<AvatarImage src={employee.avatar} />
														<AvatarFallback className="text-xs">
															{employee.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
												))}
											</div>

											{/* Last Updated */}
											<span className="text-xs text-muted-foreground">
												{note.updatedBy
													? `Updated ${formatDistanceToNow(note.updatedAt, { addSuffix: true })}`
													: `Created ${formatDistanceToNow(note.createdAt, { addSuffix: true })}`}
											</span>
										</div>

										{/* Actions */}
										{editingNoteId === note.id ? (
											<div className="flex space-x-2">
												<Button
													size="sm"
													onClick={handleSaveEdit}
													disabled={!editNoteContent.trim()}
												>
													Save
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => setEditingNoteId(null)}
												>
													Cancel
												</Button>
											</div>
										) : (
											<div className="relative">
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
												<div className="absolute right-0 top-full mt-1 w-32 bg-background border border-border rounded-md shadow-md z-10 hidden group-hover:block">
													<Button
														variant="ghost"
														className="w-full justify-start text-sm h-8 px-2"
														onClick={() => handleEditNote(note.id)}
													>
														<Edit3 className="h-3 w-3 mr-2" />
														Edit
													</Button>
													<Button
														variant="ghost"
														className="w-full justify-start text-sm h-8 px-2 text-destructive hover:text-destructive"
														onClick={() => onDeleteNote(note.id)}
													>
														<Trash2 className="h-3 w-3 mr-2" />
														Delete
													</Button>
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>

						{/* Add Note Button and Form */}
						<div className="space-y-2">
							{!showAddNote ? (
								<Button
									variant="outline"
									className="w-full h-10"
									onClick={() => setShowAddNote(true)}
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Note
								</Button>
							) : (
								<div className="space-y-2">
									<Textarea
										placeholder="Add a note..."
										value={newNote}
										onChange={(e) => setNewNote(e.target.value)}
										className="min-h-20"
									/>
									<div className="flex space-x-2">
										<Button
											onClick={handleAddNote}
											disabled={!newNote.trim()}
											className="flex-1"
										>
											Add Note
										</Button>
										<Button
											variant="outline"
											onClick={() => setShowAddNote(false)}
											className="flex-1"
										>
											Cancel
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default CustomerSidebar;
