<script setup lang="ts">
import { computed, ref } from "vue";
import TimelineProjects from "~/components/TimelineProjects.vue";
import FilterSidebar from "~/components/FilterSidebar.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

interface Project {
	title?: string;
	description?: string;
	date?: string;
	meta?: {
		slug?: string;
		color?: string;
		background?: string;
		technologies?: string[];
		tags?: Array<{
			name: string;
			color: string;
			icon?: string;
		}>;
		type?:
			| "website"
			| "library"
			| "web-app"
			| "mobile-app"
			| "tool"
			| "game"
			| "design";
		stage?: "completed" | "in-progress" | "planning" | "archived" | "on-hold";
		featured?: boolean;
		github?: string;
		demo?: string | null;
		date?: string;
		icon?: string;
		behance?: string;
		dribbble?: string;
	};
	_path?: string;
}

const { loadAllProjects, refreshProjects } = useProjects();

// Получаем текущую локаль
const { locale } = useI18n();

// Используем computed для реактивности при изменении локали
const {
	data: projects,
	pending,
	refresh,
} = await useAsyncData(
	() => `all-projects-${locale.value}`,
	async () => {
		try {
			const result = await loadAllProjects(locale.value);
			return result || [];
		} catch {
			// console.error(t("projects.loadingError"), error);
			return [];
		}
	}
);

// Следим за изменением локали и обновляем проекты
watch(locale, async (newLocale) => {
	await refreshProjects(newLocale);
	await refresh();
});

