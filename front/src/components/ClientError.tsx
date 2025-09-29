import { Link } from "@tanstack/react-router";
import { AlertCircle, AlertOctagon, Home } from "lucide-react";
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
		<div className="bg-background font-sans text-foreground min-h-screen">
			<nav className="bg-card border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<Link to="/" className="text-xl font-bold text-primary">
								ChatMesh
							</Link>
						</div>
						<div className="flex items-center">
							<Link
								to="/app"
								className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/90"
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
						<AlertCircle className="w-16 h-16 text-destructive" />
					</div>

					<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
						{title}
					</h1>

					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						{message}
					</p>

					{showHomeLink && (
						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<Button
								asChild
								variant="outline"
								size="lg"
								className="px-8 py-3 font-medium text-lg"
							>
								<Link to="/">
									<Home className="w-5 h-5 mr-2" />
									Go Back
								</Link>
							</Button>
						</div>
					)}

					<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-card border border-border p-6 rounded-lg">
							<h3 className="font-bold text-primary mb-3">Need Help?</h3>
							<p className="text-muted-foreground text-sm mb-4">
								Contact our support team if you continue experiencing issues.
							</p>
							<div className="text-xs text-muted-foreground flex items-center">
								<svg
									className="w-3 h-3 text-primary mr-1"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-label="Check mark"
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

						<div className="bg-card border border-border p-6 rounded-lg">
							<h3 className="font-bold text-primary mb-3">Try Again</h3>
							<p className="text-muted-foreground text-sm mb-4">
								Refresh the page or check your internet connection.
							</p>
							<div className="text-xs text-muted-foreground flex items-center">
								<svg
									className="w-3 h-3 text-primary mr-1"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-label="Check mark"
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

						<div className="bg-card border border-border p-6 rounded-lg">
							<h3 className="font-bold text-primary mb-3">Status Updates</h3>
							<p className="text-muted-foreground text-sm mb-4">
								Check our status page for any ongoing service issues.
							</p>
							<div className="text-xs text-muted-foreground flex items-center">
								<svg
									className="w-3 h-3 text-primary mr-1"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-label="Check mark"
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
		</div>
	);
};

export default ClientError;
