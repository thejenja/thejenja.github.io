<template>
	<div class="skeleton-loader" :class="variant">
		<template v-if="variant === 'article'">
			<div class="skeleton-header">
				<div class="skeleton-avatar" />
				<div class="skeleton-text-group">
					<div class="skeleton-text skeleton-title" />
					<div class="skeleton-text skeleton-subtitle" />
				</div>
			</div>
			<div class="skeleton-content">
				<div class="skeleton-text skeleton-line" />
				<div class="skeleton-text skeleton-line" />
				<div class="skeleton-text skeleton-line short" />
			</div>
		</template>

		<template v-else-if="variant === 'project'">
			<div class="skeleton-image" />
			<div class="skeleton-content">
				<div class="skeleton-text skeleton-title" />
				<div class="skeleton-text skeleton-line" />
				<div class="skeleton-text skeleton-line short" />
				<div class="skeleton-tags">
					<div class="skeleton-tag" />
					<div class="skeleton-tag" />
					<div class="skeleton-tag" />
				</div>
			</div>
		</template>

		<template v-else-if="variant === 'text'">
			<div class="skeleton-text skeleton-title" />
			<div class="skeleton-text skeleton-line" />
			<div class="skeleton-text skeleton-line" />
			<div class="skeleton-text skeleton-line short" />
		</template>

		<template v-else>
			<div class="skeleton-text skeleton-line" />
			<div class="skeleton-text skeleton-line" />
			<div class="skeleton-text skeleton-line short" />
		</template>
	</div>
</template>

<script setup lang="ts">
interface Props {
	variant?: "article" | "project" | "text" | "default";
}

withDefaults(defineProps<Props>(), {
	variant: "default",
});
</script>

<style scoped>
.skeleton-loader {
	padding: 1.5rem;
	background: var(--bg-secondary);
	border-radius: 16px;
	border: 1px solid var(--bg-tertiary);
}

.skeleton-header {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
}

.skeleton-avatar {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: var(--bg-tertiary);
	animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-text-group {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.skeleton-text {
	height: 1rem;
	background: var(--bg-tertiary);
	border-radius: 4px;
	animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-title {
	height: 1.5rem;
	width: 70%;
}

.skeleton-subtitle {
	height: 0.875rem;
	width: 50%;
}

.skeleton-line {
	width: 100%;
	margin-bottom: 0.5rem;
}

.skeleton-line.short {
	width: 60%;
}

.skeleton-content {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.skeleton-image {
	width: 100%;
	height: 200px;
	background: var(--bg-tertiary);
	border-radius: 12px;
	margin-bottom: 1rem;
	animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-tags {
	display: flex;
	gap: 0.5rem;
	margin-top: 1rem;
}

.skeleton-tag {
	width: 60px;
	height: 24px;
	background: var(--bg-tertiary);
	border-radius: 12px;
	animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.6;
	}
}

/* Варианты размеров */
.skeleton-loader.article {
	min-height: 200px;
}

.skeleton-loader.project {
	min-height: 300px;
}

.skeleton-loader.text {
	min-height: 120px;
}

/* Адаптивность */
@media (max-width: 768px) {
	.skeleton-loader {
		padding: 1rem;
	}

	.skeleton-image {
		height: 150px;
	}

	.skeleton-tags {
		flex-wrap: wrap;
	}
}
</style>
