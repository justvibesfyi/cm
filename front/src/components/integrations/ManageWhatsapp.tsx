import { ManageKeyInput } from "./ManageKeyInput";

export const ManageWhatsapp = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="Business Account Id" keyValue="" />

			<ManageKeyInput keyName="Business Account Secret" keyValue="" />
		</div>
	);
};
