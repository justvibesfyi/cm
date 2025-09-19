import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const loginSchema = z.object({
	email: z.email(),
});

const IndexLogin = () => {
	const form = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			const res = await api.auth["start-login"].$post({
				json: {
					email: value.email,
				},
			});

			if (res.status === 200) {
				return;
			}

			const { error } = await res.json();
			console.error("Error logging in with this email:", error);
		},
		validators: {
			onChange: loginSchema,
		},
	});

	return (
		<div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-2xl mx-auto mb-6">
			<form.Field name="email">
				{(field) => (
					<>
						<Input
							type="email"
							placeholder="Enter your email"
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							className="px-4 py-3 rounded-lg text-gray-200 border-gray-400 border-1 w-full md:w-auto flex-grow"
						/>
						<Button
							className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition duration-300 w-full md:w-auto cursor-pointer"
							onClick={async () => await form.handleSubmit()}
						>
							Start Free Trial
						</Button>
					</>
				)}
			</form.Field>
			{!form.state.isValid && (
				<em role="alert">{form.state.errors.join(", ")}</em>
			)}
		</div>
	);
};

export default IndexLogin;
