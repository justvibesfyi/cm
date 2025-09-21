import { ManageKeyInput } from "./ManageKeyInput";

export const ManageZalo = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="App ID" keyField="key_1" />

			<ManageKeyInput keyName="App Secret" keyField="key_2" />

			<ManageKeyInput keyName="Webhook Secret" keyField="key_3" />
		</div>
	);
};
