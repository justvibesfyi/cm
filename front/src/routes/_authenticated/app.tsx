import { createFileRoute } from "@tanstack/react-router";
import MainApp from "@/components/chat/MainApp";
import ChatProvider from "@/providers/chat";

export const Route = createFileRoute("/_authenticated/app")({
	component: AppComponent,
});

function AppComponent() {
	return (
		<ChatProvider>
			<MainApp />
		</ChatProvider>
	);
}
