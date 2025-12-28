<template>
	<button
		class="nav-link"
		aria-label="Toggle theme"
		:title="$t('theme.' + colorMode.preference)"
		@click="toggleTheme"
	>
		<Moon v-if="currentTheme === 'dark'" class="theme-icon" />
		<Sun v-else class="theme-icon" />
		<span class="theme-text">{{ $t("theme." + colorMode.preference) }}</span>
	</button>
</template>

<script setup>
import { Moon, Sun } from "lucide-vue-next";

const colorMode = useColorMode();

// Вычисляем текущую активную тему (учитывая системную)
const currentTheme = computed(() => {
	if (colorMode.preference === "system") {
		// Если выбрана системная тема, определяем её
		if (import.meta.client) {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}
		return "dark"; // fallback для SSR
	}
	return colorMode.value;
});

const toggleTheme = () => {
	// Добавляем анимацию переключения темы
	const { shouldAnimate } = useAnimationPreferences();

	if (shouldAnimate("decorative")) {
		// Анимация "вспышки" при переключении темы
		const flash = document.createElement("div");
		flash.style.cssText = `
			position: fixed;
			inset: 0;
			background: var(--text);
			opacity: 0;
			pointer-events: none;
			z-index: 9998;
			transition: opacity 0.2s ease;
		`;

		document.body.appendChild(flash);

		// Показываем вспышку
		requestAnimationFrame(() => {
			flash.style.opacity = "0.1";
		});

		// Убираем вспышку
		setTimeout(() => {
			flash.style.opacity = "0";
			setTimeout(() => {
				document.body.removeChild(flash);
			}, 200);
		}, 100);
	}

	// Переключаем между light и dark
	const themes = ["light", "dark"];
	const currentPreference = colorMode.preference || "system";
	const currentIndex = themes.indexOf(currentPreference);
	const nextIndex = (currentIndex + 1) % themes.length;
	colorMode.preference = themes[nextIndex];
};
</script>

<style scoped>
.theme-button svg {
	width: 1.25rem;
	height: 1.25rem;
}

.theme-button:hover {
	background: var(--bg-tertiary);
}

.theme-icon {
	width: 20px;
	height: 20px;
	transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	transform-origin: center;
}

button:hover .theme-icon {
	transform: rotate(180deg) scale(1.1);
}

button:active .theme-icon {
	transform: rotate(180deg) scale(0.95);
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.theme-icon,
	.theme-button {
		transition: none;
	}

	.theme-button:hover .theme-icon,
	.theme-button:active .theme-icon {
		transform: none;
	}
}
</style>
