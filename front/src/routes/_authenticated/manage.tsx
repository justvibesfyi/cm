import { createFileRoute } from "@tanstack/react-router";
import {
	Building2,
	MessageCircle,
	Monitor,
	Smartphone,
	Tablet,
	Users,
} from "lucide-react";
import { useState } from "react";
import ManageIntegrations from "@/components/integrations/ManageIntegrations";
import ManageBusinessSettings from "@/components/ManageBusinessSettings";
import { ManageEmployees } from "@/components/ManageEmployees";
import { ManageSessions } from "@/components/ManageSessions";
// Shadcn components
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@/components/ui/sidebar";

type MenuSection = "platforms" | "sessions" | "employees" | "company";

function ManagePage() {
	const [activeSection, setActiveSection] = useState<MenuSection>("platforms");


	const menuItems = [
		{ id: "platforms" as MenuSection, label: "Platforms", icon: MessageCircle },
		{ id: "sessions" as MenuSection, label: "Sessions", icon: Monitor },
		{ id: "employees" as MenuSection, label: "Employees", icon: Users },
		{ id: "company" as MenuSection, label: "Company Info", icon: Building2 },
	]

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Manage Company</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menuItems.map((item) => (
									<SidebarMenuItem key={item.label}>
										<SidebarMenuButton
											isActive={activeSection === item.id}
											onClick={() => setActiveSection(item.id)}
										>
											<item.icon className="w-4 h-4" />
											<span>{item.label}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter></SidebarFooter>
			</Sidebar>

			<main className="w-full">
				{activeSection === "platforms" && <ManageIntegrations />}
				{activeSection === "sessions" && <ManageSessions />}
				{activeSection === "employees" && <ManageEmployees />}
				{activeSection === "company" && <ManageBusinessSettings />}
			</main>
		</SidebarProvider>
	)
}

export const Route = createFileRoute("/_authenticated/manage")({
	component: ManagePage,
});
