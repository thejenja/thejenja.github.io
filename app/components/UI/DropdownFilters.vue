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
					<Icon v-if="getTypeIcon(type)" :name="getTypeIcon(type)" :size="14" />
					{{ getTypeLabel(type) }}
				</button>

				<button
					class="filter-chip"
					:class="{ active: selectedTypes.includes('featured') }"
					@click="toggleFeatured"
				>
					<Icon name="mingcute:star-fill" :size="14" />
					{{ $t("common.featured") || "Featured" }}
				</button>

				<button
					class="more-filters-btn"
					:aria-expanded="isOpen"
					:aria-label="
						isOpen ? $t('filters.closeFilters') : $t('filters.openFilters')
					"
					@click="toggleDropdown"
				>
					<Icon name="mingcute:filter-fill" :size="16" />
					<span v-if="activeFilterCount > 0" class="filter-count">{{ activeFilterCount }}</span>
					<Icon name="mingcute:down-fill" :class="{ rotated: isOpen }" :size="14" />
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
				<label class="filter-label">{{ $t("filters.technologies") }}</label>
				<div class="filter-chips">
					<TechTag
						v-for="tech in allTechs"
						:key="tech"
						:tag-slug="tech"
						:clickable="true"
						:selected="selectedTechs.includes(tech)"
						@click="toggleTech(tech)"
					/>
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
import { ref, computed } from "vue";
import TechTag from "../TechTag.vue";
import { getTypeIcon } from "~/composables/useProjectIcons";

interface Props {
	selectedTechs: string[];
	selectedTypes: string[];
	selectedStages: string[];
	allTechs: string[];
	allTypes: string[];
	allStages: string[];
	hasActiveFilters?: boolean;
}

interface Emits {
	(
		e:
			| "update:selectedTechs"
			| "update:selectedTypes"
			| "update:selectedStages",
		value: string[],
	): void;
	(e: "apply"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(false);

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

const activeFilterCount = computed(() => {
	let count = 0;
	if (props.selectedTypes.includes("featured")) count++;
	count += props.selectedStages.length;
	count += props.selectedTechs.length;
	return count;
});

const toggleType = (type: string) => {
	const newTypes = props.selectedTypes.includes(type)
		? props.selectedTypes.filter((t) => t !== type)
		: [...props.selectedTypes, type];
	emit("update:selectedTypes", newTypes);
};

const toggleFeatured = () => {
	const newTypes = props.selectedTypes.includes("featured")
		? props.selectedTypes.filter((t) => t !== "featured")
		: [...props.selectedTypes, "featured"];
	emit("update:selectedTypes", newTypes);
};

const toggleStage = (stage: string) => {
	const newStages = props.selectedStages.includes(stage)
		? props.selectedStages.filter((s) => s !== stage)
		: [...props.selectedStages, stage];
	emit("update:selectedStages", newStages);
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
    display: inline-flex;
    align-items: center;
	gap: 4px;
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
	position: relative;
}

.filter-count {
	position: absolute;
	top: -6px;
	right: -6px;
	background: var(--accent);
	color: white;
	font-size: 0.7rem;
	font-weight: 700;
	min-width: 18px;
	height: 18px;
	border-radius: 9px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 4px;
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

@media (max-width: 768px) {
	.dropdown-menu {
		width: 100%;
		min-width: 300px;
	}
}
</style>
