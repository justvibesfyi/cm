import type { Contact } from "@back/types";
import type React from "react";
import PlatformIcon from "./PlatformIcon";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ContactItemProps {
	contact: Contact;
	isSelected: boolean;
	onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({
	contact,
	isSelected,
	onClick,
}) => {
	return (
		<div
			onClick={onClick}
			className={`
        flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50
        ${isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""}
      `}
		>
			{/* Avatar */}
			<div className="relative flex-shrink-0 mr-3">
				<Avatar>
					<AvatarImage src={contact.avatar} />
					<AvatarFallback>
						{contact.name.slice(0, 2)}
					</AvatarFallback>
				</Avatar>
			</div>

			{/* Contact Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between mb-1">
					<div className="flex items-center space-x-2">
						<h3
							className={`
              font-medium truncate
              ${isSelected ? "text-blue-900" : "text-gray-900"}
            `}
						>
							{contact.name}
						</h3>
						<PlatformIcon className="w-5 h-5" platform={contact.platform} />
					</div>
					<span className="text-xs text-gray-500 flex-shrink-0 ml-2">
						{contact.lastMessageTime}
					</span>
				</div>

				<div className="flex items-center justify-between">
					<p className="text-sm text-gray-600 truncate mr-2">
						{contact.lastMessage}
					</p>
					{contact.unreadCount > 0 && (
						<span className="flex-shrink-0 inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full min-w-[1.25rem] h-5">
							{contact.unreadCount > 99 ? "99+" : contact.unreadCount}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ContactItem;
