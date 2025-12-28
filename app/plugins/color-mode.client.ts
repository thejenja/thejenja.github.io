export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		// Функция для определения системной темы
		const getSystemTheme = () => {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		};

		// Функция для применения темы
		const applyTheme = (theme: string) => {
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};

		// Получаем сохраненную тему из localStorage
		const savedTheme = localStorage.getItem("nuxt-color-mode");

		// Применяем тему при загрузке
		if (savedTheme === "system") {
			const systemTheme = getSystemTheme();
			applyTheme(systemTheme);
		} else if (savedTheme) {
			applyTheme(savedTheme);
		} else {
			// Если тема не установлена, применяем системную
			const systemTheme = getSystemTheme();
			applyTheme(systemTheme);
		}

		// Слушаем изменения системной темы
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQuery.addEventListener("change", (e) => {
			const savedTheme = localStorage.getItem("nuxt-color-mode");
			if (savedTheme === "system") {
				const newSystemTheme = e.matches ? "dark" : "light";
				applyTheme(newSystemTheme);
			}
		});

		// Слушаем изменения в localStorage для темы
		window.addEventListener("storage", (e) => {
			if (e.key === "nuxt-color-mode") {
				const newTheme = e.newValue;
				if (newTheme === "system") {
					const systemTheme = getSystemTheme();
					applyTheme(systemTheme);
				} else if (newTheme) {
					applyTheme(newTheme);
				}
			}
		});
	}
});
