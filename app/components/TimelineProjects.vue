<template>
	<div class="timeline-projects" :class="{ compact }">
		<div class="timeline-container">
			<!-- Timeline с годами и месяцами (только в обычном режиме) -->
			<div v-if="!compact" class="timeline-header">
				<div class="timeline-years">
					<!-- Вкладка "Все" -->
					<div
						class="timeline-year"
						:class="{ active: activeYear === 'all' }"
						@click="setActiveYear('all')"
					>
						{{ $t("timeline.all") }}
					</div>
					<!-- Годы -->
					<div
						v-for="year in timelineYears"
						:key="year"
						class="timeline-year"
						:class="{ active: activeYear === year }"
						@click="setActiveYear(year)"
					>
						{{ year }}
					</div>
				</div>
			</div>

			<!-- Проекты в обычном режиме (с timeline) -->
			<div v-if="!compact" class="timeline-content">
				<div
					v-for="(monthGroup, monthKey) in groupedProjects"
					:key="monthKey"
					class="month-group"
				>
					<!-- Заголовок месяца -->
					<div class="month-header">
						<h3 class="month-title">{{ formatMonth(String(monthKey)) }}</h3>
					</div>

					<!-- Проекты месяца -->
					<div class="month-projects">
						<ProjectCard
							v-for="project in monthGroup"
							:key="project._path"
							:project="project"
							:compact="true"
							:show-logo="true"
							:show-description="false"
							:show-tags="true"
							:max-tags="5"
							:standalone="true"
							@project-click="openProject"
						/>
					</div>
				</div>
			</div>

			<!-- Компактный режим - только проекты без timeline -->
			<div v-else class="compact-projects">
				<div class="projects-grid">
					<ProjectCard
						v-for="project in limitedProjects"
						:key="project._path"
						:project="project"
						:compact="true"
						:show-logo="true"
						:show-description="false"
						:show-tags="true"
						:max-tags="3"
						:standalone="true"
						@project-click="openProject"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ProjectCard from "./ProjectCard.vue";

interface Project {
	title?: string;
	description?: string;
	date?: string;
	body?: unknown;
	meta?: {
		slug?: string;
		color?: string;
		background?: string;
		technologies?: string[];
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
		icon?: string;
		date?: string;
		behance?: string;
		dribbble?: string;
	};
	_path?: string;
}

interface Props {
	projects: Project[];
	compact?: boolean;
	limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
	compact: false,
	limit: undefined,
});

const emit = defineEmits<{
	"project-click": [project: Project];
}>();

// Активный год для timeline
const activeYear = ref<number | "all">("all");

// Получаем проекты с лимитом для компактного режима
const limitedProjects = computed(() => {
	if (props.compact && props.limit) {
		return props.projects.slice(0, props.limit);
	}
	return props.projects;
});

// Получаем уникальные годы из проектов
const timelineYears = computed(() => {
	const years = new Set<number>();
	props.projects.forEach((project) => {
		const date = new Date(project.date || project.meta?.date || "");
		if (!isNaN(date.getTime())) {
			years.add(date.getFullYear());
		}
	});
	return Array.from(years).sort((a, b) => b - a);
});

// Группируем проекты по месяцам с учетом активного года
const groupedProjects = computed(() => {
	const groups: Record<string, Project[]> = {};
	let processedCount = 0;

	props.projects.forEach((project) => {
		// Проверяем лимит для компактного режима
		if (props.compact && props.limit && processedCount >= props.limit) {
			return;
		}

		const date = new Date(project.date || project.meta?.date || "");
		if (isNaN(date.getTime())) return;

		// Фильтруем по активному году
		if (activeYear.value !== "all" && date.getFullYear() !== activeYear.value) {
			return;
		}

		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

		if (!groups[monthKey]) {
			groups[monthKey] = [];
		}
		groups[monthKey].push(project);
		processedCount++;
	});

	// Сортируем месяцы по убыванию
	return Object.fromEntries(
		Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
	);
});

// Устанавливаем активный год
const setActiveYear = (year: number | "all") => {
	activeYear.value = year;
	const header = document.querySelector(".timeline-header") as HTMLElement;
	window.scrollTo({
		top: header?.offsetTop || 0,
		behavior: "smooth",
	});
};

// Форматируем месяц для отображения
const { locale } = useI18n();

const formatMonth = (monthKey: string) => {
	const [year, month] = monthKey.split("-");
	if (!year || !month) return monthKey;

	const date = new Date(parseInt(year), parseInt(month) - 1);

	// Используем текущую локаль для форматирования даты
	const localeCode = locale.value === "ru" ? "ru-RU" : "en-US";

	return date.toLocaleDateString(localeCode, {
		month: "long",
		year: "numeric",
	});
};

