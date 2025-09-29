import type { Customer, CustomerNote, Employee } from "@back/types";
import { Edit3, Globe, MapPin, Monitor, Plus, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface CustomerSidebarProps {
	customer: Customer;
	assignedEmployee?: Employee;
	notes: CustomerNote[];
	onAddNote: (content: string) => void;
	onUpdateNote: (noteId: number, content: string) => void;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
	customer,
	assignedEmployee,
	notes,
	onAddNote,
	onUpdateNote,
}) => {
	const [isAddingNote, setIsAddingNote] = useState(false);
	const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
	const [noteContent, setNoteContent] = useState("");

	const handleAddNote = () => {
		if (noteContent.trim()) {
			onAddNote(noteContent.trim());
			setNoteContent("");
			setIsAddingNote(false);
		}
	};

	const handleUpdateNote = (noteId: number) => {
		if (noteContent.trim()) {
			onUpdateNote(noteId, noteContent.trim());
			setNoteContent("");
			setEditingNoteId(null);
		}
	};

	const startEditingNote = (note: CustomerNote) => {
		setEditingNoteId(note.id);
		setNoteContent(note.content);
		setIsAddingNote(false);
	};

	const cancelEditing = () => {
		setEditingNoteId(null);
		setIsAddingNote(false);
		setNoteContent("");
	};

	const formatTime = (timestamp: string) => {
		return new Date(timestamp).toLocaleString();
	};

	const getEmployeeInitials = (employee: CustomerNote["employee"]) => {
		if (employee.first_name && employee.last_name) {
			return `${employee.first_name[0]}${employee.last_name[0]}`;
		}
		return employee.email.slice(0, 2).toUpperCase();
	};

	const getEmployeeName = (employee: CustomerNote["employee"]) => {
		if (employee.first_name && employee.last_name) {
			return `${employee.first_name} ${employee.last_name}`;
		}
		return employee.email;
	};

	return (
		<div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
			{/* Customer Header */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center mb-3">
					<Avatar className="mr-3">
						<AvatarImage src={customer.avatar} />
						<AvatarFallback>{customer.name.slice(0, 2)}</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="font-semibold text-gray-900">{customer.name}</h3>
						<p className="text-sm text-gray-500 capitalize">
							{customer.platform}
						</p>
					</div>
				</div>
			</div>

			{/* Customer Information */}
			<div className="p-4 border-b border-gray-200">
				<h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>

				<div className="space-y-3">
					{/* Platform Info */}
					<div className="bg-gray-50 rounded-lg p-3">
						<div className="text-sm text-gray-500 mb-1">Platform</div>
						<div className="font-medium capitalize">{customer.platform}</div>
						{customer.platform_username && (
							<div className="text-sm text-gray-600">
								@{customer.platform_username}
							</div>
						)}
						{customer.platform_phone && (
							<div className="text-sm text-gray-600">
								{customer.platform_phone}
							</div>
						)}
					</div>

					{/* Assigned Employee */}
					{assignedEmployee && (
						<div className="bg-blue-50 rounded-lg p-3">
							<div className="text-sm text-gray-500 mb-1">Assigned to</div>
							<div className="flex items-center">
								<Avatar className="w-6 h-6 mr-2">
									<AvatarImage src={assignedEmployee.avatar} />
									<AvatarFallback className="text-xs">
										{assignedEmployee.first_name?.[0]}
										{assignedEmployee.last_name?.[0]}
									</AvatarFallback>
								</Avatar>
								<div className="font-medium">
									{assignedEmployee.first_name && assignedEmployee.last_name
										? `${assignedEmployee.first_name} ${assignedEmployee.last_name}`
										: assignedEmployee.email}
								</div>
							</div>
						</div>
					)}

					{/* Location */}
					{customer.location && (
						<div className="bg-green-50 rounded-lg p-3">
							<div className="text-sm text-gray-500 mb-1 flex items-center">
								<MapPin size={14} className="mr-1" />
								Location
							</div>
							<div className="font-medium flex items-center">
								{customer.location.flag && (
									<span className="mr-2">{customer.location.flag}</span>
								)}
								{customer.location.city && customer.location.country
									? `${customer.location.city}, ${customer.location.country}`
									: customer.location.city || customer.location.country}
							</div>
							{customer.location.timezone && (
								<div className="text-sm text-gray-600">
									{new Date().toLocaleTimeString("en-US", {
										timeZone: customer.location.timezone,
										hour12: true,
										hour: "numeric",
										minute: "2-digit",
									})}{" "}
									local time
								</div>
							)}
						</div>
					)}

					{/* Device */}
					{customer.device && (
						<div className="bg-purple-50 rounded-lg p-3">
							<div className="text-sm text-gray-500 mb-1 flex items-center">
								<Monitor size={14} className="mr-1" />
								Device
							</div>
							<div className="font-medium">{customer.device}</div>
						</div>
					)}

					{/* IP Address */}
					{customer.ip_address && (
						<div className="bg-gray-50 rounded-lg p-3">
							<div className="text-sm text-gray-500 mb-1 flex items-center">
								<Globe size={14} className="mr-1" />
								IP Address
							</div>
							<div className="font-medium font-mono text-sm">
								{customer.ip_address}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Notes Section */}
			<div className="flex-1 flex flex-col">
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center justify-between mb-3">
						<h4 className="font-medium text-gray-900">Notes</h4>
						<Button
							onClick={() => setIsAddingNote(true)}
							variant="outline"
							size="sm"
							className="p-2"
						>
							<Plus size={16} />
						</Button>
					</div>

					{/* Add Note Form */}
					{isAddingNote && (
						<div className="mb-4 p-3 bg-gray-50 rounded-lg">
							<Textarea
								value={noteContent}
								onChange={(e) => setNoteContent(e.target.value)}
								placeholder="Add a note..."
								className="mb-2 resize-none"
								rows={3}
							/>
							<div className="flex gap-2">
								<Button onClick={handleAddNote} size="sm">
									Add Note
								</Button>
								<Button onClick={cancelEditing} variant="outline" size="sm">
									Cancel
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Notes List */}
				<div className="flex-1 overflow-y-auto p-4">
					{notes.length === 0 ? (
						<div className="text-center text-gray-500 py-8">
							<User size={32} className="mx-auto mb-2 text-gray-300" />
							<p>No notes yet</p>
							<p className="text-sm">
								Add a note to keep track of important information
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{notes.map((note) => (
								<div
									key={note.id}
									className="bg-white border border-gray-200 rounded-lg p-3"
								>
									{editingNoteId === note.id ? (
										<div>
											<Textarea
												value={noteContent}
												onChange={(e) => setNoteContent(e.target.value)}
												className="mb-2 resize-none"
												rows={3}
											/>
											<div className="flex gap-2">
												<Button
													onClick={() => handleUpdateNote(note.id)}
													size="sm"
												>
													Update
												</Button>
												<Button
													onClick={cancelEditing}
													variant="outline"
													size="sm"
												>
													Cancel
												</Button>
											</div>
										</div>
									) : (
										<div>
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center">
													<Avatar className="w-6 h-6 mr-2">
														<AvatarImage src={note.employee.avatar} />
														<AvatarFallback className="text-xs">
															{getEmployeeInitials(note.employee)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="text-sm font-medium">
															{getEmployeeName(note.employee)}
														</div>
														<div className="text-xs text-gray-500">
															{formatTime(note.created_at)}
															{note.updated_at &&
																note.updated_at !== note.created_at && (
																	<span> • edited</span>
																)}
														</div>
													</div>
												</div>
												<Button
													onClick={() => startEditingNote(note)}
													variant="ghost"
													size="sm"
													className="p-1 h-auto"
												>
													<Edit3 size={14} />
												</Button>
											</div>
											<p className="text-sm text-gray-700 whitespace-pre-wrap">
												{note.content}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CustomerSidebar;
