import { Avatar } from "@radix-ui/react-avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Save, Upload } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { handleFileUpload } from "@/lib/utils";
import { AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const getCompany = async () => {
	const res = await api.company["my-business"].$get();

	if (!res.ok) {
		throw new Error("Failed to fetch company");
	}

	const { company } = await res.json();
	return company;
};

const updateCompanyInfo = async (data: {
	name: string;
	description: string | null;
	icon: string | null;
}) => {
	const res = await api.company.update.$put({
		json: {
			name: data.name,
			description: data.description,
			icon: data.icon,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to update company");
	}
};

export default function ManageBusinessSettings() {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState<{
		name: string;
		description: string;
		icon: string;
	}>({
		name: "",
		description: "",
		icon: "",
	});

	const { data: businessInfo, isFetching } = useQuery({
		queryKey: ["company-info"],
		queryFn: getCompany,
	});

	const mutation = useMutation({
		mutationFn: updateCompanyInfo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["company-info"] });
		},
	});

	// Update form data when business info loads
	if (businessInfo && formData.name === "") {
		setFormData({
			name: businessInfo.name,
			description: businessInfo.description || "",
			icon: businessInfo.icon || "",
		});
	}

	if (isFetching) {
		return (
			<div className="max-w-2xl mx-auto px-4 py-8">
				<section>
					<h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
						<Building2 className="w-6 h-6" />
						Business Settings
					</h2>
					<p className="text-gray-600 mb-8">
						Manage your business information and branding
					</p>

					<div className="space-y-6">
						<div>
							<Skeleton className="h-4 w-32 mb-2" />
							<Skeleton className="h-10 w-full" />
						</div>

						<div>
							<Skeleton className="h-4 w-32 mb-2" />
							<div className="flex items-center gap-4">
								<Skeleton className="w-16 h-16 rounded-full" />
								<Skeleton className="h-10 w-40" />
							</div>
						</div>

						<div>
							<Skeleton className="h-4 w-32 mb-2" />
							<Skeleton className="h-24 w-full" />
						</div>

						<Skeleton className="h-10 w-full" />
					</div>
				</section>
			</div>
		);
	}

	const handleSave = () => {
		mutation.mutate({
			name: formData.name,
			description: formData.description || null,
			icon: formData.icon || null,
		});
	};

	return (
		<div className="max-w-2xl mx-auto px-4 py-8">
			<section>
				<h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
					<Building2 className="w-6 h-6" />
					Business Settings
				</h2>
				<p className="text-gray-600 mb-8">
					Manage your business information and branding
				</p>

				<div className="space-y-6">
					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							Business Name
						</Label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
							placeholder="Enter your business name"
						/>
					</div>

					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							Business Icon
						</Label>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
								{formData.icon ? (
									<Avatar>
										<AvatarImage
											className="w-16 h-16 rounded-full object-cover"
											src={formData.icon}
										/>
									</Avatar>
								) : (
									<Upload className="w-6 h-6 text-gray-400" />
								)}
							</div>

							<label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
								<Upload className="w-4 h-4" />
								<span>Choose Image</span>
								<input
									type="file"
									accept="image/*"
									onChange={async (e) => {
										const url = await handleFileUpload(e);
										if (!url) return;
										setFormData((prev) => ({
											...prev,
											icon: url,
										}));
									}}
									className="hidden"
								/>
							</label>
						</div>
					</div>

					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							Business Description
						</Label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
							placeholder="Describe your business..."
						/>
					</div>

					<Button
						onClick={handleSave}
						disabled={mutation.isPending}
						className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{mutation.isPending ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								Save Business Settings
							</>
						)}
					</Button>
				</div>
			</section>
		</div>
	);
}
