<template>
	<div class="filter-sidebar">
		<!-- Кнопка открытия фильтров -->
		<button
			class="filter-toggle-btn"
			@click="toggleSidebar"
			:aria-expanded="isOpen"
			:aria-label="
				isOpen ? $t('filters.closeFilters') : $t('filters.openFilters')
			"
		>
			<Filter :size="20" />
			<span class="filter-toggle-text">{{ $t("filters.title") }}</span>
			<ChevronRight :class="{ rotated: isOpen }" :size="16" />
		</button>

		<!-- Боковое меню -->
		<div
			class="filter-sidebar__overlay"
			:class="{ active: isOpen }"
			@click="closeSidebar"
		></div>

		<aside class="filter-sidebar__menu" :class="{ active: isOpen }">
			<div class="filter-sidebar__header">
				<h3>{{ $t("filters.title") }}</h3>
				<button
					class="close-btn"
					@click="closeSidebar"
					:aria-label="$t('filters.closeFilters')"
				>
					<X :size="20" />
				</button>
			</div>

			<div class="filter-sidebar__content">
				<!-- Типы проектов -->
				<div class="filter-section">
					<label class="filter-label">{{ $t("filters.projectType") }}</label>
					<div class="filter-chips">
						<button
							v-for="type in allTypes"
							:key="type"
							class="filter-chip"
							:class="{ active: selectedTypes.includes(type) }"
							@click="toggleType(type)"
						>
							{{ getTypeLabel(type) }}
						</button>
					</div>
				</div>

				<!-- Стадии проектов -->
				<div class="filter-section">
					<label class="filter-label">{{ $t("filters.stage") }}</label>
					<div class="filter-chips">
						<button
							v-for="stage in allStages"
							:key="stage"
							class="filter-chip"
							:class="{ active: selectedStages.includes(stage) }"
							@click="toggleStage(stage)"
						>
							{{ getStageLabel(stage) }}
						</button>
					</div>
				</div>

				<!-- Цвета проектов -->
				<div class="filter-section">
					<label class="filter-label">{{ $t("filters.projectColor") }}</label>
					<div class="color-filters">
						<button
							v-for="color in allProjectColors"
							:key="color"
							class="color-filter-btn"
							:class="{ active: selectedProjectColors.includes(color) }"
							:style="{ '--color': getColorValue(color) }"
							@click="toggleProjectColor(color)"
							:title="getColorLabel(color)"
						>
							<div class="color-circle"></div>
						</button>
					</div>
				</div>

				<!-- Технологии -->
				<div class="filter-section">
					<label class="filter-label">{{ $t("filters.technologies") }}</label>
					<div class="filter-chips">
						<button
							v-for="tech in allTechs"
							:key="tech"
							class="filter-chip"
							:class="{ active: selectedTechs.includes(tech) }"
							@click="toggleTech(tech)"
						>
							{{ tech }}
						</button>
					</div>
				</div>

				<!-- Кнопки действий -->
				<div class="filter-actions">
					<button class="clear-filters-btn" @click="clearFilters">
						{{ $t("filters.clearFilters") }}
					</button>
					<button class="apply-filters-btn" @click="applyFilters">
						{{ $t("filters.apply") }}
					</button>
				</div>
			</div>
		</aside>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Filter, ChevronRight, X } from "lucide-vue-next";

interface Props {
	selectedTechs: string[];
	selectedTypes: string[];
	selectedStages: string[];
	selectedProjectColors: string[];
	allTechs: string[];
	allTypes: string[];
	allStages: string[];
	allProjectColors: string[];
}

