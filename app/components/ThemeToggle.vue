<template>
	<!-- Minimal mode for TopBar -->
	<button
		v-if="minimal"
		class="theme-btn-minimal"
		aria-label="Toggle theme"
		:title="$t('theme.' + colorMode.preference)"
		@click="toggleTheme"
	>
		<Icon v-if="currentTheme === 'dark'" name="mingcute:moon-fill" :size="20" />
		<Icon v-else name="mingcute:sun-fill" :size="20" />
	</button>

	<!-- Full mode for Navigation -->
	<button
		v-else
		class="nav-tile"
		aria-label="Toggle theme"
		:title="$t('theme.' + colorMode.preference)"
		@click="toggleTheme"
	>
		<div class="tile-icon-wrapper">
			<Icon v-if="currentTheme === 'dark'" name="mingcute:moon-fill" class="theme-icon" />
			<Icon v-else name="mingcute:sun-fill" class="theme-icon" />
		</div>
		<span class="tile-label">{{ $t("theme." + colorMode.preference) }}</span>
	</button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	minimal?: boolean;
}

withDefaults(defineProps<Props>(), {
	minimal: false,
});

const colorMode = useColorMode();

// Вычисляем текущую активную тему (учитывая системную)
const currentTheme = computed(() => {
	if (colorMode.preference === "system") {
		if (import.meta.client) {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}
		return "dark";
	}
	return colorMode.value;
});

const toggleTheme = (event: MouseEvent) => {
	// Проверяем поддержку View Transitions API
	if (import.meta.client && document.startViewTransition) {
		// Получаем координаты клика
		const x = event.clientX;
		const y = event.clientY;

		// Вычисляем максимальный радиус для покрытия всего экрана
		const endRadius = Math.hypot(
			Math.max(x, innerWidth - x),
			Math.max(y, innerHeight - y),
		);

		// Начинаем переход с анимацией
		const transition = document.startViewTransition(async () => {
			const themes = ["light", "dark"];
			const currentPreference = colorMode.preference || "system";
			const currentIndex = themes.indexOf(currentPreference);
			const nextIndex = (currentIndex + 1) % themes.length;
			colorMode.preference = themes[nextIndex] as "light" | "dark";
		});

		// Добавляем стили для анимации ripple-эффекта
		transition.ready.then(() => {
			const root = document.documentElement;
			root.style.setProperty("--ripple-x", `${x}px`);
			root.style.setProperty("--ripple-y", `${y}px`);
			root.style.setProperty("--ripple-radius", `${endRadius}px`);
		});
	} else {
		// Если API не поддерживается, просто меняем тему
		const themes = ["light", "dark"];
		const currentPreference = colorMode.preference || "system";
		const currentIndex = themes.indexOf(currentPreference);
		const nextIndex = (currentIndex + 1) % themes.length;
		colorMode.preference = themes[nextIndex] as "light" | "dark";
	}
};
</script>

<style scoped>
/* Minimal button styles */
.theme-btn-minimal {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 10px;
	background: transparent;
	border: none;
	color: var(--text);
	cursor: pointer;
	transition: all 0.2s ease;
}

.theme-btn-minimal:hover {
	opacity: 0.8;
}

/* Стили для плитки (совпадают с LanguageToggle для симметрии) */
.nav-tile {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.75rem;
	background: var(--bg-tertiary);
	color: var(--text);
	border-radius: 12px;
	border: 1px solid transparent;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	width: 100%;
	height: 100%;
	min-height: 80px;
}

.nav-tile:hover {
	background: var(--bg-secondary);
	border-color: var(--bg-tertiary);
	transform: translateY(-2px);
}

.nav-tile:active {
	transform: scale(0.98);
}

.tile-icon-wrapper {
	display: flex;
	align-items: center;
}

.tile-label {
	font-size: 0.9rem;
	font-weight: 500;
	text-transform: capitalize;
}

.theme-icon {
	width: 1.5rem;
	height: 1.5rem;
	transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	transform-origin: center;
}

.nav-tile:hover .theme-icon {
	transform: rotate(15deg) scale(1.1);
}

.nav-tile:active .theme-icon {
	transform: rotate(-15deg) scale(0.95);
}

@media (prefers-reduced-motion: reduce) {
	.theme-icon,
	.nav-tile {
		transition: none;
	}

	.nav-tile:hover .theme-icon,
	.nav-tile:active .theme-icon {
		transform: none;
	}
}
</style>
