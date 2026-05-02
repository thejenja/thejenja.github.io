export const getTypeIcon = (type: string): string => {
	const iconMap: Record<string, string> = {
		"web-app": "mingcute:globe-fill",
		"mobile-app": "lucide:smartphone",
		website: "mingcute:globe-fill",
		library: "mingcute:package-fill",
		tool: "lucide:wrench",
		game: "lucide:gamepad-2",
		design: "mingcute:palette-fill",
	};
	return iconMap[type] || "mingcute:code-fill";
};

export const getStageIcon = (stage: string): string => {
	const iconMap: Record<string, string> = {
		planning: "mingcute:clock-fill",
		"in-progress": "mingcute:code-fill",
		completed: "mingcute:check-circle-fill",
		"on-hold": "mingcute:pause-fill",
		archived: "mingcute:archive-fill",
	};
	return iconMap[stage] || "mingcute:code-fill";
};
