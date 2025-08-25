<template>
	<div class="preloader">
		<div class="spinner" role="status" aria-label="Loading"></div>
	</div>
</template>

<script setup>
// Оставляем пропсы для совместимости, но не используем их внутри компонента
defineProps({
	progress: { type: Number, default: 0 },
	loadingText: { type: String, default: "" },
});
</script>

<style scoped>
.preloader {
	position: fixed;
	inset: 0;
	background: var(--bg);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.spinner {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	border: 3px solid var(--bg-tertiary);
	border-top-color: var(--accent);
	animation: spin 0.9s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.spinner {
		animation: none;
	}
}
</style>
