<template>
	<div
		class="image-placeholder"
		:class="[
			`image-placeholder--${variant}`,
			{ 'image-placeholder--loading': loading },
		]"
		:style="{
			width: width + 'px',
			height: height + 'px',
			borderRadius: borderRadius + 'px',
		}"
	>
		<div v-if="loading" class="placeholder-loading">
			<div class="loading-spinner"></div>
		</div>
		<div v-else class="placeholder-content">
			<component
				v-if="icon"
				:is="icon"
				:size="iconSize"
				class="placeholder-icon"
			/>
			<span v-else class="placeholder-text">{{
				text || $t("common.image")
			}}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
	Image,
	FileImage,
	AlertCircle,
	Code,
	Palette,
	Database,
	Globe,
	Smartphone,
	Package,
	Wrench,
	Gamepad2,
} from "lucide-vue-next";

interface Props {
	width?: number;
	height?: number;
	borderRadius?: number;
	variant?: "default" | "project" | "logo" | "gallery" | "error";
	text?: string;
	icon?: any;
	iconSize?: number;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	width: 200,
	height: 200,
	borderRadius: 8,
	variant: "default",
	iconSize: 24,
	loading: false,
});

// Автоматический выбор иконки по варианту
const defaultIcon = computed(() => {
	switch (props.variant) {
		case "project":
			return Code;
		case "logo":
			return Palette;
		case "gallery":
			return Image;
		case "error":
			return AlertCircle;
		default:
			return FileImage;
	}
});

const icon = computed(() => props.icon || defaultIcon.value);
</script>

<style scoped>
.image-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-tertiary);
	border: 2px dashed var(--border);
	color: var(--text-secondary);
	position: relative;
	overflow: hidden;
}

.image-placeholder--project {
	background: linear-gradient(
		135deg,
		var(--bg-tertiary) 0%,
		var(--bg-secondary) 100%
	);
}

.image-placeholder--logo {
	background: linear-gradient(
		135deg,
		var(--accent) 0%,
		var(--accent-hover) 100%
	);
	color: white;
}

.image-placeholder--gallery {
	background: linear-gradient(
		135deg,
		var(--bg-secondary) 0%,
		var(--bg-tertiary) 100%
	);
}

.image-placeholder--error {
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	color: white;
	border-color: #dc2626;
}

.placeholder-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	text-align: center;
}

.placeholder-icon {
	opacity: 0.7;
}

.placeholder-text {
	font-size: 0.875rem;
	font-weight: 500;
	line-height: 1.2;
}

.placeholder-loading {
	display: flex;
	align-items: center;
	justify-content: center;
}

.loading-spinner {
	width: 24px;
	height: 24px;
	border: 2px solid transparent;
	border-top: 2px solid currentColor;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.image-placeholder--loading {
	background: var(--bg-secondary);
	border-style: solid;
	border-color: var(--accent);
}
</style>
