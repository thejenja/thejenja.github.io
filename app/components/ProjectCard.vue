<template>
	<div class="project-card-wrapper">
		<button
			:class="['project-card', { 'project-card--compact': compact }]"
			type="button"
			:popovertarget="
				shouldShowPopover
					? `project-${project.meta?.slug || (project._path ? project._path.split('/').pop() : '')}`
					: undefined
			"
			@click="handleProjectClick"
			:style="{
				'--accent': project.meta?.color || '#4b5563',
			}"
		>
			<!-- Фон на всю ширину -->
			<div class="project-background" :style="backgroundStyle">
				<!-- Фоновое изображение (если есть) -->
				<div v-if="hasBackground" class="background-image-container">
					<img
						:src="backgroundImageUrl"
						:alt="`${project.title} background`"
						class="background-image"
						width="400"
						height="300"
					/>
					<div class="background-overlay"></div>
				</div>

				<!-- Градиентный фон (если нет изображения) -->
				<div v-else class="gradient-background"></div>

				<!-- Контент проекта -->
				<div class="project-content">
					<!-- Логотип или иконка -->
					<div class="project-logo">
						<img
							v-if="showLogo && hasLogo"
							:src="projectAssets.logo || undefined"
							:alt="`${project.title} logo`"
							class="project-logo-image"
							width="200"
							height="120"
						/>
						<div v-else class="project-icon">
							{{ project.meta?.icon || "📁" }}
						</div>
					</div>

					<!-- Значки состояния и типа проекта (только при !compact) -->
					<div class="project-meta-overlay">
						<!-- Тип проекта -->
						<div
							v-if="project.meta?.type"
							class="meta-badge meta-type"
							@mouseenter="showMetaTooltip('type', project.meta.type!)"
							@mouseleave="hideMetaTooltip"
						>
							<DynamicIcon :icon="getTypeIcon(project.meta.type!)" size="14" />
						</div>

						<!-- Статус проекта -->
						<div
							v-if="project.meta?.stage"
							class="meta-badge meta-stage"
							@mouseenter="showMetaTooltip('stage', project.meta.stage!)"
							@mouseleave="hideMetaTooltip"
						>
							<DynamicIcon
								:icon="getStageIcon(project.meta.stage!)"
								size="14"
							/>
						</div>
					</div>

					<!-- Информация о проекте -->
					<div class="project-info">
						<h3 class="project-title">{{ project.title }}</h3>
						<p v-if="showDescription" class="project-description">
							{{ project.description }}
						</p>

						<!-- Теги проекта -->
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
		</button>

		<!-- ProjectPopover для каждого проекта (только когда нужен) -->
		<!-- DEBUG: shouldShowPopover = {{ shouldShowPopover }} -->
		<ProjectPopover
			v-if="shouldShowPopover"
			:project="project"
			:popover-id="`project-${project.meta?.slug || (project._path ? project._path.split('/').pop() : '')}`"
		/>

		<!-- Tooltip для мета-информации -->
		<div v-if="tooltip.show" class="meta-tooltip" :style="tooltip.style">
			{{ tooltip.text }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import TechTag from "./TechTag.vue";
import ProjectPopover from "./ProjectPopover.vue";
import DynamicIcon from "./DynamicIcon.vue";

interface ProjectMeta {
	slug?: string;
	color?: string;
	background?: string;
	backgroundImage?: string;
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

// Тип ассетов проекта
interface ProjectAssets {
	logo?: string;
	background?: string;
	preview?: string;
	gallery: string[];
}

// Получаем ресурсы проекта
const getProjectAssets = (slug: string): ProjectAssets => {
	if (!slug) {
		return {
			logo: undefined,
			background: undefined,
			preview: undefined,
			gallery: [],
		};
	}

	return {
		logo: `/projects/${slug}/logo.svg`,
		background: `/projects/${slug}/background.webp`,
		preview: `/projects/${slug}/preview.webp`,
		gallery: [],
	};
};

const projectAssets = computed<ProjectAssets>(() => {
	const slug = props.project?.meta?.slug;
	return slug
		? getProjectAssets(slug)
		: {
				logo: undefined,
				background: undefined,
				preview: undefined,
				gallery: [],
			};
});

// Определяем, есть ли логотип
const hasLogo = computed<boolean>(() => {
	return Boolean(projectAssets.value.logo);
});

// URL фонового изображения из метаданных или ассетов
const backgroundImageUrl = computed(() => {
	// Используем только явно указанный backgroundImage в метаданных
	return props.project?.meta?.backgroundImage || undefined;
});

// Определяем, есть ли фон (изображение)
const hasBackground = computed(() => {
	return Boolean(backgroundImageUrl.value);
});

// CSS для фона: поддержка произвольного background (градиенты/мульти-слои)
const backgroundStyle = computed(() => {
	const meta = props.project?.meta || {};
	const backgroundCss =
		typeof meta.background === "string" ? meta.background : undefined;
	if (backgroundCss) {
		return { background: backgroundCss };
	}
	return { background: (meta.color as string) || "#4b5563" };
});

// Tooltip для мета-информации
const tooltip = ref({
	show: false,
	text: "",
	style: {},
});

// Получаем иконку типа проекта
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

// Получаем иконку статуса проекта
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

// Определяем нужно ли показывать popover
const shouldShowPopover = computed(() => {
	console.log("=== DEBUG shouldShowPopover ===");
	console.log("Title:", props.project.title);
	console.log("Body:", props.project.body);
	console.log("Body type:", typeof props.project.body);
	console.log(
		"Body keys:",
		props.project.body ? Object.keys(props.project.body) : "no body"
	);

	// Проверяем есть ли реальный контент (не только метаданные)
	const hasRealContent =
		props.project.body &&
		typeof props.project.body === "object" &&
		(props.project.body as any).value &&
		Array.isArray((props.project.body as any).value) &&
		(props.project.body as any).value.length > 0;

	console.log("Has real content:", hasRealContent);
	console.log(
		"Children:",
		props.project.body ? (props.project.body as any).children : "no children"
	);
	console.log(
		"Children length:",
		props.project.body
			? (props.project.body as any).children?.length
			: "no length"
	);

	// Если есть реальный контент - всегда показываем popover
	if (hasRealContent) {
		console.log("Есть контент - возвращаем true");
		return true;
	}

	// Для дизайн-проектов с двумя ссылками - показываем popover для выбора
	if (
		props.project.meta?.type === "design" &&
		props.project.meta?.behance &&
		props.project.meta?.dribbble
	) {
		console.log("Дизайн с двумя ссылками - возвращаем true");
		return true;
	}

	// Для дизайн-проектов с одной ссылкой - не показываем popover
	if (
		props.project.meta?.type === "design" &&
		(props.project.meta?.behance || props.project.meta?.dribbble)
	) {
		console.log("Дизайн с одной ссылкой - возвращаем false");
		return false;
	}

	// Для остальных проектов - показываем popover
	console.log("Обычный проект - возвращаем true");
	return true;
});

// Обработчик клика по проекту
const handleProjectClick = () => {
	// Проверяем есть ли реальный контент
	const hasRealContent =
		props.project.body &&
		typeof props.project.body === "object" &&
		(props.project.body as any).value &&
		Array.isArray((props.project.body as any).value) &&
		(props.project.body as any).value.length > 0;

	// Если есть реальный контент - всегда показываем popover
	if (hasRealContent) {
		// Если standalone - эмитим событие для TimelineProjects
		if (props.standalone) {
			emit("project-click", props.project);
		}
		// Popover откроется автоматически благодаря popovertarget
		return;
	}

	// Для дизайн-проектов БЕЗ текста с одной ссылкой - сразу открываем
	if (props.project.meta?.type === "design") {
		if (props.project.meta?.behance && !props.project.meta?.dribbble) {
			// Если standalone - эмитим событие для TimelineProjects
			if (props.standalone) {
				emit("project-click", props.project);
			} else {
				window.open(props.project.meta.behance, "_blank");
			}
			return;
		}
		if (props.project.meta?.dribbble && !props.project.meta?.behance) {
			// Если standalone - эмитим событие для TimelineProjects
			if (props.standalone) {
				emit("project-click", props.project);
			} else {
				window.open(props.project.meta.dribbble, "_blank");
			}
			return;
		}
	}

	// Для остальных случаев - показываем popover (если он настроен)
	// Если standalone - эмитим событие для TimelineProjects
	if (props.standalone) {
		emit("project-click", props.project);
	}
	// Popover откроется автоматически благодаря popovertarget
};

// Показываем tooltip для мета-информации
const { t } = useI18n();

const showMetaTooltip = (type: "type" | "stage", value: string) => {
	let text = value;
	if (type === "type") {
		text = t(`projectTypes.${value}`, value);
	} else if (type === "stage") {
		text = t(`projectStages.${value}`, value);
	}

	tooltip.value = {
		show: true,
		text,
		style: {},
	};
};

// Скрываем tooltip
const hideMetaTooltip = () => {
	tooltip.value.show = false;
};

// Обработчик движения мыши для tooltip
const handleMouseMove = (event: MouseEvent) => {
	if (tooltip.value.show) {
		tooltip.value.style = {
			left: event.clientX + 10 + "px",
			top: event.clientY - 30 + "px",
		};
	}
};

// Lifecycle хуки для tooltip
onMounted(() => {
	document.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
	document.removeEventListener("mousemove", handleMouseMove);
});
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
}

.project-card:hover {
	transform: translateY(-4px);
	box-shadow:
		0 20px 40px rgba(0, 0, 0, 0.15),
		0 8px 16px rgba(0, 0, 0, 0.1);
	border-color: color-mix(in srgb, var(--accent) 60%, var(--text));
}

.project-card:active {
	transform: translateY(-2px);
}

.project-card--compact {
	aspect-ratio: 4/3;
}

/* Фон на всю ширину */
.project-background {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
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
}

.background-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1;
}