// Открываем проект
const openProject = (project: Project) => {
	// Проверяем есть ли реальный контент
	const hasRealContent =
		project.body &&
		typeof project.body === "object" &&
		(project.body as any).value &&
		Array.isArray((project.body as any).value) &&
		(project.body as any).value.length > 0;

	// Если есть реальный контент - показываем popover
	if (hasRealContent) {
		emit("project-click", project);
		return;
	}

	// Для дизайн-проектов БЕЗ текста с одной ссылкой - сразу открываем
	if (project.meta?.type === "design") {
		if (project.meta?.behance && !project.meta?.dribbble) {
			window.open(project.meta.behance, "_blank");
			return;
		}
		if (project.meta?.dribbble && !project.meta?.behance) {
			window.open(project.meta.dribbble, "_blank");
			return;
		}
	}

	// Для остальных случаев - показываем popover
	emit("project-click", project);
};
</script>

<style scoped>
.timeline-projects {
	position: relative;
}

.timeline-container {
	max-width: 1200px;
	margin: 0 auto;
}

/* Timeline header с годами */
.timeline-header {
	background: var(--bg);
	border-bottom: 1px solid var(--border);
	margin-bottom: 2rem;
}

.timeline-years {
	display: flex;
	gap: 2rem;
	padding: 1rem 0;
	overflow-x: auto;
	scrollbar-width: thin;
	scrollbar-color: var(--border) transparent;
}

.timeline-years::-webkit-scrollbar {
	height: 4px;
}

.timeline-years::-webkit-scrollbar-track {
	background: transparent;
}

.timeline-years::-webkit-scrollbar-thumb {
	background: var(--border);
	border-radius: 2px;
}

.timeline-year {
	font-size: 1.5rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
	white-space: nowrap;
	padding: 0.5rem 1rem;
	border-radius: 8px;
}

.timeline-year:hover {
	color: var(--text);
	background: var(--bg-secondary);
}

.timeline-year.active {
	color: var(--accent);
	background: var(--bg-tertiary);
}

/* Группы месяцев */
.month-group {
	margin-bottom: 3rem;
}

.month-header {
	position: sticky;
	top: 0;
	z-index: 10;
	background: var(--bg);
	border-bottom: 1px solid var(--border);
	padding-bottom: 1rem;
	padding-top: 1rem;

	margin-bottom: 1.5rem;
}

.month-title {
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--text-secondary);
	margin: 0;
	text-transform: capitalize;
}

/* Сетка проектов */
.month-projects {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 1.5rem;
}

/* Компактный режим */
.timeline-projects.compact .month-projects {
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

.timeline-projects.compact .timeline-project-card {
	aspect-ratio: 1/1;
}

.timeline-projects.compact .project-icon {
	width: 48px;
	height: 48px;
}

.timeline-projects.compact .project-icon-emoji {
	font-size: 1.5rem;
}

.timeline-projects.compact .month-title {
	font-size: 1rem;
	margin-bottom: 1rem;
}

.timeline-projects.compact .month-group {
	margin-bottom: 2rem;
}

/* Компактный режим - только проекты */
.compact-projects {
	padding: 1rem 0;
}

.projects-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.5rem;
}

@media (max-width: 768px) {
	.projects-grid {
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1rem;
	}
	.timeline-year {
		flex-grow: 1;
		text-align: center;
	}
}

@media (max-width: 480px) {
	.projects-grid {
		grid-template-columns: 1fr;
	}
}

/* Карточка проекта */
.timeline-project-card {
	position: relative;
	background: var(--bg-secondary);
	border-radius: 16px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.3s ease;
	aspect-ratio: 4/3;
}

.timeline-project-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Избранная звезда */
.featured-star {
	position: absolute;
	top: -8px;
	left: -8px;
	z-index: 20;
	transform: rotate(-25deg);
	color: var(--star-color, #fbbf24);
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Фон проекта */
.project-background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background-size: cover;
	background-position: center;
}

/* Иконка проекта */
.project-icon {
	width: 64px;
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 16px;
	backdrop-filter: blur(10px);
}

.project-icon-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.project-icon-emoji {
	font-size: 2rem;
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
	backdrop-filter: blur(10px);
}

.meta-badge:hover {
	background: rgba(0, 0, 0, 0.9);
	transform: scale(1.1);
}

/* Технологии */
.project-technologies {
	position: absolute;
	bottom: 1rem;
	left: 1rem;
	right: 1rem;
	display: flex;
	gap: 0.5rem;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.timeline-project-card:hover .project-technologies {
	opacity: 1;
}

.tech-tag-compact {
	transform: scale(0.8);
	transform-origin: bottom left;
}

/* Название проекта */
.project-title {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
	padding: 2rem 1rem 1rem;
	color: white;
}

.project-title h4 {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	line-height: 1.3;
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
	backdrop-filter: blur(10px);
	white-space: nowrap;
}

/* Адаптивность */
@media (max-width: 768px) {
	.month-projects {
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1rem;
	}

	.timeline-year {
		font-size: 1.25rem;
		padding: 0.375rem 0.75rem;
	}

	.month-title {
		font-size: 1.125rem;
	}
}

@media (max-width: 480px) {
	.month-projects {
		grid-template-columns: 1fr;
	}

	.timeline-years {
		gap: 1rem;
	}
}
</style>
