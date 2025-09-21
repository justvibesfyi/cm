import { ManageKeyInput } from "./ManageKeyInput";

export const ManageEmail = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="Domain" keyField="key_1" />

			<ManageKeyInput keyName="Username" keyField="key_2" />

			<ManageKeyInput keyName="Password" keyField="key_3" />
		</div>
	);
};
