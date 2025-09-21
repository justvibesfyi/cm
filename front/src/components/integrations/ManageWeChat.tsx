import { ManageKeyInput } from "./ManageKeyInput";

export const ManageWeChat = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="API Key" keyField="key_1" />

			<ManageKeyInput keyName="API Secret" keyField="key_2" />
		</div>
	);
};
