<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useClipboard } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import AnimatedSection from "~/components/AnimatedSection.vue";
import { useProjects, type ProjectContent } from "~/composables/useProjects";
import { useSyncedFilters } from "~/composables/useSyncedFilters";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import DropdownFilters from "~/components/UI/DropdownFilters.vue";
import TimelineScrubber from "~/components/TimelineScrubber.vue";
import TimelineProjects from "~/components/sections/TimelineProjects.vue";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const { t, locale } = useI18n();
const { loadAllProjects, refreshProjects } = useProjects();

// Загрузка проектов с кэшированием через useAsyncData
const {
	data: projects,
	pending,
	refresh,
} = await useAsyncData<ProjectContent[]>(
	() => `all-projects-${locale.value}`,
	async () => {
		try {
			const result = await loadAllProjects(locale.value);
			return result || [];
		} catch {
			return [];
		}
	},
);

// Следим за изменением локали и обновляем проекты
watch(locale, async (newLocale) => {
	await refreshProjects(newLocale);
	await refresh();
});

// Автоматическое обновление при фокусе на странице
onMounted(() => {
	const handleFocus = () => {
		const lastUpdate = sessionStorage.getItem("projects-last-update");
		const now = Date.now();
		if (!lastUpdate || now - parseInt(lastUpdate) > 5 * 60 * 1000) {
			refresh();
			sessionStorage.setItem("projects-last-update", now.toString());
		}
	};

	window.addEventListener("focus", handleFocus);

	onUnmounted(() => {
		window.removeEventListener("focus", handleFocus);
	});
});

// Фильтры с синхронизацией URL
const {
	selectedTechs,
	selectedTypes,
	selectedStages,
	clearFilters,
	hasActiveFilters,
} = useSyncedFilters();

