import { ManageKeyInput } from "./ManageKeyInput";

export const ManageWhatsapp = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="Business Account ID" keyField="key_1" />

			<ManageKeyInput keyName="Business Account Secret" keyField="key_2" />
		</div>
	);
};
