import type { CustomerStatus, Employee } from "@back/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from "./api";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const handleFileUpload = async (
	event: React.ChangeEvent<HTMLInputElement>,
): Promise<string | null> => {
	const file = event.target.files?.[0];
	if (!file) return null;

	try {
		const formData = new FormData();
		formData.append("image", file);

		const res = await api.upload["user-profile"].$post({
			form: {
				image: file,
			},
		});

		if (!res.ok) {
			throw new Error("Failed to upload image");
		}
		const result = await res.json();
		return `${window.location.protocol}//${window.location.host}${result.url}`;
	} catch (error) {
		console.error("Upload error:", error);
		return null;
	}
};

export const getStatusColor = (status: CustomerStatus) => {
	switch (status) {
		case "online":
			return "bg-green-500";
		case "idle":
			return "bg-yellow-500";
		case "offline":
			return "bg-gray-400";
		default:
			return "bg-amber-400";
	}
};

export const getEmployeeFullName = (employee: Employee) => {
	if (employee.first_name && employee.last_name) {
		return `${employee.first_name} ${employee.last_name}`;
	} else if (employee.first_name) {
		return employee.first_name;
	} else if (employee.last_name) {
		return employee.last_name;
	} else {
		return employee.email;
	}
}

export const getEmployeeInitials = (employee: Employee) => {
	if (employee.first_name && employee.last_name) {
		return `${employee.first_name[0]}${employee.last_name[0]}`;
	} else if (employee.first_name) {
		return employee.first_name.slice(0, 2);
	} else if (employee.last_name) {
		return employee.last_name.slice(0, 2);
	} else {
		return employee.email.slice(0, 2);
	}
}