import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	INTEGRATION_METAS,
	usePlatform,
} from "@/context/platform-management-context";
import { PLATFORM_GUIDES } from "./lib/platformGuides";

export const PlatformGuide: React.FC = () => {
	const { selectedIntegration } = usePlatform();

	if (!selectedIntegration) {
		return (
			<Card>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
						<p className="text-muted-foreground">
							Select a platform to see setup instructions
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const meta = INTEGRATION_METAS[selectedIntegration.platform];
	const guide = PLATFORM_GUIDES[selectedIntegration.platform];

	return (
		<Card>
			<CardHeader>
				<CardTitle>{`${meta.name} Setup Guide `}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{guide.steps.map((step, index) => (
						<div key={index} className="flex items-start gap-3">
							<div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
								{index + 1}
							</div>
							<p className="text-sm">{step}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
