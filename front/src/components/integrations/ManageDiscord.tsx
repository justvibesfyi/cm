import { ManageKeyInput } from "./ManageKeyInput";

export const ManageDiscord = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="Application ID" keyField="key_1" />
			<ManageKeyInput keyName="Token" keyField="key_2" />
		</div>
	);
};
