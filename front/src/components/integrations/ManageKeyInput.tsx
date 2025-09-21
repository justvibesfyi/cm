import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ManageKeyInputProps {
	keyName: string;
	keyValue: string;
}

export const ManageKeyInput: React.FC<ManageKeyInputProps> = ({
	keyName,
	keyValue,
}) => {
	const [showKey, setShowKey] = useState(false);
	return (
		<div className="space-y-3">
			<Label className="block text-sm font-medium text-gray-700">
				{keyName}
			</Label>
			<div className="flex gap-2">
				<div className="flex-1 relative">
					<Input
						type={showKey ? "text" : "password"}
						value={keyValue || ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
						onChange={(e) => {}}
						placeholder={`Enter ${keyName}...`}
					/>
				</div>
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => setShowKey((prev) => !prev)}
				>
					{showKey ? (
						<EyeOff className="w-4 h-4" />
					) : (
						<Eye className="w-4 h-4" />
					)}
				</Button>
			</div>
		</div>
	);
};
