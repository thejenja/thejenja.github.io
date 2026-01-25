<template>
	<div class="project-card-wrapper">
		<NuxtLinkLocale
			:to="getProjectLink()"
			:class="['project-card', { 'project-card--compact': compact }]"
			:style="{
				'--accent': project.meta?.color || '#4b5563',
				viewTransitionName: project.meta?.slug ? `project-card-${project.meta.slug}` : undefined,
			}"
			@click="handleProjectClick"
		>
			<div
				class="project-background"
				:style="{
					...backgroundStyle,
					viewTransitionName: transitionName('bg'),
				}"
				:class="{ 'background-opaque': backgroundOpacity === 'opaque' }"
			>
				<div v-if="hasBackground" class="background-image-container">
					<img
						:src="backgroundImageUrl"
						:alt="`${project.title} background`"
						class="background-image"
						:class="{ 'background-opaque': backgroundOpacity === 'opaque' }"
						width="400"
						height="300"
						loading="lazy"
					/>
					<div
						class="background-overlay"
						:class="{ 'background-opaque': backgroundOpacity === 'opaque' }"
					/>
				</div>

				<div v-else class="gradient-background" />

				<div class="project-content">
					<div
						class="project-logo"
						:style="{ viewTransitionName: transitionName('logo') }"
					>
						<img
							v-if="showLogo && finalLogoPath && !logoLoadFailed"
							:src="finalLogoPath"
							:alt="`${project.title} logo`"
							class="project-logo-image"
							width="200"
							height="120"
							loading="lazy"
							@error="handleLogoError"
						/>

						<div v-else class="project-fallback">
							<div v-if="project.meta?.icon" class="project-icon">
								{{ project.meta.icon }}
							</div>

							<div v-else class="project-title-fallback">
								{{ project.title }}
							</div>
						</div>
					</div>

					<div class="project-meta-overlay">
						<div v-if="project.meta?.type" class="meta-badge">
							<div class="meta-badge__icon">
								<DynamicIcon
									:icon="getTypeIcon(project.meta.type!)"
									size="16"
								/>
							</div>
							<div class="meta-badge__text-wrapper">
								<span class="meta-badge__text">
									{{ t(`projectTypes.${project.meta.type}`) }}
								</span>
							</div>
						</div>

						<div v-if="project.meta?.stage" class="meta-badge">
							<div class="meta-badge__icon">
								<DynamicIcon
									:icon="getStageIcon(project.meta.stage!)"
									size="16"
								/>
							</div>
							<div class="meta-badge__text-wrapper">
								<span class="meta-badge__text">
									{{ t(`projectStages.${project.meta.stage}`) }}
								</span>
							</div>
						</div>
					</div>

					<div class="project-info">
						<h3
							class="project-title"
							:style="{ viewTransitionName: transitionName('title') }"
						>
							{{ project.title }}
						</h3>
						<p v-if="showDescription" class="project-description">
							{{ project.description }}
						</p>

						<div
							v-if="showTags && project.meta?.technologies"
							class="project-tags"
						>
							<TechTag
								v-for="tech in project.meta.technologies.slice(0, maxTags)"
								:key="tech"
								:tag-slug="tech"
								:clickable="false"
							/>
							<span
								v-if="project.meta.technologies.length > maxTags && !compact"
								class="project-tag project-tag--more"
							>
								+{{ project.meta.technologies.length - maxTags }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</NuxtLinkLocale>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import TechTag from "./TechTag.vue";
import DynamicIcon from "./DynamicIcon.vue";

interface ProjectMeta {
	slug?: string;
	color?: string;
	background?: string;
	backgroundImage?: string;
	logo?: string; // Разрешаем явное указание пути к лого в frontmatter
	technologies?: string[];
	tags?: Array<{
		name: string;
		color: string;
		icon?: string;
	}>;
	type?:
		| "web-app"
		| "mobile-app"
		| "website"
		| "library"
		| "tool"
		| "game"
		| "design";
	stage?: "planning" | "in-progress" | "completed" | "on-hold" | "archived";
	featured?: boolean;
	github?: string;
	demo?: string;
	date?: string;
	icon?: string;
	behance?: string;
	dribbble?: string;
	backgroundOpacity?: "default" | "opaque";
}

interface ProjectContent {
	title?: string;
	description?: string;
	body?: unknown;
	meta?: ProjectMeta;
	_path?: string;
}

interface Props {
	project: ProjectContent;
	compact?: boolean;
	showLogo?: boolean;
	showText?: boolean;
	showInfo?: boolean;
	showDescription?: boolean;
	showTags?: boolean;
	maxTags?: number;
	standalone?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	compact: false,
	showLogo: true,
	showText: false,
	showInfo: true,
	showDescription: true,
	showTags: true,
	maxTags: 3,
	standalone: false,
});

