import { ManageKeyInput } from "./ManageKeyInput";

export const ManageEmail = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="Domain" keyValue="" />

			<ManageKeyInput keyName="Username" keyValue="" />

			<ManageKeyInput keyName="Password" keyValue="" />
		</div>
	);
};
