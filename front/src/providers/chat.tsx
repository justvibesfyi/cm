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
	selectConvo: (contact: Customer | null) => void;
	selectedConvo: Customer | null;

	messages: Message[];
	sendMessage: (content: string, convo_id: number) => Promise<void>;

	showContacts: boolean;
	setShowContacts: (val: boolean) => void;

	employees: Employee[];
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

const getEmployees = async () => {
	const res = await api.employee.all.$get();

	if (!res.ok) {
		console.error("Failed to fetch employees");
		return;
	}

	const { employees } = await res.json();
	return employees;
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

	console.log("Raw msgs: ", msgs);
	return msgs;
};

const sendMessage = async (content: string, convo_id: number) => {
	const res = await api.chat.send.$post({
		json: { content, customer_id: convo_id },
	});

	if (!res.ok) {
		console.error("Failed to send message");
	}
};

export default function ChatProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [convos, setConvos] = useState<Customer[]>([]);
	const [messages, setMessages] = useState([] as Message[]);
	const [selectedConvo, setSelectedConvo] = useState<Customer | null>(null);
	const [employees, setEmployees] = useState<Employee[]>([]);

	const [showContacts, setShowContacts] = useState(true);

	const selectConvo = (contact: Customer | null) => {
		setSelectedConvo((prev) => (prev?.id === contact?.id ? null : contact));
	};

	const handleSendMessage = useCallback(
		async (content: string, convo_id: number) => {
			await sendMessage(content, convo_id);
			await getMessages(convo_id).then((msgs) => {
				setMessages(msgs);
			});
		},
		[],
	);

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
		let isMounted = true;
		let timeoutId: NodeJS.Timeout | undefined;

		const fetchConvos = async () => {
			if (!isMounted) return;

			try {
				const newConvos = await getConvos();
				if (isMounted && newConvos) {
					setConvos(newConvos);
				}
			} catch (error) {
				console.error("Failed to fetch conversations:", error);
			}

			try {
				const newEmployees = await getEmployees();
				if (isMounted && newEmployees) {
					setEmployees(newEmployees);
				}
			} catch (error) {
				console.error("Failed to fetch conversations:", error);
			}

			if (isMounted) {
				timeoutId = setTimeout(fetchConvos, 3000);
			}
		};

		fetchConvos();

		return () => {
			isMounted = false;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, []);

	return (
		<ChatContext.Provider
			value={{
				convos,
				selectConvo,
				selectedConvo,
				messages,
				sendMessage: handleSendMessage,

				showContacts,
				setShowContacts,

				employees
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