const emit = defineEmits<{
	"project-click": [project: ProjectContent];
}>();

// --- LOGO LOGIC ---
const logoLoadFailed = ref(false);

const handleLogoError = () => {
	logoLoadFailed.value = true;
};

// Вычисляем путь к лого: либо из meta.logo, либо стандартный
const finalLogoPath = computed(() => {
	const slug = props.project.meta?.slug;
	if (props.project.meta?.logo) return props.project.meta.logo;
	if (slug) return `/projects/${slug}/logo.svg`;
	return undefined;
});

// --- ASSETS & BG ---
const backgroundImageUrl = computed(() => {
	return props.project?.meta?.backgroundImage || undefined;
});

const hasBackground = computed(() => {
	return Boolean(backgroundImageUrl.value);
});

const backgroundStyle = computed(() => {
	const meta = props.project?.meta || {};
	const backgroundCss =
		typeof meta.background === "string" ? meta.background : undefined;
	if (backgroundCss) {
		return { background: backgroundCss };
	}
	return { background: (meta.color as string) || "#4b5563" };
});

const getTypeIcon = (type: string) => {
	const iconMap: Record<string, string> = {
		"web-app": "lucide:globe",
		"mobile-app": "lucide:smartphone",
		website: "lucide:globe",
		library: "lucide:package",
		tool: "lucide:wrench",
		game: "lucide:gamepad-2",
		design: "lucide:palette",
	};
	return iconMap[type] || "lucide:code";
};

const getStageIcon = (stage: string) => {
	const iconMap: Record<string, string> = {
		planning: "lucide:clock",
		"in-progress": "lucide:code",
		completed: "lucide:check-circle",
		"on-hold": "lucide:pause",
		archived: "lucide:archive",
	};
	return iconMap[stage] || "lucide:code";
};

const getProjectLink = () => {
	const slug =
		props.project.meta?.slug ||
		(props.project._path ? props.project._path.split("/").pop() : "");

	if (slug) {
		return `/projects/${slug}`;
	}
	return "#";
};

const handleProjectClick = (event: MouseEvent) => {
	if (props.standalone) {
		emit("project-click", props.project);
		event.preventDefault();
		return;
	}

	const slug =
		props.project.meta?.slug ||
		(props.project._path ? props.project._path.split("/").pop() : "");

	if (!slug) {
		event.preventDefault();
		if (props.project.meta?.type === "design") {
			if (props.project.meta?.behance) {
				window.open(props.project.meta.behance, "_blank");
				return;
			}
			if (props.project.meta?.dribbble) {
				window.open(props.project.meta.dribbble, "_blank");
				return;
			}
		}
		if (props.project.meta?.demo) {
			window.open(props.project.meta.demo, "_blank");
		} else if (props.project.meta?.github) {
			window.open(props.project.meta.github, "_blank");
		}
	}
};

const backgroundOpacity = computed(() => {
	return props.project?.meta?.backgroundOpacity || "default";
});

const { t } = useNuxtApp().$i18n || { t: (key: string) => key };

const transitionName = (element: string) => {
	const slug = props.project.meta?.slug;
	if (!slug) return undefined;
	const safeSlug = slug.replace(/[^a-z0-9-_]/gi, "");
	return `project-${element}-${safeSlug}`;
};
</script>

<style scoped>
.project-card-wrapper {
	position: relative;
}

.project-card {
	background: var(--bg-secondary);
	border-radius: 16px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	border: 1px solid var(--border);
	text-align: left;
	width: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	aspect-ratio: 16/9;
	text-decoration: none;
}

.project-card:hover {
	box-shadow:
		0 20px 40px rgba(0, 0, 0, 0.15),
		0 8px 16px rgba(0, 0, 0, 0.1);
	border-color: color-mix(in srgb, var(--accent) 60%, var(--text));
}

.project-card:active {
	transform: translateY(-2px);
}

.project-card:link,
.project-card:visited,
.project-card:active {
	color: inherit;
}

.project-card:focus {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

.project-card--compact {
	aspect-ratio: 3/2;
}

.project-background {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	contain: paint;
}

.background-image-container {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
}

.background-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0.8;
	transition: opacity 0.3s ease;
}

.background-image.background-opaque {
	opacity: 1;
}

.background-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1;
	transition: background 0.3s ease;
}

.project-card:hover .background-overlay {
	background: rgba(0, 0, 0, 0.7);
}

.background-overlay.background-opaque {
	background: rgba(0, 0, 0, 0);
}

.project-content {
	position: relative;
	z-index: 2;
	height: 100%;
	display: flex;
	flex-direction: column;
	color: white;
	padding: 2rem;
}

