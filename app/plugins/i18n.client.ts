export default defineNuxtPlugin(() => {
	if (process.client) {
		// Функция для определения языка браузера
		const getBrowserLanguage = () => {
			// Получаем язык браузера
			const browserLang = navigator.language.split("-")[0];

			// Проверяем доступные локали
			const availableLocales = ["en", "ru", "brainrot"];

			// Если язык браузера поддерживается, возвращаем его
			if (availableLocales.includes(browserLang)) {
				return browserLang;
			}

			// Если основной язык не поддерживается, проверяем fallback языки
			const fallbackLanguages = ["en", "ru", "brainrot"];
			for (const fallbackLang of fallbackLanguages) {
				if (availableLocales.includes(fallbackLang)) {
					return fallbackLang;
				}
			}

			// Возвращаем английский как последний вариант
			return "en";
		};

		// Проверяем, есть ли уже установленный язык
		const savedLocale = localStorage.getItem("i18n_locale");

		if (!savedLocale) {
			// Если язык не установлен, определяем его из браузера
			const browserLang = getBrowserLanguage();
			localStorage.setItem("i18n_locale", browserLang);

			// Устанавливаем cookie для i18n модуля
			document.cookie = `i18n_redirected=${browserLang}; path=/; max-age=31536000`;
		} else {
			// Если язык уже установлен, проверяем его валидность
			const availableLocales = ["en", "ru", "brainrot"];
			if (!availableLocales.includes(savedLocale)) {
				// Если сохраненный язык не валиден, устанавливаем язык браузера
				const browserLang = getBrowserLanguage();
				localStorage.setItem("i18n_locale", browserLang);
				document.cookie = `i18n_redirected=${browserLang}; path=/; max-age=31536000`;
			} else {
				// Устанавливаем cookie для i18n модуля
				document.cookie = `i18n_redirected=${savedLocale}; path=/; max-age=31536000`;
			}
		}
	}
});
