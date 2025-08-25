<template>
		<button
			@click="toggleTheme"
			class="nav-link"
			:title="$t('theme.' + colorMode.preference)"
			aria-label="Toggle theme"
		>
			<svg
				v-if="currentTheme === 'dark'"
				class="theme-icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
			<svg
				v-else
				class="theme-icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
			<span class="theme-text">{{ $t("theme." + colorMode.preference) }}</span>
		</button>
</template>

<script setup>
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