.project-card--compact .project-content {
	padding: 1rem;
}

.project-logo {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: auto 0;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	opacity: 1;
	transform: translateY(0);
	width: 100%;
}

.project-card:hover .project-logo {
	opacity: 0;
	transform: translateY(-20px) scale(0.95);
	pointer-events: none;
}

.project-logo-image {
	max-width: 240px;
	min-height: 80px;
	max-height: 140px;
	width: auto;
	height: auto;
	transition: transform 0.3s ease;
	object-fit: contain;
}

.project-fallback {
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.project-icon {
	font-size: 4rem;
	line-height: 1;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.project-title-fallback {
	font-size: 2.5rem;
	font-weight: 800;
	line-height: 1.1;
	text-transform: uppercase;
	letter-spacing: -0.02em;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	max-width: 90%;
	word-wrap: break-word;
}

.project-card--compact .project-icon {
	font-size: 2.5rem;
}

.project-card--compact .project-title-fallback {
	font-size: 1.5rem;
}

.project-info {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	padding: 2rem;
	opacity: 0;
	transform: translateY(30px);
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	pointer-events: none;
}

.project-card:hover .project-info {
	opacity: 1;
	transform: translateY(0);
	pointer-events: auto;
}

.project-card--compact .project-info {
	padding: 1rem;
}

.project-title {
	font-size: 4rem;
	font-weight: 500;
	margin: 0 0 0.75rem 0;
	color: white;
	text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
	line-height: 1.3;
	width: fit-content;
}

.project-card--compact .project-title {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
}

.project-description {
	color: rgba(255, 255, 255, 0.9);
	font-size: 0.875rem;
	line-height: 1.5;
	margin-bottom: 1rem;
	text-shadow: 0 1px 8px rgba(0, 0, 0, 0.7);
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.project-card--compact .project-description {
	font-size: 0.8rem;
	margin-bottom: 0.75rem;
	-webkit-line-clamp: 2;
}

.project-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.project-tag {
	background: rgba(255, 255, 255, 0.2);
	color: white;
	padding: 0.375rem 0.75rem;
	border-radius: 6px;
	font-weight: 500;
	font-size: 0.75rem;
	transition: all 0.3s ease;
	border: 1px solid rgba(255, 255, 255, 0.3);
}

.project-card--compact .project-tag {
	font-size: 0.7rem;
	padding: 0.25rem 0.5rem;
}

.project-tag--more {
	background: rgba(255, 255, 255, 0.15);
	border-color: rgba(255, 255, 255, 0.2);
}

.project-meta-overlay {
	position: absolute;
	top: 1rem;
	right: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	z-index: 15;
	align-items: flex-end;
}

.meta-badge {
	display: flex;
	align-items: center;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(8px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 99px;
	padding: 4px;
	color: white;
	transition:
		background 0.3s ease,
		border-color 0.3s ease;
	overflow: hidden;
	max-width: 32px;
}

.meta-badge:hover {
	background: rgba(0, 0, 0, 0.7);
	border-color: rgba(255, 255, 255, 0.3);
	max-width: 200px;
}

.meta-badge__icon {
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.meta-badge__text-wrapper {
	display: grid;
	grid-template-columns: 0fr;
	transition: grid-template-columns 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.meta-badge:hover .meta-badge__text-wrapper {
	grid-template-columns: 1fr;
}

.meta-badge__text {
	overflow: hidden;
	white-space: nowrap;
	font-size: 0.75rem;
	font-weight: 500;
	opacity: 0;
	transform: translateX(10px);
	transition:
		opacity 0.3s ease,
		transform 0.3s ease,
		margin 0.3s ease;
	min-height: 0;
}

.meta-badge:hover .meta-badge__text {
	opacity: 1;
	transform: translateX(0);
	margin-left: 6px;
	margin-right: 8px;
}

@media (max-width: 768px) {
	.project-card {
		aspect-ratio: 3/2;
	}
	.project-content {
		padding: 1.5rem;
	}
	.project-info {
		padding: 1.5rem;
	}
	.project-icon {
		font-size: 3rem;
	}
	.project-title {
		font-size: 1.5rem;
	}
}

@media (max-width: 480px) {
	.project-content {
		padding: 1rem;
	}
	.project-info {
		padding: 1rem;
	}
	.project-icon {
		font-size: 2.5rem;
	}
	.project-title-fallback {
		font-size: 1.25rem;
	}
	.project-title {
		font-size: 1.25rem;
	}
}

@media (prefers-reduced-motion: reduce) {
	.project-card,
	.project-logo,
	.project-info {
		transition: none;
	}
	.project-card:hover .project-logo,
	.project-card:hover .project-info {
		transform: none;
		opacity: 1;
	}
}
</style>
