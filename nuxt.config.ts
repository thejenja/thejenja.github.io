// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },

	modules: [
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxtjs/color-mode",
		"@nuxtjs/i18n",
		"@nuxtjs/sitemap",
		"@nuxtjs/robots",
		"nuxt-og-image",
		"nuxt-vitalizer",
	],

	vitalizer: {
		disablePrefetchLinks: true,
	},

	fonts: {
		families: [
			{
				name: "Onest",
				provider: "local",
				src: "/fonts/Onest-variable.woff2", // Путь относительно папки public (рекомендуется)
				weight: "100 900", // Для вариативного шрифта указываем диапазон
				style: "normal",
			},
		],
		// Оптимизация:
		defaults: {
			preload: true,
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
		pageTransition: { name: "page", mode: "out-in" },
	},

	// Производительность
	nitro: {
		compressPublicAssets: true,
		prerender: {
			crawlLinks: false,
			failOnError: false,
		},
	},

	experimental: {
	  payloadExtraction: true,
	  viewTransition: true,
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
