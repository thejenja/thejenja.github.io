<script setup lang="ts">
// Автоматическая обработка ошибок Nuxt
const props = defineProps({
	error: Object,
});

// Очистка ошибки и возврат на главную
const handleClearError = async () => {
	await clearError({ redirect: "/" });
};
</script>

<template>
	<div class="error-page-wrapper">
		<section class="error-hero">
			<div class="error-content">
				<h1 class="error-code">{{ error?.statusCode || 404 }}</h1>
				<h2 class="error-title">
					{{ error?.statusCode === 404 ? "Page Not Found" : "An Error Occurred" }}
				</h2>
				<p class="error-description">
					{{
						error?.statusCode === 404
							? "Sorry, the page you are looking for does not exist or has been moved."
							: "Something went wrong. Please try again later."
					}}
				</p>
				<div class="error-actions">
					<button class="error-button primary" @click="handleClearError">
						<Icon name="mingcute:home-5-fill" :size="20" />
						Back to Home
					</button>
					<NuxtLink to="/projects" class="error-button secondary">
						<Icon name="mingcute:folder-open-fill" :size="20" />
						View Projects
					</NuxtLink>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
@property --x1 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 0%;
}
@property --y1 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 0%;
}
@property --x2 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 100%;
}
@property --y2 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 100%;
}

.error-page-wrapper {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg);
}

.error-hero {
	--x1: 0%;
	--y1: 0%;
	--x2: 100%;
	--y2: 100%;
	position: relative;
	min-height: 450px;
	width: 100%;
	max-width: 900px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0;
	background:
		radial-gradient(
			circle at var(--x1) var(--y1),
			var(--gradient-1) 0%,
			transparent 40%
		),
		radial-gradient(
			circle at var(--x2) var(--y2),
			var(--gradient-2) 0%,
			transparent 40%
		),
		var(--bg-quaternary);
	animation: rotateBlobs 12s cubic-bezier(0.22, 1, 0.36, 1) infinite;
	color: var(--text);
	padding: 2rem;
	text-align: center;
}

.error-hero::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: 0;
	filter: blur(30px);
	background: inherit;
	opacity: 0.5;
}

.error-content {
	position: relative;
	z-index: 10;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.error-code {
	font-size: 6rem;
	font-weight: 700;
	line-height: 1;
	margin: 0;
}

.error-title {
	font-size: 1.5rem;
	font-weight: 600;
	margin: 0;
}

.error-description {
	color: var(--text-secondary);
	font-size: 1rem;
	line-height: 1.6;
	margin: 0;
}

.error-actions {
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
	flex-wrap: wrap;
	justify-content: center;
}

.error-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.625rem 1.25rem;
	border-radius: 12px;
	text-decoration: none;
	font-weight: 600;
	font-size: 0.875rem;
	transition: all 0.3s ease;
	border: none;
	cursor: pointer;
}

.error-button.primary {
	background: var(--text);
	color: var(--bg);
}

.error-button.primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.3);
}

.error-button.secondary {
	background: var(--bg-secondary);
	color: var(--text);
	border: 1px solid var(--border);
}

.error-button.secondary:hover {
	background: var(--bg-tertiary);
	transform: translateY(-2px);
}

@keyframes rotateBlobs {
	0%,
	to {
		--x1: 0%;
		--y1: 0%;
		--x2: 100%;
		--y2: 100%;
	}
	25% {
		--x1: 100%;
		--y1: 0%;
		--x2: 0%;
		--y2: 100%;
	}
	50% {
		--x1: 100%;
		--y1: 100%;
		--x2: 0%;
		--y2: 0%;
	}
	75% {
		--x1: 0%;
		--y1: 100%;
		--x2: 100%;
		--y2: 0%;
	}
}

@media (max-width: 640px) {
	.error-code {
		font-size: 4rem;
	}
	.error-title {
		font-size: 1.25rem;
	}
	.error-hero {
		min-height: 280px;
	}
}
</style>
