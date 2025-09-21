import type { Platform } from "@back/types";
import { usePlatform } from "@/context/platform-management-context";
import PlatformIcon from "../PlatformIcon";

interface ManagePlatformProps {
	platform: {
		id: Platform;
		name: string;
	};
}

const ManagePlatformButton: React.FC<ManagePlatformProps> = ({ platform }) => {
	const { selectedIntegration: integration, enabledIntegrations } =
		usePlatform();
	const isSelected = integration?.platform === platform.id;
	const isEnabled = enabledIntegrations.has(platform.id);

	const { selectPlatform } = usePlatform();

	return (
		<button
			key="telegram"
			type="button"
			className={`relative p-4 h-auto flex-col gap-2 w-full flex items-center cursor-pointer ${
				isSelected ? "border-2 border-blue-400" : "border"
			}`}
			onKeyDown={() => {}}
			onClick={() => selectPlatform(platform.id)}
		>
			<div
				className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
					isEnabled ? "bg-green-500" : "bg-gray-300"
				}`}
			/>
			<PlatformIcon platform={platform.id} className="w-10 h-10" />
			<span className="text-sm font-medium">{platform.name}</span>
		</button>
	);
};

export default ManagePlatformButton;
