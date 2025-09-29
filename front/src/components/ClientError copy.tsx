import { Link } from "@tanstack/react-router";
import { AlertCircle, Home } from "lucide-react";
import type React from "react";
import { Button } from "./ui/button";

interface ClientErrorProps {
	title?: string;
	message?: string;
	showHomeLink?: boolean;
}

const ClientError: React.FC<ClientErrorProps> = ({
	title = "Something went wrong",
	message = "We encountered an unexpected error. Please try again or return to the homepage.",
	showHomeLink = true,
}) => {
	return (
		<div className="bg-gray-50 font-sans text-gray-800 min-h-screen">
			<nav className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<Link to="/" className="text-xl font-bold text-indigo-600">
								ChatMesh
							</Link>
						</div>
						<div className="flex items-center">
							<Link
								to="/app"
								className="bg-indigo-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-700"
							>
								Start for Free
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
				<div className="text-center">
					<div className="flex justify-center mb-8">
						<div className="bg-red-50 rounded-full p-6">
							<AlertCircle className="w-16 h-16 text-red-500" />
						</div>
					</div>

					<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
						{title}
					</h1>

					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						{message}
					</p>

					{showHomeLink && (
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button
								asChild
								className="bg-indigo-600 text-white px-8 py-3 font-medium text-lg hover:bg-blue-700 transition duration-300 border border-indigo-600"
							>
								<Link to="/">
									<Home className="w-5 h-5 mr-2" />
									Return to Homepage
								</Link>
							</Button>
						</div>
					)}

					<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-white border border-gray-200 p-6 rounded-lg">
							<h3 className="font-bold text-indigo-600 mb-3">Need Help?</h3>
							<p className="text-gray-600 text-sm mb-4">
								Contact our support team if you continue experiencing issues.
							</p>
							<div className="text-xs text-gray-500 flex items-center">
								<svg
									className="w-3 h-3 text-green-500 mr-1"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								24/7 Support Available
							</div>
						</div>

						<div className="bg-white border border-gray-200 p-6 rounded-lg">
							<h3 className="font-bold text-indigo-600 mb-3">Try Again</h3>
							<p className="text-gray-600 text-sm mb-4">
								Refresh the page or check your internet connection.
							</p>
							<div className="text-xs text-gray-500 flex items-center">
								<svg
									className="w-3 h-3 text-green-500 mr-1"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Usually resolves quickly
							</div>
						</div>

						<div className="bg-white border border-gray-200 p-6 rounded-lg">
							<h3 className="font-bold text-indigo-600 mb-3">Status Updates</h3>
							<p className="text-gray-600 text-sm mb-4">
								Check our status page for any ongoing service issues.
							</p>
							<div className="text-xs text-gray-500 flex items-center">
								<svg
									className="w-3 h-3 text-green-500 mr-1"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Real-time monitoring
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white border-t border-gray-200">
				<div className="text-center">
					<h3 className="text-2xl font-bold mb-4">
						Still Having Issues?
					</h3>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
						Our team is here to help you get back on track with your customer support workflow.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Button
							asChild
							className="bg-gray-100 text-gray-800 px-6 py-3 font-medium hover:bg-gray-200 transition border border-gray-300"
						>
							<Link to="/">
								Go to Homepage
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ClientError;