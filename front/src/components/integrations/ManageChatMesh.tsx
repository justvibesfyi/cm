import { ManageKeyInput } from "./ManageKeyInput";

export const ManageChatMesh = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="Api Key" keyField="key_1" />
		</div>
	);
};
