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
		"nuxt-vitalizer",
	],

	fonts: {
		provider: "local",
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

	// Конфигурация Nuxt Image
	image: {
		// Установка ленивой загрузки по умолчанию
		provider: "ipx",
		quality: 80,
		format: ["webp", "avif", "jpeg", "png"],
		screens: {
			xs: 320,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			xxl: 1536,
			xxxl: 1920,
		},
		// Оптимизация для ленивой загрузки
		densities: [1, 2],
		// Параметры ленивой загрузки по умолчанию
		providerOptions: {
			ipx: {
				// Параметры для IPX провайдера
			},
		},
	},
});