/* Контент проекта */
.project-content {
	position: relative;
	z-index: 2;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 2rem;
	color: white;
}

.project-card--compact .project-info {
	position: absolute;
	bottom: 1rem;
	opacity: 0;
	transition: all 0.3s ease;
}

.project-card--compact:hover .project-info {
	height: auto;
	opacity: 1;
}

.project-card--compact .project-content {
	padding: 1rem;
}

/* Логотип */
.project-logo {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: auto 0;
	transition: all 0.3s ease;
}

.project-logo-image {
	max-width: 200px;
	max-height: 120px;
	width: auto;
	height: auto;
	transition: transform 0.3s ease;
	margin: 0 auto;
}

.project-logo-image:hover {
	transform: scale(1.05);
}

.project-icon {
	font-size: 3rem;
	color: white;
}

.project-card--compact .project-icon {
	font-size: 2rem;
}

/* Информация о проекте */
.project-info {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.project-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin: 0 0 0.75rem 0;
	color: white;
	line-height: 1.3;
}

.project-card--compact .project-title {
	font-size: 1.25rem;
	margin-bottom: 0.5rem;
}

.project-description {
	color: rgba(255, 255, 255, 0.9);
	font-size: 0.875rem;
	line-height: 1.5;
	margin-bottom: 1rem;
	flex: 1;
	text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
}

