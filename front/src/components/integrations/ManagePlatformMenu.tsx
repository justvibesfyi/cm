import { INTEGRATION_METAS } from "@/context/platform-management-context";
import ManagePlatformButton from "./ManagePlatformButton";

export const ManagePlatformMenu = () => {
	return (
		<div className="grid grid-cols-3 gap-3">
			{Object.entries(INTEGRATION_METAS).map(([platformKey, platform]) => (
				<ManagePlatformButton key={platformKey} platform={platform} />
			))}
		</div>
	);
};
