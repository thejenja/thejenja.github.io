<template>
	<div
		class="projects-wrapper"
		:class="[`mode-${viewMode}`, { 'is-compact': compact }]"
		role="region"
		aria-labelledby="projects-title"
	>
		<div v-if="viewMode === 'timeline'" class="timeline-container">
			<div class="timeline-header">
				<div class="timeline-years">
					<div
						class="timeline-year"
						:class="{ active: activeYear === 'all' }"
						@click="setYear('all')"
					>
						{{ $t("timeline.all") }}
					</div>
					<div
						v-for="year in timelineYears"
						:key="year"
						class="timeline-year"
						:class="{ active: activeYear === year }"
						@click="setYear(year)"
					>
						{{ year }}
					</div>
				</div>
			</div>

			<Transition :name="yearTransitionName" mode="out-in">
				<div :key="activeYear" class="timeline-content-wrapper">
					<div class="timeline-content">
						<div
							v-for="(monthGroup, monthKey) in groupedProjects"
							:key="monthKey"
							class="month-group"
						>
							<div class="month-header">
								<h3 class="month-title">
									{{ formatMonth(String(monthKey)) }}
								</h3>
							</div>
							<TransitionGroup
								name="project-list"
								tag="div"
								class="projects-grid"
							>
								<ProjectCard
									v-for="project in monthGroup"
									:key="project._path"
									:project="project"
									:compact="true"
								/>
							</TransitionGroup>
						</div>
					</div>
				</div>
			</Transition>
		</div>

		<div v-else-if="viewMode === 'marquee'" class="marquee-container">
			<div class="fade-mask left" />
			<div class="fade-mask right" />

			<div class="marquee-track">
				<div class="marquee-group">
					<ProjectCard
						v-for="project in targetProjects"
						:key="project._path"
						:project="project"
						:compact="true"
						class="marquee-card"
					/>
				</div>

				<div aria-hidden="true" class="marquee-group">
					<ProjectCard
						v-for="project in targetProjects"
						:key="`${project._path}-duplicate`"
						:project="project"
						:compact="true"
						class="marquee-card"
					/>
				</div>
			</div>
		</div>

		<div
			v-else-if="viewMode === 'scroll'"
			class="scroll-wrapper"
			:style="scrollMaskStyle"
		>
			<div
				class="scroll-container"
				ref="scrollContainer"
				@scroll="handleScroll"
			>
				<div class="scroll-track">
					<ProjectCard
						v-for="project in targetProjects"
						:key="project._path"
						:project="project"
						:compact="true"
						:showDescription="false"
						class="scroll-card"
					/>

					<NuxtLinkLocale to="/projects" class="see-more-card">
						<div class="see-more-content">
							<span class="arrow">→</span>
							<span>Все проекты</span>
						</div>
					</NuxtLinkLocale>
				</div>
			</div>
		</div>

		<div v-else class="compact-grid-container">
			<TransitionGroup name="project-list" tag="div" class="projects-grid">
				<ProjectCard
					v-for="project in targetProjects"
					:key="project._path"
					:project="project"
					:compact="true"
				/>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import ProjectCard from "./ProjectCard.vue";

// Типы
interface ProjectMeta {
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
	demo?: string;
	github?: string;
}

interface Project {
	title?: string;
	description?: string;
	date?: string;
	body?: unknown;
	meta?: ProjectMeta;
	_path?: string;
}

interface Props {
	projects: Project[];
	compact?: boolean;
	limit?: number;
	viewMode?: "timeline" | "grid" | "marquee" | "scroll";
}

const props = withDefaults(defineProps<Props>(), {
	compact: false,
	limit: undefined,
	viewMode: "timeline",
});

const { locale } = useI18n();
const activeYear = ref<number | "all">("all");
const yearTransitionName = ref("slide-next"); // Направление анимации по умолчанию

// --- Logic for Animations ---

// Сеттер для года с определением направления анимации
const setYear = (year: number | "all") => {
	// Определяем направление
	const yearsList = ["all", ...timelineYears.value];
	const oldIndex = yearsList.indexOf(activeYear.value);
	const newIndex = yearsList.indexOf(year);

	// Если новый индекс больше (правее), контент должен приехать справа (next)
	// Если меньше (левее), контент должен приехать слева (prev)
	yearTransitionName.value = newIndex > oldIndex ? "slide-next" : "slide-prev";

	activeYear.value = year;
};

// --- Logic for Scroll Mask ---
const scrollContainer = ref<HTMLElement | null>(null);
const maskLeft = ref(0);
const maskRight = ref(1);

// Вычисляемые стили для маски
const scrollMaskStyle = computed(() => ({
	"--mask-left": maskLeft.value,
	"--mask-right": maskRight.value,
}));

const handleScroll = () => {
	const el = scrollContainer.value;
	if (!el) return;

	const maxScroll = el.scrollWidth - el.clientWidth;
	const currentScroll = el.scrollLeft;

	// Плавное изменение прозрачности маски (0 или 1)
	// Порог срабатывания 10px
	maskLeft.value = currentScroll > 10 ? 1 : 0;
	maskRight.value = currentScroll < maxScroll - 10 ? 1 : 0;
};

// Инициализация скролла
onMounted(() => {
	if (props.viewMode === "scroll") {
		nextTick(handleScroll);
	}
});

