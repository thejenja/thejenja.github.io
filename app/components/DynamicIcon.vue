<template>
	<Icon
		v-if="iconName"
		:name="iconName"
		:size="size"
		:class="iconClass"
		v-bind="$attrs"
	/>
	<img
		v-else-if="isSvgIcon"
		:src="props.icon"
		:width="size"
		:height="size"
		:alt="fallbackText"
		class="svg-icon"
		loading="lazy"
	/>
	<div
		v-else
		class="icon-placeholder"
		:style="{ width: size + 'px', height: size + 'px' }"
	>
		<span class="icon-fallback">{{ fallbackText }}</span>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	icon?: string; // 'simple-icons:icon-name', 'mingcute:icon-name', '/path/to/icon.svg', or просто 'icon-name'
	size?: number | string;
	fallbackText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	icon: "",
	size: 16,
	fallbackText: "?",
});

const iconClass = ref<string>("");

// Check if it's an SVG icon
const isSvgIcon = computed(() => {
	return props.icon && (props.icon.startsWith("/") || props.icon.endsWith(".svg"));
});

// Compute the icon name for @nuxt/icon
const iconName = computed(() => {
	if (!props.icon) return "";

	// If it's an SVG path, return empty (handled separately)
	if (isSvgIcon.value) return "";

	// If it's already prefixed (has a colon), use as-is
	if (props.icon.includes(":")) {
		return props.icon;
	}

	// Auto-detect: try as mingcute first (most common)
	return `mingcute:${props.icon}`;
});
</script>

<style scoped>
.icon-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-tertiary);
	border-radius: 4px;
	color: var(--text-secondary);
	font-size: 0.75rem;
	font-weight: 600;
}

.icon-fallback {
	line-height: 1;
}

.simple-icon {
	color: currentColor;
}

.lucide-icon {
	color: currentColor;
}

.svg-icon {
	display: block;
}
</style>
