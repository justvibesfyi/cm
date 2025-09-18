import type { Company } from "@back/types";
import { Building2, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "./ui/button";

const getCompany = async () => {
	const res = await api.company["my-business"].$get();

	if (!res.ok) {
		return null;
	}

	const { company } = await res.json();
	return company;
};

export default function ManageBusinessSettings() {
	const [businessInfo, setBusinessInfo] = useState({
		name: "...",
		description: "...",
		icon: "",
	} as Company);

	const [saving, setSaving] = useState(false);

	useEffect(() => {
		getCompany().then((c) => {
			if (c) {
				setBusinessInfo(c);
			}
		});
	}, []);

	const updateCompanyInfo = async () => {
		setSaving(true);
		try {
			const res = await api.company.update.$put({
				json: {
					name: businessInfo.name,
					icon: businessInfo.icon,
					description: businessInfo.description,
				},
			});

			if (!res.ok) {
				return;
			}

			const c = await getCompany();
			if (c) {
				setBusinessInfo(c);
			}
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-white border border-zinc-400 rounded-lg p-6">
				<h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
					<Building2 className="w-6 h-6" />
					Business Settings
				</h2>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Business Name
						</label>
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
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Business Icon
						</label>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center">
								{businessInfo.icon ? (
									<img
										src={businessInfo.icon}
										alt="Business icon"
										className="w-12 h-12 rounded"
									/>
								) : (
									<Upload className="w-6 h-6 text-gray-400" />
								)}
							</div>
							<Button className="px-4 py-2 border border-zinc-800 rounded-lg hover:bg-gray-50 transition-colors">
								Upload Icon
							</Button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Business Description
						</label>
						<textarea
							value={businessInfo.description}
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
					disabled={saving}
					className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
				>
					<Save className="w-4 h-4" />
					Save Business Settings
				</Button>
			</div>
		</div>
	);
}
