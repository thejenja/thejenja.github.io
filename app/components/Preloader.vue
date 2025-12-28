<template>
	<div class="preloader">
		<div class="loader" role="status" aria-label="Loading" />
	</div>
</template>

<script setup>
// Пропсы оставил — мало ли, где-то используются
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

/* Прогресс-бар */
.loader {
	--height-of-loader: 4px;
	--loader-color: var(--text);
	width: 130px;
	height: var(--height-of-loader);
	border-radius: 30px;
	background-color: var(--bg-secondary);
	position: relative;
}

.loader::before {
	content: "";
	position: absolute;
	background: var(--text);
	top: 0;
	left: 0;
	width: 0%;
	height: 100%;
	border-radius: 30px;
	animation: moving 1s ease-in-out infinite;
}

/* Анимация */
@keyframes moving {
	50% {
		width: 100%;
	}
	100% {
		width: 0;
		right: 0;
		left: unset;
	}
}

/* Respect-режим для accessibility */
@media (prefers-reduced-motion: reduce) {
	.loader::before {
		animation: none;
		width: 60%;
	}
}
</style>
