import { ManageKeyInput } from "./ManageKeyInput";

export const ManageZalo = () => {
	return (
		<div className="flex flex-col gap-2">
			<ManageKeyInput keyName="App Id" keyValue="" />

			<ManageKeyInput keyName="App Secret" keyValue="" />

			<ManageKeyInput keyName="Webhook Secret" keyValue="" />
		</div>
	);
};
