import type { Company } from "@back/types";
import { Avatar } from "@radix-ui/react-avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { handleFileUpload } from "@/lib/utils";
import { AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

const updateCompanyInfo = async () => {
	const res = await api.company.update.$put({
		json: {
			name: businessInfo.name,
			description: businessInfo.description,
			icon: businessInfo.icon,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to update company");
	}
};

export default function ManageBusinessSettings() {
	const [saving, setSaving] = useState(false);

	const queryClient = useQueryClient();
	const [_, setBusinessInfo] = useState<Company>({
		name: "",
		description: "",
		icon: "",
	});

	const {
		data: businessInfo,
		isFetching,
		isError,
	} = useQuery({
		queryKey: ["company-info"],
		queryFn: getCompany,
	});

	const mutation = useMutation({
		mutationFn: updateCompanyInfo,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["company-info"] });
		},
	});

	if (isFetching) {
		return (
			<div className="space-y-6">
				<div className="bg-white border border-zinc-400 rounded-lg p-6">
					<h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
						<Building2 className="w-6 h-6" />
						Business Settings
					</h2>

					<div className="space-y-4">
						<div>
							<Skeleton className="block text-sm mb-2 h-4 w-32" />
							<Skeleton className="cursor-pointer h-8 w-full px-6 py-3 transition-colors flex items-center gap-2" />
						</div>

						<div>
							<Skeleton className="block text-sm mb-2 h-4 w-32" />
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 rounded-full flex items-center justify-center">
									<Skeleton className="w-16 h-16 rounded-full" />
								</div>

								<Skeleton className="cursor-pointer h-8 w-full px-6 py-3 transition-colors flex items-center gap-2"></Skeleton>
							</div>
						</div>

						<div>
							<Skeleton className="block mb-2 h-4 w-32" />
							<Skeleton className="w-full h-32 px-3 py-2 rounded-lg" />
						</div>
						<Skeleton className="cursor-pointerh-8 w-full px-6 py-3 transition-colors flex items-center gap-2"></Skeleton>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="bg-white border border-zinc-400 rounded-lg p-6">
				<h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
					<Building2 className="w-6 h-6" />
					Business Settings
				</h2>

				<div className="space-y-4">
					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							Business Name
						</Label>
						<input
							type="text"
							value={businessInfo.name}
							onChange={(e) =>
								setBusinessInfo({ ...businessInfo, name: e.target.value })
							}
							className="w-full px-3 py-2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						/>
					</div>

					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							Business Icon
						</Label>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 border border-dashed border-zinc-800 rounded-full flex items-center justify-center">
								{businessInfo.icon ? (
									<Avatar className="">
										<AvatarImage
											className="w-16 h-16 rounded-full"
											src={businessInfo.icon}
										></AvatarImage>
									</Avatar>
								) : (
									<Upload className="w-6 h-6 text-gray-400" />
								)}
							</div>

							<label className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-6 py-3 transition-colors flex items-center gap-2">
								<Upload className="w-5 h-5" />
								<span>Choose Image</span>
								<input
									type="file"
									accept="image/*"
									onChange={async (e) => {
										const url = await handleFileUpload(e);
										console.log(url);
										if (!url) return;
										setBusinessInfo((prev) => ({
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
							value={businessInfo.description || ""}
							onChange={(e) =>
								setBusinessInfo({
									...businessInfo,
									description: e.target.value,
								})
							}
							rows={4}
							className="w-full px-3 py-2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
						/>
					</div>
				</div>

				<Button
					onClick={updateCompanyInfo}
					disabled={isFetching || saving}
					className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
				>
					<Save className="w-4 h-4" />
					Save Business Settings
				</Button>
			</div>
		</div>
	);
}
