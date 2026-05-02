// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },

	modules: [
		"@nuxtjs/seo",
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxtjs/color-mode",
		"@nuxtjs/i18n",
		"nuxt-vitalizer",
		"nuxt-yandex-metrika",
		"@nuxt/icon",
		"nuxt-gtag",
	],

	gtag: {
		id: "G-M7CK5DXGR9",
		enabled: process.env.NODE_ENV === "production",
	},

	yandexMetrika: {
		id: "103699281",
		verification: "6fb57a93002b4804",
		options: {
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true,
			webvisor: true,
		},
	},

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
		zeroRuntime: true,
		defaults: {
			width: 1200,
			height: 630,
		},
	},

	icon: {
		clientBundle: {
			scan: true,
		},
	},

	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			link: [
				{ rel: "icon", type: "image/svg+xml", href: "/favicon-light.svg" },
				{ rel: "icon", type: "image/x-icon", href: "/favicon-light.ico" },
				{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-light.png" },
				{ rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32-light.png" },
				{ rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16-light.png" },
				{ rel: "manifest", href: "/site.webmanifest" },
			],
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
		name: "thejenja",
		url: "https://thejenja.github.io",
		description: "Frontend dev & designer. Crafting modern web apps with focus on UX/UI and performance.",
		defaultLocale: "en",
		indexable: true,
	},

	seo: {
		meta: {
			twitterCard: "summary_large_image",
			ogType: "website",
			ogSiteName: "thejenja",
		},
	},

	schemaOrg: {
		identity: {
			type: "Person",
			name: "Eugene (thejenja)",
			url: "https://thejenja.github.io",
			sameAs: [
				"https://github.com/thejenja",
				"https://www.linkedin.com/in/thejenja/",
				"https://x.com/thejenja",
			],
		},
		defaults: true,
		minify: true,
	},

	sitemap: {
		// i18n автоматически добавит hreflang
	},

	robots: {
		blockNonSeoBots: true,
	},
	vite: {
		optimizeDeps: {
			include: [
				"@vue/devtools-core",
				"@vue/devtools-kit",
				"gsap",
				"gsap/Draggable",
				"gsap/ScrollTrigger",
				"gsap/ScrollToPlugin",
				"@vueuse/core",
			],
		},
	},
});
