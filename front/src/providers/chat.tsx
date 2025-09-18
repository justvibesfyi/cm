import type { Customer, Employee, Message } from "@back/types";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { api } from "@/lib/api";

export interface ChatState {
	convos: Customer[];
	selectConvo: (contact: Customer) => void;
	selectedConvo: Customer | null;

	messages: Message[];
}

const ChatContext = createContext<ChatState | undefined>(undefined);

const getConvos = async () => {
	const res = await api.chat.convos.$get();

	if (!res.ok) {
		console.error("Failed to fetch customers");
		return;
	}

	const { convos } = await res.json();
	return convos;
};

const getMessages = async (convoId: number) => {
	const res = await api.chat.convo[":id{\\d+}"].messages.$get({
		param: { id: convoId.toString() },
	});

	if (!res.ok) {
		console.error("Failed to fetch messages");
		return [];
	}

	const { msgs } = await res.json();
	
	console.log(msgs)
	return msgs;
};

export default function ChatProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [convos, setConvos] = useState<Customer[]>([]);
	const [messages, setMessages] = useState([] as Message[]);
	const [selectedConvo, setSelectedConvo] = useState<Customer | null>(null);

	const selectConvo = useCallback((contact: Customer) => {
		setSelectedConvo(contact);
	}, []);

	// FETCH MESSAGES WHEN CONVO IS SELECTED
	useEffect(() => {
		if (!selectedConvo) {
			setMessages([]);
			return;
		}

		getMessages(selectedConvo.id).then((msgs) => {
			setMessages(msgs);
		});
	}, [selectedConvo]);

	// FETCH CONVOS
	useEffect(() => {
		getConvos().then((convos) => {
			if (!convos) return;
			setConvos(convos);
		});
	}, []);

	return (
		<ChatContext.Provider
			value={{
				convos,
				selectConvo,
				selectedConvo,
				messages,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export function useChat() {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error("useContext must be used within a ChatProvider");
	}
	return context;
}
