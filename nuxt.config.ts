// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },

	modules: [
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxt/image",
		"@nuxtjs/color-mode",
		"@nuxtjs/i18n",
		"@nuxtjs/sitemap",
		"@nuxtjs/robots",
		"nuxt-og-image",
	],

	fonts: {
		families: [
			{
				name: 'Onest',
				local: '~/assets/fonts/Onest[wght].woff2',
			},
		],
		sources: {
			// Отключаем все внешние источники шрифтов
			google: { enabled: false },
			fontshare: { enabled: false },
			iconify: { enabled: false },
		},
	},

css: ["~/styles.css"],

	colorMode: {
		preference: "system",
		fallback: "dark",
		storage: "localStorage",
		classPrefix: "",
		classSuffix: "",
	},

	i18n: {
		locales: [
			{
				code: "en",
				iso: "en-US",
				language: "en-US",
				name: "English",
				file: "en.json",
			},
			{
				code: "ru",
				iso: "ru-RU",
				language: "ru-RU",
				name: "Русский",
				file: "ru.json",
			},
			{
				code: "brainrot",
				iso: "en-BR",
				language: "en",
				name: "Brainrot",
				file: "brainrot.json",
			},
		],
		defaultLocale: "en",
		strategy: "prefix_and_default",
		baseUrl: "https://thejenja.github.io",
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: "i18n_redirected",
			redirectOn: "root",
		},
	},

	// Конфигурация nuxt-og-image
	ogImage: {
		// Указываем путь к шаблонам OG-изображений
		componentDirs: ["./OgImage"],
		// Настройки размеров OG-изображений
		defaults: {
			width: 1200,
			height: 630,
		},
	},

	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
		},
	},

	// Производительность
	nitro: {
		compressPublicAssets: true,
	},

	experimental: {
		payloadExtraction: true,
	},

	site: {
		url: "https://thejenja.github.io",
	},

	sitemap: {
		urls: ["https://thejenja.github.io"],
	},

	robots: {
		blockNonSeoBots: true,
	},
});
