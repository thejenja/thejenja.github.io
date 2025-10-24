<template>
	<div
		:class="['projects-container', { 'projects-container--compact': compact }]"
	>
		<!-- Заголовок (опционально) -->
		<header v-if="title || $slots.header" class="projects-header">
			<slot name="header">
				<h2 v-if="title" class="projects-title">{{ title }}</h2>
				<p v-if="description" class="projects-description">{{ description }}</p>
			</slot>
		</header>

		<!-- Сетка проектов -->
		<div
			v-if="displayedProjects.length > 0"
			:class="['projects-grid', gridClass]"
		>
			<ProjectCard
				v-for="project in displayedProjects"
				:key="project._path || project.meta?.slug || 'unknown'"
				:project="project"
				:compact="compact"
				:show-logo="showLogo"
				:show-text="showText"
				:show-info="showInfo"
				:show-description="showDescription"
				:show-tags="showTags"
				:max-tags="maxTags"
			/>
		</div>

		<!-- Сообщение об отсутствии проектов -->
		<div v-else class="projects-empty">
			<p>{{ $t("projects.notFound") }}</p>
		</div>

		<!-- Кнопка "Показать больше" -->
		<div v-if="showMoreButton && hasMoreProjects" class="projects-actions">
			<slot name="actions">
				<NuxtLink to="/projects" class="show-more-btn">
					{{ $t("projects.showMore") }}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
			</NuxtLink>
			</slot>
		</div>

	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProjectCard from "./ProjectCard.vue";
// Убираем ProjectPopover, так как теперь используем отдельные страницы

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
	projects: ProjectContent[];
	title?: string;
	description?: string;
	compact?: boolean;
	limit?: number;
	showLogo?: boolean;
	showText?: boolean;
	showInfo?: boolean;
	showDescription?: boolean;
	showTags?: boolean;
	maxTags?: number;
	showMoreButton?: boolean;
	gridColumns?: number;
}

const props = withDefaults(defineProps<Props>(), {
	compact: false,
	limit: 0, // 0 = показать все
	showLogo: true,
	showText: false,
	showInfo: true,
	showDescription: true,
	showTags: true,
	maxTags: 3,
	showMoreButton: false,
	gridColumns: 0, // 0 = автоматически
});

// Отображаемые проекты с учетом лимита
const displayedProjects = computed(() => {
	if (!props.projects || !Array.isArray(props.projects)) {
		return [];
	}

	if (props.limit > 0) {
		return props.projects.slice(0, props.limit);
	}
	return props.projects;
});

// Есть ли еще проекты для показа
const hasMoreProjects = computed(() => {
	return props.limit > 0 && props.projects.length > props.limit;
});

// CSS класс для сетки
const gridClass = computed(() => {
	const classes = [];

	if (props.compact) {
		classes.push("projects-grid--compact");
	}

	if (props.gridColumns > 0) {
		classes.push(`projects-grid--cols-${props.gridColumns}`);
	}

	return classes.join(" ");
});
</script>

<style scoped>
.projects-container {
	width: 100%;
}

/* Заголовок */
.projects-header {
	text-align: center;
	margin-bottom: 2rem;
}

.projects-title {
	font-size: 2rem;
	font-weight: 700;
	margin: 0 0 0.5rem 0;
	color: var(--text);
}

.projects-container--compact .projects-title {
	font-size: 1.5rem;
}

.projects-description {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.6;
}

/* Сетка */
.projects-grid {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.projects-grid--compact {
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

/* Фиксированные колонки */
.projects-grid--cols-1 {
	grid-template-columns: 1fr;
}

.projects-grid--cols-2 {
	grid-template-columns: repeat(2, 1fr);
}

.projects-grid--cols-3 {
	grid-template-columns: repeat(3, 1fr);
}

.projects-grid--cols-4 {
	grid-template-columns: repeat(4, 1fr);
}

/* Пустое состояние */
.projects-empty {
	text-align: center;
	padding: 3rem 1rem;
	color: var(--text-secondary);
}

.projects-empty p {
	font-size: 1.125rem;
	margin: 0;
}

/* Кнопка "Показать больше" */
.projects-actions {
	display: flex;
	justify-content: center;
	margin-top: 2rem;
}

.show-more-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: var(--accent);
	color: white;
	text-decoration: none;
	border-radius: 8px;
	font-weight: 600;
	transition: all 0.3s ease;
}

.show-more-btn:hover {
	background: var(--accent-hover);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.show-more-btn svg {
	transition: transform 0.3s ease;
}

.show-more-btn:hover svg {
	transform: translateX(2px);
}

/* Адаптивность */
@media (max-width: 1024px) {
	.projects-grid {
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.projects-grid--compact {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	.projects-grid--cols-3 {
		grid-template-columns: repeat(2, 1fr);
	}

	.projects-grid--cols-4 {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 768px) {
	.projects-grid {
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.projects-grid--compact {
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 0.75rem;
	}

	.projects-grid--cols-2,
	.projects-grid--cols-3,
	.projects-grid--cols-4 {
		grid-template-columns: 1fr;
	}

	.projects-header {
		margin-bottom: 1.5rem;
	}

	.projects-title {
		font-size: 1.75rem;
	}

	.projects-container--compact .projects-title {
		font-size: 1.25rem;
	}
}

@media (max-width: 480px) {
	.projects-grid {
		grid-template-columns: 1fr;
	}

	.projects-grid--compact {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>