const allTechs = computed<string[]>(() => {
	const set = new Set<string>();
	(projects.value || []).forEach((p: ProjectContent) => {
		(p.meta?.technologies || []).forEach((t: string) => set.add(t));
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const allTypes = computed<string[]>(() => {
	const set = new Set<string>();
	(projects.value || []).forEach((p: ProjectContent) => {
		if (p.meta?.type) set.add(p.meta.type);
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const allStages = computed<string[]>(() => {
	const set = new Set<string>();
	(projects.value || []).forEach((p: ProjectContent) => {
		if (p.meta?.stage) set.add(p.meta.stage);
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const filtered = computed<ProjectContent[]>(() => {
	let list: ProjectContent[] = [...(projects.value || [])];

	// Фильтр по технологиям (пересечение)
	if (selectedTechs.value.length) {
		list = list.filter((p: ProjectContent) => {
			const techs: string[] = p.meta?.technologies || [];
			return selectedTechs.value.every((t) => techs.includes(t));
		});
	}

	// Фильтр по типам (включая виртуальный фильтр "featured")
	if (selectedTypes.value.length) {
		const hasFeatured = selectedTypes.value.includes("featured");
		const realTypes = selectedTypes.value.filter((t) => t !== "featured");

		list = list.filter((p: ProjectContent) => {
			let match = true;

			// Обычные типы проектов
			if (realTypes.length > 0) {
				const projectType = p.meta?.type;
				match = match && !!projectType && realTypes.includes(projectType);
			}

			// Виртуальный фильтр "featured" - только избранные проекты
			if (hasFeatured) {
				match = match && p.meta?.featured === true;
			}

			return match;
		});
	}

	// Фильтр по стадиям
	if (selectedStages.value.length) {
		list = list.filter(
			(p: ProjectContent) =>
				p.meta?.stage && selectedStages.value.includes(p.meta.stage),
		);
	}

	// Сортировка по дате (по умолчанию новые вперёд)
	list.sort(
		(a: ProjectContent, b: ProjectContent) =>
			new Date(String(b.date || b.meta?.date || 0)).getTime() -
			new Date(String(a.date || a.meta?.date || 0)).getTime(),
	);

	return list;
});

useSeoMeta({
	title: computed(() => `${t("projects.title")}`),
	description: computed(() => t("projects.description")),
});

useSchemaOrg([
	{
		"@type": "WebPage",
		name: computed(() => t("projects.title")),
		description: computed(() => t("projects.description")),
		isPartOf: {
			"@type": "WebSite",
			name: "thejenja",
			url: "https://thejenja.github.io",
		},
	},
	{
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://thejenja.github.io",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: computed(() => t("projects.title")),
				item: computed(
					() =>
						`https://thejenja.github.io/${locale.value === "ru" ? "ru/" : ""}projects`,
				),
			},
		],
	},
]);

defineOgImage("ProjectsListTemplate");

// Copy filtered URL to clipboard
const { copy } = useClipboard();
const showShareNotification = ref(false);

const shareFilteredUrl = async () => {
	const url = window.location.href;
	await copy(url);
	showShareNotification.value = true;
	setTimeout(() => {
		showShareNotification.value = false;
	}, 2000);
};

// Page animations
onMounted(() => {
	nextTick(() => {
		// Animate page header
		gsap.fromTo(
			".page-header",
			{ opacity: 0, y: -20 },
			{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
		);

		// Animate filters
		gsap.fromTo(
			".filters-container",
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" },
		);
	});
});
</script>

<template>
	<div class="projects-page">
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">{{ $t("projects.title") }}</h1>
				<p class="page-description">{{ $t("projects.description") }}</p>
			</div>
		</div>

		<div class="filters-container">
			<DropdownFilters
				v-model:selected-techs="selectedTechs"
				v-model:selected-types="selectedTypes"
				v-model:selected-stages="selectedStages"
				:all-techs="allTechs"
				:all-types="allTypes"
				:all-stages="allStages"
				:has-active-filters="hasActiveFilters"
				@clear-filters="clearFilters"
				@share="shareFilteredUrl"
			/>
		</div>

		<!-- Share notification -->
		<Transition name="fade">
			<div v-if="showShareNotification" class="share-notification">
				<Icon name="mingcute:link-fill" :size="16" />
				<span>{{ $t("filters.linkCopied") || "Ссылка скопирована!" }}</span>
			</div>
		</Transition>

		<!-- Loading state -->
		<div v-if="pending" class="loading-message">
			<p>{{ $t("projects.loading") }}</p>
		</div>

		<!-- Timeline Scrubber -->
		<TimelineScrubber v-if="!pending" :projects="filtered || []" />

		<!-- Main Timeline Projects -->
		<AnimatedSection v-if="!pending" animation-type="scale">
			<TimelineProjects :projects="filtered || []" view-mode="timeline" />
		</AnimatedSection>
	</div>
</template>

<style scoped>
.page-header {
	text-align: center;
	margin-bottom: 2rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	max-width: 1200px;
	margin-left: auto;
	margin-right: auto;
}

.header-content {
	flex: 1;
	text-align: left;
}

.page-title {
	font-size: 2.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: var(--text);
}

.page-description {
	font-size: 1.125rem;
	color: var(--text-secondary);
}

.filters-container {
	margin: 1rem auto;
	display: flex;
	justify-content: center;
	width: 100%;
}

/* Loading state */
.loading-message {
	text-align: center;
	padding: 2rem;
	color: var(--text-secondary);
}

.loading-message p {
	font-size: 1.125rem;
	margin: 0;
}

@media (max-width: 768px) {
	.page-header {
		margin-bottom: 1.5rem;
	}

	.header-content {
		text-align: center;
	}

	.page-title {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.page-description {
		font-size: 1rem;
	}

	.filters-container {
		margin: 0.75rem auto;
	}
}

@media (max-width: 480px) {
	.page-title {
		font-size: 1.75rem;
	}
}

/* Share notification */
.share-notification {
	position: fixed;
	bottom: 24px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 20px;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 50px;
	color: var(--text);
	font-weight: 500;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 0.3s ease,
		transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateX(-50%) translateY(10px);
}
</style>