// Автоматическое обновление при фокусе на странице
onMounted(() => {
	const handleFocus = () => {
		// Обновляем проекты только если прошло больше 5 минут с последнего обновления
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

// Фильтры
const selectedTechs = ref<string[]>([]);
const selectedTypes = ref<string[]>([]);
const selectedStages = ref<string[]>([]);
const selectedProjectColors = ref<string[]>([]);

const allTechs = computed<string[]>(() => {
	const set = new Set<string>();
	(projects.value || []).forEach((p: Project) => {
		(p.meta?.technologies || []).forEach((t: string) => set.add(t));
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const allTypes = computed<string[]>(() => {
	const set = new Set<string>();
	(projects.value || []).forEach((p: Project) => {
		if (p.meta?.type) set.add(p.meta.type);
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const allStages = computed<string[]>(() => {
	const set = new Set<string>();
	(projects.value || []).forEach((p: Project) => {
		if (p.meta?.stage) set.add(p.meta.stage);
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const allProjectColors = computed<string[]>(() => {
	const set = new Set<string>();
	(projects.value || []).forEach((p: Project) => {
		if (p.meta?.color) set.add(p.meta.color);
	});
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

// Функция для определения похожести цветов
const isSimilarColor = (color1: string, color2: string): boolean => {
	// Простая проверка на точное совпадение
	if (color1 === color2) return true;

	// Проверка на похожие цвета (можно расширить логику)
	const hex1 = color1.startsWith("#") ? color1 : `#${color1}`;
	const hex2 = color2.startsWith("#") ? color2 : `#${color2}`;

	// Если цвета в hex формате, сравниваем их
	if (/^#[0-9A-F]{6}$/i.test(hex1) && /^#[0-9A-F]{6}$/i.test(hex2)) {
		return hex1 === hex2;
	}

	// Для других форматов (CSS цвета) просто сравниваем строки
	return color1.toLowerCase() === color2.toLowerCase();
};

const filtered = computed<Project[]>(() => {
	let list: Project[] = [...(projects.value || [])];

	// Фильтр по технологиям (пересечение)
	if (selectedTechs.value.length) {
		list = list.filter((p: Project) => {
			const techs: string[] = p.meta?.technologies || [];
			return selectedTechs.value.every((t) => techs.includes(t));
		});
	}

	// Фильтр по типам
	if (selectedTypes.value.length) {
		list = list.filter(
			(p: Project) => p.meta?.type && selectedTypes.value.includes(p.meta.type)
		);
	}

	// Фильтр по стадиям
	if (selectedStages.value.length) {
		list = list.filter(
			(p: Project) =>
				p.meta?.stage && selectedStages.value.includes(p.meta.stage)
		);
	}

	// Фильтр по цветам проектов (универсальный)
	if (selectedProjectColors.value.length) {
		list = list.filter((p: Project) => {
			const projectColor = p.meta?.color;
			if (!projectColor) return false;

			// Проверяем, есть ли похожий цвет в выбранных
			return selectedProjectColors.value.some((selectedColor) =>
				isSimilarColor(projectColor, selectedColor)
			);
		});
	}

	// Сортировка по дате (по умолчанию новые вперёд)
	list.sort(
		(a: Project, b: Project) =>
			new Date(b.date || b.meta?.date || 0).getTime() -
			new Date(a.date || a.meta?.date || 0).getTime()
	);

	return list;
});

const applyFilters = () => {
	// Фильтры применяются автоматически через computed свойство
	// console.log("Фильтры применены");
};

// Обработчик клика по проекту
const handleProjectClick = (project: Project) => {
	// Здесь можно добавить логику открытия проекта
	// Например, переход на страницу проекта или открытие модального окна
	// console.log("Клик по проекту:", project.title);

	// Временное решение - переход на страницу проекта
	if (project._path) {
		navigateTo(`/projects/${project._path.split("/").pop()}`);
	}
};

// SEO для страницы проектов
const seo = useSEO();
useHead(() => ({
	...seo.getPageSEO(),
	title: `${seo.getPageSEO().title} - ${t("projects.title")}`,
	meta: [
		...seo.getPageSEO().meta,
		{
			name: "description",
			content: `Портфолио проектов ${t("seo.description")}`,
		},
	],
}));
</script>

<template>
	<div class="projects-page">
		<div class="container">
			<!-- Заголовок страницы -->
			<div class="page-header">
				<div class="header-content">
					<h1 class="page-title">{{ $t("projects.title") }}</h1>
					<p class="page-description">{{ $t("projects.description") }}</p>
				</div>

				<div class="controls">
					<!-- Фильтры -->
					<FilterSidebar
						v-model:selected-techs="selectedTechs"
						v-model:selected-types="selectedTypes"
						v-model:selected-stages="selectedStages"
						v-model:selected-project-colors="selectedProjectColors"
						:all-techs="allTechs"
						:all-types="allTypes"
						:all-stages="allStages"
						:all-project-colors="allProjectColors"
						@apply="applyFilters"
					/>
				</div>
			</div>

			<TimelineProjects
				:projects="filtered || []"
				@project-click="handleProjectClick"
			/>

			<!-- Сообщение о загрузке -->
			<div v-if="pending" class="loading-message">
				<p>{{ $t("projects.loading") }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.projects-page {
	padding: 2rem 0;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
}

.page-header {
	text-align: center;
	margin-bottom: 2rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
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

.refresh-button {
	background-color: var(--accent);
	color: #fff;
	padding: 0.5rem 1rem;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
	background-color: var(--accent-hover);
}

.refresh-button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.refresh-button svg {
	transition: transform 0.3s ease;
}

.refresh-button .rotating {
	animation: rotate 1s linear infinite;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.controls {
	margin: 1rem auto 0;
	display: flex;
	gap: 0.75rem;
	justify-content: center;
	flex-wrap: wrap;
}

.search-input {
	width: 100%;
	padding: 0.5rem 0.75rem;
	border-radius: 8px;
	border: 1px solid var(--border);
	background: var(--bg-secondary);
	color: var(--text);
}

.sort-select {
	padding: 0.5rem 0.75rem;
	border-radius: 8px;
	border: 1px solid var(--border);
	background: var(--bg-secondary);
	color: var(--text);
}

.filters-section {
	margin-top: 1.5rem;
	text-align: center;
}

.filters-title {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--text-secondary);
	margin: 0 0 0.75rem 0;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.filters-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
}

.chip {
	padding: 0.375rem 0.75rem;
	border-radius: 9999px;
	border: 1px solid var(--border);
	background: var(--bg-tertiary);
	color: var(--text);
	cursor: pointer;
}

.chip.active {
	background: var(--accent);
	border-color: transparent;
	color: #fff;
}

.chip--color {
	position: relative;
	overflow: hidden;
}

.chip--color::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: var(--color);
	opacity: 0.1;
	transition: opacity 0.2s ease;
}

.chip--color:hover::before {
	opacity: 0.2;
}

.chip--color.active::before {
	opacity: 0.3;
}

/* Сообщение о загрузке */
.loading-message {
	text-align: center;
	padding: 2rem;
	color: var(--text-secondary);
}

.loading-message p {
	font-size: 1.125rem;
	margin: 0;
}
</style>
