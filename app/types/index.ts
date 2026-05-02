export interface ProjectCardMeta {
	color?: string;
	slug?: string;
	icon?: string;
	type?: string;
	stage?: string;
	technologies?: string[];
	backgroundImage?: string;
	background?: string;
	demo?: string;
	github?: string;
}

export interface TimelineProject {
	_path?: string;
	date?: string;
	[key: string]: unknown;
}

export interface MonthData {
	month: string;
	year: number;
	projects?: TimelineProject[];
}

export interface ProjectLink {
	text?: string;
	label?: string;
	url?: string;
	href?: string;
	icon?: string;
}

export interface ImageItem {
	src: string;
	alt?: string;
}

export type ProjectType =
	| "website"
	| "app"
	| "library"
	| "tool"
	| "design"
	| "other";
export type ProjectStage = "idea" | "wip" | "completed" | "archived";

export interface ProjectMeta {
	slug?: string;
	type?: ProjectType;
	stage?: ProjectStage;
	featured?: boolean;
	technologies?: string[];
	tags?: Array<{ name: string; color: string; icon?: string }>;
	color?: string;
	icon?: string;
	backgroundImage?: string;
	background?: string;
	demo?: string;
	github?: string;
	logo?: string;
	behance?: string;
	dribbble?: string;
	dprofile?: string;
	backgroundOpacity?: "default" | "opaque";
	linksTop?: ProjectLink[];
	linksBottom?: ProjectLink[];
	gallery?: Array<string | ImageItem>;
	[key: string]: unknown;
}

export interface ProjectContent {
	title: string;
	description: string;
	date: string;
	meta: ProjectMeta;
	links?: ProjectLink[];
	body?: unknown;
	[key: string]: unknown;
}
