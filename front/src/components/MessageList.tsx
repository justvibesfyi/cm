import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import MessageItem from "./MessageItem";

interface MessageListProps {
	messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

	// Simple virtualization: show last 50 messages initially
	useEffect(() => {
		const startIndex = Math.max(0, messages.length - 50);
		setVisibleMessages(messages.slice(startIndex));
	}, [messages]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [visibleMessages]);

	// Load more messages on scroll to top
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop } = e.currentTarget;

		if (scrollTop === 0 && visibleMessages.length < messages.length) {
			const currentVisibleCount = visibleMessages.length;
			const newCount = Math.min(currentVisibleCount + 20, messages.length);
			const startIndex = messages.length - newCount;

			setVisibleMessages(messages.slice(startIndex));
		}
	};

	return (
		<div
			ref={containerRef}
			onScroll={handleScroll}
			className="h-full overflow-y-auto p-4 space-y-4"
		>
			{/* {visibleMessages.length < messages.length && (
				<div className="text-center py-2">
					<button className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
						Load more messages
					</button>
				</div>
			)} */}

			{visibleMessages.map((message, index) => (
				<MessageItem
					key={message.id}
					message={message}
					showAvatar={
						index === 0 ||
						visibleMessages[index - 1].senderId !== message.senderId ||
						new Date(message.timestamp).getTime() -
							new Date(visibleMessages[index - 1].timestamp).getTime() >
							300000
					}
				/>
			))}

			<div ref={messagesEndRef} />
		</div>
	);
};

export default MessageList;
