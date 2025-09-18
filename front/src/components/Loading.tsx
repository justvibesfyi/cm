function LoadingPage() {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-zinc-900 mb-2">
					Loading...
				</h2>

				<p className="text-zinc-600">Please wait while we set things up</p>

				<div className="flex justify-center mt-6 space-x-1">
					<div
						className="w-3 h-3 bg-zinc-700 rounded-full animate-bounce"
						style={{ animationDelay: "0ms" }}
					></div>
					<div
						className="w-3 h-3 bg-zinc-700 rounded-full animate-bounce"
						style={{ animationDelay: "150ms" }}
					></div>
					<div
						className="w-3 h-3 bg-zinc-700 rounded-full animate-bounce"
						style={{ animationDelay: "300ms" }}
					></div>
				</div>
			</div>
		</div>
	);
}

export default LoadingPage;
