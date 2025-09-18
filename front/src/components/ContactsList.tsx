import type React from "react";
import { useEffect } from "react";
import { useChat } from "@/providers/chat";
import ContactItem from "./ContactItem";

const ContactsList = () => {
	const { convos, selectedConvo, selectConvo } = useChat();

	return (
		<div className="flex-1 overflow-y-auto">
			{convos.length === 0 ? (
				<div className="flex items-center justify-center h-32 text-gray-500">
					No contacts found
				</div>
			) : (
				<div className="divide-y divide-gray-100">
					{convos.map((contact) => (
						<ContactItem
							key={contact.id}
							contact={contact}
							isSelected={selectedConvo?.id === contact.id}
							onClick={() => selectConvo(contact)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ContactsList;
