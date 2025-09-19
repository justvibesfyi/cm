import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, Building, Building2, LogOut, Settings, Settings2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserProfile = () => {
	const { user, logout } = useAuth();

	const getStatusColor = (status: string) => {
		switch (status) {
			case "online":
				return "bg-green-500";
			case "away":
				return "bg-yellow-500";
			case "offline":
				return "bg-gray-400";
			default:
				return "bg-gray-400";
		}
	};

	// todo skeleton
	if (!user) {
		return <div>...</div>;
	}

	return (
		<div className="p-4 border-t">
			<div className="flex items-center">
				<div className="relative flex-shrink-0 mr-3">
					<Avatar>
						<AvatarImage src={user.avatar} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>

				<div className="flex-1 min-w-0">
					<h4 className="font-medium text-gray-900 truncate">
						{user.first_name} {user.last_name}
					</h4>
					{/* <p className="text-sm text-gray-500 truncate">...</p> */}
				</div>

				<div className="flex items-center space-x-1 ml-2">
					<DropdownMenu>
						<DropdownMenuTrigger className="border p-2 rounded-md">
							<Settings size={16} className="text-gray-600" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Building2 size={16} className="mr-2" />
								<Link to="/manage">Manage Company</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="font-bold text-red-700 cursor-pointer"
								onClick={logout}
							>
								<LogOut size={16} className="mr-2" />
								Log Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
