<template>
	<div
		class="projects-wrapper"
		:class="`mode-${viewMode}`"
		role="region"
		aria-labelledby="projects-title"
	>
		<div v-if="viewMode === 'timeline'" class="timeline-container">
			<div class="timeline-content">
				<div
					v-for="(monthGroup, monthKey) in groupedProjects"
					:id="`month-${String(monthKey)}`"
					:key="monthKey"
					class="month-group"
					:data-month="monthKey"
				>
					<div class="month-header-wrapper">
						<div class="month-header gsap-sticky-header">
							<h3 class="month-title">
								{{ formatMonth(String(monthKey)) }}
							</h3>
						</div>
					</div>
					<div class="projects-grid gsap-fade-in">
						<ProjectCard
							v-for="(project, index) in monthGroup"
							:key="project._path"
							:project="project"
							:data-project-index="index"
						/>
					</div>
				</div>

				<!-- Empty state -->
				<div
					v-if="Object.keys(groupedProjects).length === 0"
					class="empty-state"
				>
					<p>{{ $t("projects.notFound") }}</p>
				</div>
			</div>
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
						class="marquee-card"
					/>
				</div>

				<div aria-hidden="true" class="marquee-group">
					<ProjectCard
						v-for="project in targetProjects"
						:key="`${project._path}-duplicate`"
						:project="project"
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
				ref="scrollContainer"
				class="scroll-container"
				@scroll="handleScroll"
			>
				<div class="scroll-track">
					<ProjectCard
						v-for="project in targetProjects"
						:key="project._path"
						:project="project"
						:show-description="false"
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
			<div class="projects-grid">
				<ProjectCard
					v-for="project in targetProjects"
					:key="project._path"
					:project="project"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import type { ProjectContent, ProjectMeta } from "~/types";
import ProjectCard from "../ProjectCard.vue";

// Расширенный тип для TimelineProjects
interface ExtendedMeta extends ProjectMeta {
	behance?: string;
	dribbble?: string;
	dprofile?: string;
	demo?: string;
	github?: string;
}

interface TimelineProject extends Omit<ProjectContent, 'meta'> {
	_path?: string;
	meta?: ExtendedMeta;
}

interface Props {
	projects: TimelineProject[];
	limit?: number;
	viewMode?: "timeline" | "grid" | "marquee" | "scroll";
}

const props = withDefaults(defineProps<Props>(), {
	limit: undefined,
	viewMode: "timeline",
});

const { locale } = useI18n();

// --- Logic for Scroll Mask ---
const scrollContainer = ref<HTMLElement | null>(null);
const maskLeft = ref(0);
const maskRight = ref(1);

const scrollMaskStyle = computed(() => ({
	"--mask-left": maskLeft.value,
	"--mask-right": maskRight.value,
}));

const handleScroll = () => {
	const el = scrollContainer.value;
	if (!el) return;

	const maxScroll = el.scrollWidth - el.clientWidth;
	const currentScroll = el.scrollLeft;

	maskLeft.value = currentScroll > 10 ? 1 : 0;
	maskRight.value = currentScroll < maxScroll - 10 ? 1 : 0;
};

// --- Computed Data ---
const targetProjects = computed(() => {
	let list = props.projects;
	if (props.limit && props.viewMode === "grid") {
		list = list.slice(0, props.limit);
	}
	if (props.viewMode === "marquee" && list.length < 5) {
		return [...list, ...list];
	}
	return list;
});

const groupedProjects = computed(() => {
	const groups: Record<string, TimelineProject[]> = {};
	props.projects.forEach((project) => {
		const dateStr = String(project.date || project.meta?.date || "");
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return;
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

// --- Lifecycle ---
onMounted(() => {
	if (props.viewMode === "scroll") {
		nextTick(handleScroll);
	}
});
</script>

<style scoped>
/* =========================================
   BASE STYLES
   ========================================= */

.timeline-container {
	max-width: 1200px;
	margin: 0 auto;
}

.month-group {
	margin-bottom: 3rem;
	position: relative;
	opacity: 1;
}

.month-header-wrapper {
	position: sticky;
	top: 0;
	z-index: 50;
	margin-bottom: 1.5rem;
}

.month-header {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	background: var(--bg);
	backdrop-filter: blur(12px);
	border-bottom: 1px solid var(--border);
	padding: 1rem 0;
}

.month-title {
	font-size: 1.75rem;
	font-weight: 600;
	color: var(--text);
	margin: 0;
	text-transform: capitalize;
}

.projects-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 1.5rem;
	position: relative;
}

.empty-state {
	text-align: center;
	padding: 4rem 2rem;
	color: var(--text-secondary);
}

.empty-state p {
	font-size: 1.125rem;
	margin: 0;
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

/* =========================================
   MARQUEE MODE STYLES
   ========================================= */

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

/* =========================================
   RESPONSIVE STYLES
   ========================================= */

@media (max-width: 1200px) {
	.timeline-container {
		padding-right: 3rem;
	}
}

@media (max-width: 1024px) {
	.timeline-container {
		padding-right: 2rem;
	}

	.month-header-wrapper {
		top: 0;
	}
}

@media (max-width: 768px) {
	.timeline-container {
		padding-right: 0;
	}

	.month-header-wrapper {
		position: sticky;
		top: 0;
		margin-left: -1rem;
		margin-right: -1rem;
		padding: 0 1rem;
	}

	.month-header {
		padding: 0.75rem 1rem;
		backdrop-filter: blur(12px);
		background: color-mix(in srgb, var(--bg) 80%, transparent);
		border-radius: 0;
		margin: 0 -1rem;
		border-bottom: 1px solid var(--border);
		justify-content: center;
	}

	.month-title {
		font-size: 1.25rem;
	}

	.projects-grid {
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
	}

	.month-group {
		margin-bottom: 2rem;
	}

	.marquee-card,
	.scroll-card {
		width: 260px;
	}
}

@media (max-width: 480px) {
	.projects-grid {
		grid-template-columns: 1fr;
	}

	.month-title {
		font-size: 1.125rem;
	}
}

/* =========================================
   REDUCED MOTION
   ========================================= */

@media (prefers-reduced-motion: reduce) {
	.marquee-track {
		animation: none;
	}

	.month-group,
	.month-header {
		transition: none;
	}
}
</style>
