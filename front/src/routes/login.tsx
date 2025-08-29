import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import {
	ArrowLeft,
	Check,
	Mail,
	MessageCircle,
	MessageSquare,
	Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

const searchSchema = z.object({
	email: z.string().optional().catch(""),
});

const LoginPage = () => {
	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });
	
	const [email, setEmail] = useState(search.email || "");
	const [authCode, setAuthCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [codeSent, setCodeSent] = useState(false);

	useEffect(() => {
		if (codeSent) {
			const timer = setTimeout(() => {
				setCodeSent(false);
				setMessage("");
			}, 60000);

			return () => clearTimeout(timer);
		}
	}, [codeSent]);

	// Auto-verify when 6 digits are entered
	useEffect(() => {
		if (authCode.length === 6 && codeSent) {
			verifyCode();
		}
	}, [authCode, codeSent]);

	const sendEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage("");
		
		try {
			const res = await api.auth["start-login"].$post({
				json: { email },
			});

			if (res.status === 200) {
				setCodeSent(true);
				setMessage("Check your email for the verification code!");
				return;
			}

			if (res.status === 422) {
				setMessage("Please wait 60 seconds before trying again");
				return;
			}

			setMessage("Failed to send verification code. Please try again.");
		} catch (error) {
			setMessage("Failed to send verification code. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const verifyCode = async () => {
		if (authCode.length !== 6) return;
		
		setIsLoading(true);
		setMessage("");

		try {
			const res = await api.auth["verify-login"].$post({
				json: { email, code: authCode },
			});

			if (res.status === 200) {
				setMessage("Login successful! Redirecting...");
				// Small delay to show success message
				setTimeout(() => {
					navigate({ to: "/app" });
				}, 1000);
				return;
			}

			setMessage("Invalid verification code. Please try again.");
			setAuthCode("");
		} catch (error) {
			setMessage("Verification failed. Please try again.");
			setAuthCode("");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		setCodeSent(false);
		setAuthCode("");
		setMessage("");
	};

	const formatAuthCode = (value: string) => {
		const digits = value.replace(/\D/g, "").slice(0, 6);
		return digits;
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center px-4">
			<div className="max-w-md w-full">
				{/* Logo and Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mb-4">
						<MessageSquare className="w-12 h-12 text-blue-500 mr-3" />
						<span className="text-3xl font-bold text-black">ChatMesh</span>
					</div>
					<h1 className="text-2xl font-bold mb-2 text-black">
						{codeSent ? "Enter Verification Code" : "Welcome Back"}
					</h1>
					<p className="text-zinc-600">
						{codeSent
							? `We sent a 6-digit code to ${email}`
							: "Enter your email to receive a verification code"}
					</p>
				</div>

				{/* Auth Code Form */}
				{codeSent ? (
					<div className="space-y-6">
						<div>
							<label
								htmlFor="authCode"
								className="block text-sm font-medium text-zinc-700 mb-2"
							>
								Verification Code
							</label>
							<Input
								type="text"
								value={authCode}
								onChange={(e) => setAuthCode(formatAuthCode(e.target.value))}
								placeholder="000000"
								className="w-full px-4 py-3 bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-center text-2xl font-mono tracking-widest"
								maxLength={6}
								disabled={isLoading}
								autoFocus
							/>
							<p className="text-xs text-zinc-500 mt-1">
								Code is valid for up to 5 minutes
							</p>
						</div>

						<button
							type="button"
							onClick={handleBack}
							className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-zinc-900 py-2 transition-colors"
							disabled={isLoading}
						>
							<ArrowLeft className="w-4 h-4" />
							Back to email
						</button>
					</div>
				) : (
					/* Email Form */
					<form onSubmit={sendEmail} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-zinc-700 mb-2"
							>
								Email Address
							</label>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="w-full px-4 py-3 bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
								required
								disabled={isLoading}
								autoFocus
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading || !email}
							className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 transition-colors"
						>
							{isLoading ? "Sending..." : "Send Verification Code"}
						</button>
					</form>
				)}

				{/* Message Display */}
				{message && (
					<div
						className={`mt-4 p-4 border ${
							message.includes("successful") || message.includes("Check your email")
								? "bg-green-50 border-green-200 text-green-800"
								: "bg-red-50 border-red-200 text-red-800"
						}`}
					>
						<div className="flex items-center">
							{(message.includes("successful") || message.includes("Check your email")) && (
								<Check className="w-5 h-5 mr-2" />
							)}
							<span>{message}</span>
						</div>
					</div>
				)}

				{/* Platform Icons */}
				<div className="mt-12 text-center">
					<p className="text-zinc-600 mb-6">
						Unify all your messaging platforms
					</p>
					<div className="flex justify-center space-x-6">
						<div className="w-10 h-10 bg-green-100 flex items-center justify-center">
							<MessageSquare className="w-5 h-5 text-green-600" />
						</div>
						<div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
							<Send className="w-5 h-5 text-blue-600" />
						</div>
						<div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
							<MessageCircle className="w-5 h-5 text-purple-600" />
						</div>
						<div className="w-10 h-10 bg-red-100 flex items-center justify-center">
							<Mail className="w-5 h-5 text-red-600" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Route = createFileRoute("/login")({
	component: LoginPage,
	validateSearch: (search) => searchSchema.parse(search),
});