interface Emits {
	(e: "update:selectedTechs", value: string[]): void;
	(e: "update:selectedTypes", value: string[]): void;
	(e: "update:selectedStages", value: string[]): void;
	(e: "update:selectedProjectColors", value: string[]): void;
	(e: "apply"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(false);

const toggleSidebar = () => {
	isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
	isOpen.value = false;
};

const toggleType = (type: string) => {
	const newTypes = props.selectedTypes.includes(type)
		? props.selectedTypes.filter((t) => t !== type)
		: [...props.selectedTypes, type];
	emit("update:selectedTypes", newTypes);
};

const toggleStage = (stage: string) => {
	const newStages = props.selectedStages.includes(stage)
		? props.selectedStages.filter((s) => s !== stage)
		: [...props.selectedStages, stage];
	emit("update:selectedStages", newStages);
};

const toggleProjectColor = (color: string) => {
	const newColors = props.selectedProjectColors.includes(color)
		? props.selectedProjectColors.filter((c) => c !== color)
		: [...props.selectedProjectColors, color];
	emit("update:selectedProjectColors", newColors);
};

const toggleTech = (tech: string) => {
	const newTechs = props.selectedTechs.includes(tech)
		? props.selectedTechs.filter((t) => t !== tech)
		: [...props.selectedTechs, tech];
	emit("update:selectedTechs", newTechs);
};

const clearFilters = () => {
	emit("update:selectedTechs", []);
	emit("update:selectedTypes", []);
	emit("update:selectedStages", []);
	emit("update:selectedProjectColors", []);
};

const applyFilters = () => {
	emit("apply");
	closeSidebar();
};

// Вспомогательные функции
const { t } = useI18n();

const getTypeLabel = (type: string) => {
	return t(`projectTypes.${type}`, type);
};

const getStageLabel = (stage: string) => {
	return t(`projectStages.${stage}`, stage);
};

const getColorValue = (color: string) => {
	// Если цвет уже в hex формате, возвращаем как есть
	if (color.startsWith("#")) {
		return color;
	}

	// Если цвет в формате rgb, rgba, hsl и т.д., возвращаем как есть
	if (color.includes("(") && color.includes(")")) {
		return color;
	}

	// Для именованных цветов используем маппинг
	const colors: Record<string, string> = {
		red: "#ef4444",
		orange: "#f97316",
		amber: "#f59e0b",
		yellow: "#eab308",
		lime: "#84cc16",
		green: "#22c55e",
		emerald: "#10b981",
		teal: "#14b8a6",
		cyan: "#06b6d4",
		sky: "#0ea5e9",
		blue: "#3b82f6",
		indigo: "#6366f1",
		violet: "#8b5cf6",
		purple: "#a855f7",
		fuchsia: "#d946ef",
		pink: "#ec4899",
		rose: "#f43f5e",
		gray: "#6b7280",
		slate: "#64748b",
	};
	return colors[color] || color;
};

const getColorLabel = (color: string) => {
	// Для hex цветов возвращаем сам цвет
	if (color.startsWith("#")) {
		return color.toUpperCase();
	}

	// Для именованных цветов используем локализацию
	return t(`colors.${color}`, color);
};
</script>

<style scoped>
.filter-sidebar {
	position: relative;
}

.filter-toggle-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 8px;
	color: var(--text);
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.filter-toggle-btn:hover {
	background: var(--bg-tertiary);
	border-color: var(--accent);
}

.filter-toggle-btn:active {
	transform: translateY(1px);
}

.filter-toggle-text {
	display: none;
}

@media (min-width: 640px) {
	.filter-toggle-text {
		display: inline;
	}
}

.filter-sidebar__overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 998;
	opacity: 0;
	visibility: hidden;
	transition: all 0.3s ease;
}

.filter-sidebar__overlay.active {
	opacity: 1;
	visibility: visible;
}

.filter-sidebar__menu {
	position: fixed;
	top: 0;
	right: -100%;
	width: 100%;
	max-width: 400px;
	height: 100vh;
	background: var(--bg);
	border-left: 1px solid var(--border);
	z-index: 999;
	transition: right 0.3s ease;
	overflow-y: auto;
}

.filter-sidebar__menu.active {
	right: 0;
}

.filter-sidebar__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.5rem;
	border-bottom: 1px solid var(--border);
}

.filter-sidebar__header h3 {
	margin: 0;
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--text);
}

.close-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	background: none;
	border: none;
	border-radius: 6px;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.2s ease;
}

.close-btn:hover {
	background: var(--bg-secondary);
	color: var(--text);
}

.filter-sidebar__content {
	padding: 1.5rem;
}

.filter-section {
	margin-bottom: 2rem;
}

.filter-label {
	display: block;
	margin-bottom: 0.75rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--text);
}

.search-input {
	width: 100%;
	padding: 0.75rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 6px;
	color: var(--text);
	font-size: 0.875rem;
	transition: border-color 0.2s ease;
}

.search-input:focus {
	outline: none;
	border-color: var(--accent);
}

.filter-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.filter-chip {
	padding: 0.5rem 0.75rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 9999px;
	color: var(--text-secondary);
	font-size: 0.75rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.filter-chip:hover {
	background: var(--bg-tertiary);
	border-color: var(--accent);
}

.filter-chip.active {
	background: var(--accent);
	border-color: var(--accent);
	color: white;
}

.color-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.color-filter-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background: none;
	border: 2px solid transparent;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
}

.color-filter-btn:hover {
	transform: scale(1.1);
}

.color-filter-btn.active {
	border-color: var(--text);
	box-shadow: 0 0 0 2px var(--bg);
}

.color-circle {
	width: 100%;
	height: 100%;
	border-radius: 25%;
	background: var(--color);
	border: 2px solid color-mix(in srgb, var(--color) 50%, var(--bg) 20%);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sort-select {
	width: 100%;
	padding: 0.75rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 6px;
	color: var(--text);
	font-size: 0.875rem;
	cursor: pointer;
}

.sort-select:focus {
	outline: none;
	border-color: var(--accent);
}

.filter-actions {
	display: flex;
	gap: 1rem;
	margin-top: 2rem;
}

.clear-filters-btn,
.apply-filters-btn {
	flex: 1;
	padding: 0.75rem;
	border: none;
	border-radius: 6px;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.clear-filters-btn {
	background: var(--bg-secondary);
	color: var(--text-secondary);
	border: 1px solid var(--border);
}

.clear-filters-btn:hover {
	background: var(--bg-tertiary);
	color: var(--text);
}

.apply-filters-btn {
	background: var(--accent);
	color: white;
}

.apply-filters-btn:hover {
	background: var(--accent-hover);
}

.rotated {
	transform: rotate(90deg);
}

@media (max-width: 640px) {
	.filter-sidebar__menu {
		width: 100%;
		max-width: none;
	}
}
</style>
