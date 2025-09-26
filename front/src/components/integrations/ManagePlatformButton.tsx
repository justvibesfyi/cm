import {
	type PlatformMeta,
	usePlatform,
} from "@/context/platform-management-context";
import PlatformIcon from "../PlatformIcon";

interface ManagePlatformProps {
	platform: PlatformMeta;
}

const ManagePlatformButton: React.FC<ManagePlatformProps> = ({ platform }) => {
	const { selectedIntegration: integration, enabledIntegrations } =
		usePlatform();
	const isSelected = integration?.platform === platform.id;
	const isEnabled = enabledIntegrations.has(platform.id);

	const { selectPlatform } = usePlatform();

	return (
		<button
			disabled={!platform.implemented}
			key="telegram"
			type="button"
			className={`relative p-4 h-auto flex-col gap-2 w-full flex border-2 transition-all hover:shadow-md items-center cursor-pointer ${
				isSelected
					? "border-blue-500 bg-blue-50"
					: isEnabled
						? "border-green-200 bg-green-50"
						: "border-gray-200 bg-gray-50 hover:border-gray-300"
			} ${platform.implemented ? "" : "opacity-50 cursor-not-allowed hover:shadow-none"}
			}`}
			onMouseDown={() => {}}
			onKeyDown={() => {}}
			onClick={() => selectPlatform(platform.id)}
		>
			<div
				className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
					isEnabled ? "bg-green-500" : "bg-gray-300"
				}`}
			/>
			<PlatformIcon platform={platform.id} className="w-8 h-8" />
			<span className="text-sm font-medium">{platform.name}</span>
		</button>
	);
};

export default ManagePlatformButton;
