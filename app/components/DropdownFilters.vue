<template>
	<div class="dropdown-filters" :class="{ active: isOpen }">
		<div class="filter-chips-container">
			<div v-if="allTypes.length > 0" class="filter-chip-group">
				<button
					v-for="type in allTypes"
					:key="type"
					class="filter-chip"
					:class="{ active: selectedTypes.includes(type) }"
					@click="toggleType(type)"
				>
					{{ getTypeLabel(type) }}
				</button>

				<button
					class="more-filters-btn"
					:aria-expanded="isOpen"
					:aria-label="
						isOpen ? $t('filters.closeFilters') : $t('filters.openFilters')
					"
					@click="toggleDropdown"
				>
					<Filter :size="16" />
					<ChevronDown :class="{ rotated: isOpen }" :size="14" />
				</button>
			</div>
		</div>

		<div v-show="isOpen" class="dropdown-menu">
			<div class="dropdown-content">
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

				<div class="filter-section">
					<label class="filter-label">{{ $t("filters.projectColor") }}</label>
					<div class="color-filters">
						<button
							v-for="color in allProjectColors"
							:key="color"
							class="color-filter-btn"
							:class="{ active: selectedProjectColors.includes(color) }"
							:style="{ '--color': getColorValue(color) }"
							:title="getColorLabel(color)"
							@click="toggleProjectColor(color)"
						>
							<div class="color-circle" />
						</button>
					</div>
				</div>

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

				<div class="filter-actions">
					<button class="clear-filters-btn" @click="clearFilters">
						{{ $t("filters.clearFilters") }}
					</button>
					<button class="apply-filters-btn" @click="applyFilters">
						{{ $t("filters.apply") }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Filter, ChevronDown } from "lucide-vue-next";

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
	(
		e:
			| "update:selectedTechs"
			| "update:selectedTypes"
			| "update:selectedStages"
			| "update:selectedProjectColors",
		value: string[]
	): void;
	(e: "apply"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(false);

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
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
	isOpen.value = false;
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
.dropdown-filters {
	position: relative;
	width: 100%;
	text-align: center;
}

.filter-chips-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
}

.filter-chip-group {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
}

.filter-group-label {
	font-weight: 500;
	color: var(--text-secondary);
	white-space: nowrap;
}

.filter-chip {
	padding: 0.5rem 0.75rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 9999px;
	color: var(--text-secondary);
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

.color-filter-chip {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border: 2px solid transparent;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
	background: none;
}

.color-filter-chip:hover {
	transform: scale(1.1);
}

.color-filter-chip.active {
	border-color: var(--text);
	box-shadow: 0 0 0 2px var(--bg);
}

.color-indicator {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background: var(--color);
	border: 2px solid color-mix(in srgb, var(--color) 50%, var(--bg) 20%);
}

.more-filters-btn {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.5rem 0.75rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 999px;
	color: var(--text-secondary);
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.more-filters-btn:hover {
	background: var(--bg-tertiary);
	border-color: var(--accent);
	color: var(--text);
}

.more-filters-btn.active {
	background: var(--accent);
	border-color: var(--accent);
	color: white;
}

.dropdown-menu {
	position: relative;
	z-index: 1000;
	margin-top: 0.5rem;
	overflow: hidden;
	display: inline-block;
}

.dropdown-content {
	padding: 1.5rem;
}

.filter-section {
	margin-bottom: 1.5rem;
}

.filter-label {
	display: block;
	margin-bottom: 0.75rem;
	font-weight: 600;
	color: var(--text);
}

.filter-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
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

.filter-actions {
	display: flex;
	gap: 1rem;
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px solid var(--border);
}

.clear-filters-btn,
.apply-filters-btn {
	flex: 1;
	padding: 0.75rem;
	border: none;
	border-radius: 6px;
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
	transform: rotate(180deg);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
	.dropdown-menu {
		width: 100%;
		min-width: 300px;
	}
}
</style>
