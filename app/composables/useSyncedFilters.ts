import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export interface SyncedFilters {
	selectedTechs: Ref<string[]>;
	selectedTypes: Ref<string[]>;
	selectedStages: Ref<string[]>;
	clearFilters: () => void;
	hasActiveFilters: ComputedRef<boolean>;
}

export function useSyncedFilters(): SyncedFilters {
	const route = useRoute();
	const router = useRouter();

	// Parse query params on initialization
	const parseQueryParam = (key: string): string[] => {
		const value = route.query[key];
		if (typeof value === "string") {
			return value.split(",").filter(Boolean);
		}
		if (Array.isArray(value)) {
			return value
				.flatMap((v) => (typeof v === "string" ? v.split(",") : []))
				.filter(Boolean);
		}
		return [];
	};

	// Initialize refs from URL
	const selectedTechs = ref<string[]>(parseQueryParam("tech"));
	const selectedTypes = ref<string[]>(parseQueryParam("type"));
	const selectedStages = ref<string[]>(parseQueryParam("stage"));

	// Sync filters to URL
	const syncToUrl = () => {
		const query: Record<string, string | undefined> = {};
		// Convert route.query to proper type
		for (const [key, value] of Object.entries(route.query)) {
			if (value === null) {
				query[key] = undefined;
			} else if (Array.isArray(value)) {
				query[key] = value.filter((v): v is string => v !== null).join(',');
			} else {
				query[key] = value;
			}
		}

		// Update or remove each filter param
		query.tech = selectedTechs.value.length
			? selectedTechs.value.join(",")
			: undefined;
		query.type = selectedTypes.value.length
			? selectedTypes.value.join(",")
			: undefined;
		query.stage = selectedStages.value.length
			? selectedStages.value.join(",")
			: undefined;

		// Remove undefined values
		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		router.replace({ query });
	};

	// Watch each filter and sync to URL
	watch(selectedTechs, syncToUrl, { deep: true });
	watch(selectedTypes, syncToUrl, { deep: true });
	watch(selectedStages, syncToUrl, { deep: true });

	// Clear all filters
	const clearFilters = () => {
		selectedTechs.value = [];
		selectedTypes.value = [];
		selectedStages.value = [];
	};

	// Check if any filter is active
	const hasActiveFilters = computed<boolean>(() => {
		return (
			selectedTechs.value.length > 0 ||
			selectedTypes.value.length > 0 ||
			selectedStages.value.length > 0
		);
	});

	return {
		selectedTechs,
		selectedTypes,
		selectedStages,
		clearFilters,
		hasActiveFilters,
	};
}
