import { ManageKeyInput } from "./ManageKeyInput";

export const ManageWeChat = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="Api Key" keyValue="" />

			<ManageKeyInput keyName="Api Secret" keyValue="" />
		</div>
	);
};
