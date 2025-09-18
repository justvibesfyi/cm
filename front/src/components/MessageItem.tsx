import type { Message } from "@back/types";
import type React from "react";

interface MessageItemProps {
	message: Message;
	showAvatar: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, showAvatar }) => {
	const formatTime = (timestamp: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}).format(timestamp);
	};

  const isOwn = message.employee_id !== null;

	return (
		<div
			className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end space-x-2`}
		>
			<div
				className={`
        max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative
        ${
					isOwn
						? "bg-blue-500 text-white rounded-br-md"
						: "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
				}
      `}
			>
				<p className="text-sm leading-relaxed">{message.content}</p>
				<p
					className={`
          text-xs mt-1 
          ${isOwn ? "text-blue-100" : "text-gray-500"}
        `}
				>
					{formatTime(new Date(message.created_at))}
				</p>
			</div>
		</div>
	);
};

export default MessageItem;
