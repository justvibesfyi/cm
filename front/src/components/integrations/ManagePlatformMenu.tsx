import { usePlatform } from "@/context/platform-management-context";
import ManagePlatformButton from "./ManagePlatformButton";

export const ManagePlatformMenu = () => {
	const { integrationMetas } = usePlatform();
	return (
		<div className="grid grid-cols-3 gap-3">
			{integrationMetas.map((platform) => (
				<ManagePlatformButton key={platform.id} platform={platform} />
			))}
		</div>
	);
};