.project-card--compact .project-description {
	font-size: 0.8rem;
	margin-bottom: 0.75rem;
}

/* Теги */
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

.project-tag:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Адаптивность */
@media (max-width: 768px) {
	.project-card {
		aspect-ratio: 4/3;
	}

	.project-content {
		padding: 1.5rem;
	}
	.project-icon {
		font-size: 2.5rem;
	}

	.project-title {
		font-size: 1.25rem;
	}
}

@media (max-width: 480px) {
	.project-content {
		padding: 1rem;
	}
	.project-icon {
		font-size: 2rem;
	}

	.project-title {
		font-size: 1.125rem;
	}
}

/* Мета-информация (правый верхний угол) */
.project-meta-overlay {
	position: absolute;
	top: 1rem;
	right: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	z-index: 15;
}

.meta-badge {
	width: 32px;
	height: 32px;
	background: rgba(0, 0, 0, 0.7);
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	transition: all 0.3s ease;
}

.meta-badge:hover {
	background: rgba(0, 0, 0, 0.9);
	transform: scale(1.1);
}

/* Tooltip */
.meta-tooltip {
	position: fixed;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.9);
	color: white;
	padding: 0.5rem 0.75rem;
	border-radius: 6px;
	font-size: 0.875rem;
	pointer-events: none;
	white-space: nowrap;
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.project-card,
	.project-logo-image {
		transition: none;
	}

	.project-card:hover {
		transform: none;
	}
}
</style>