// --- Existing Logic ---

const targetProjects = computed(() => {
	let list = props.projects;
	if (props.compact && props.limit && props.viewMode === "grid") {
		list = list.slice(0, props.limit);
	}
	if (props.viewMode === "marquee" && list.length < 5) {
		return [...list, ...list];
	}
	return list;
});

const timelineYears = computed(() => {
	const years = new Set<number>();
	props.projects.forEach((project) => {
		const date = new Date(project.date || project.meta?.date || "");
		if (!isNaN(date.getTime())) years.add(date.getFullYear());
	});
	return Array.from(years).sort((a, b) => b - a);
});

const groupedProjects = computed(() => {
	const groups: Record<string, Project[]> = {};
	props.projects.forEach((project) => {
		const date = new Date(project.date || project.meta?.date || "");
		if (isNaN(date.getTime())) return;
		if (activeYear.value !== "all" && date.getFullYear() !== activeYear.value)
			return;
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		if (!groups[monthKey]) groups[monthKey] = [];
		groups[monthKey].push(project);
	});
	return Object.fromEntries(
		Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)),
	);
});

const formatMonth = (monthKey: string) => {
	const [year, month] = monthKey.split("-");
	if (!year || !month) return monthKey;
	const date = new Date(parseInt(year), parseInt(month) - 1);
	return date.toLocaleDateString(locale.value === "ru" ? "ru-RU" : "en-US", {
		month: "long",
		year: "numeric",
	});
};
</script>

<style scoped>
/* =========================================
   ANIMATIONS
   ========================================= */

.project-list-move,
.project-list-enter-active,
.project-list-leave-active {
	transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.project-list-enter-from,
.project-list-leave-to {
	opacity: 0;
	transform: scale(0.9) translateY(20px);
}

/* Абсолютное позиционирование для уходящих элементов, 
   чтобы остальные плавно схлопнулись (magic grid effect) */
.project-list-leave-active {
	position: absolute;
	width: 100%;
	z-index: -1;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
	transition:
		opacity 0.4s ease,
		transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-next-enter-from {
	opacity: 0;
	transform: translateX(30px);
}
.slide-next-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}

.slide-prev-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}
.slide-prev-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

/* =========================================
   BASE STYLES
   ========================================= */

.timeline-projects {
	position: relative;
}

.timeline-container {
	max-width: 1200px;
	margin: 0 auto;
}

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

.month-group {
	margin-bottom: 3rem;

	position: relative;
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
	transition: background-color 0.3s ease;
}

.month-header::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: -10px;
	height: 10px;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent);
	opacity: 0;
	transition: opacity 0.3s;
	pointer-events: none;
}

.month-title {
	font-size: 1.75rem;
	font-weight: 500;
	color: var(--text-secondary);
	margin: 0;
	text-transform: capitalize;
}

.projects-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 1.5rem;
	position: relative;
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

/* =========================================
   SCROLL MODE STYLES
   ========================================= */

.scroll-wrapper {
	width: 100%;
	position: relative;

	--mask-width: 60px;
	mask-image: linear-gradient(
		to right,
		transparent 0%,
		black calc(var(--mask-width) * var(--mask-left)),
		black calc(100% - (var(--mask-width) * var(--mask-right))),
		transparent 100%
	);
	-webkit-mask-image: linear-gradient(
		to right,
		transparent 0%,
		black calc(var(--mask-width) * var(--mask-left)),
		black calc(100% - (var(--mask-width) * var(--mask-right))),
		transparent 100%
	);

	transition:
		mask-image 0.3s ease,
		-webkit-mask-image 0.3s ease;
}

.scroll-container {
	width: 100%;
	overflow-x: auto;
	scrollbar-width: none;
	-webkit-overflow-scrolling: touch;

	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
}

.scroll-container::-webkit-scrollbar {
	display: none;
}

.scroll-track {
	display: flex;
	gap: 1.5rem;
	width: max-content;
}

.scroll-card {
	width: 300px;
	flex-shrink: 0;

	scroll-snap-align: start;
	scroll-margin-left: 1rem;
}

.see-more-card {
	width: 150px;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-secondary);
	border-radius: 16px;
	text-decoration: none;
	color: var(--text);
	border: 1px dashed var(--border);
	transition: 0.3s;
	scroll-snap-align: start;
	scroll-margin-left: 1rem;
}

.marquee-container {
	position: relative;
	width: 100%;
	overflow: hidden;
	padding: 1rem 0;
	mask-image: linear-gradient(
		to right,
		transparent,
		black 10%,
		black 90%,
		transparent
	);
	-webkit-mask-image: linear-gradient(
		to right,
		transparent,
		black 10%,
		black 90%,
		transparent
	);
}

.marquee-track {
	display: flex;
	gap: 1.5rem;
	width: max-content;
	animation: marquee-scroll 40s linear infinite;
}

.marquee-track:hover {
	animation-play-state: paused;
}

.marquee-group {
	display: flex;
	gap: 1.5rem;
	padding-right: 1.5rem;
}

.marquee-card {
	width: 320px;
	flex-shrink: 0;
}

@keyframes marquee-scroll {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-100%);
	}
}

@media (max-width: 768px) {
	.marquee-card,
	.scroll-card {
		width: 260px;
	}
}
</style>
