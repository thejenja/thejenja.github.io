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
		"~/modules/prerender-projects",
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

	hooks: {
		"nitro:config": (config) => {
			if (!config.prerender) {
				config.prerender = { routes: [] };
			}

			const routes = new Set(config.prerender.routes);

			// Добавляем основные маршруты
			routes.add("/");
			routes.add("/projects");

			// Добавляем часто используемые иконки для прегенерации
			routes.add("/icons/Figma-logo.svg");
			routes.add("/icons/gemini.svg");
			routes.add("/icons/lucide.svg");
			routes.add("/icons/openai.svg");
			routes.add("/icons/telegram-logo.svg");
			routes.add("/icons/linkedin.svg");
			routes.add("/icons/boosty.svg");
			routes.add("/icons/da.svg");
			routes.add("/icons/dprofile-logo.svg");
			routes.add("/icons/dsgners-logo.svg");
			routes.add("/icons/liberapay.svg");
			routes.add("/icons/tenchat.svg");
			routes.add("/icons/ton.svg");
			routes.add("/icons/userstyles-logo.svg");
			routes.add("/icons/yoomoney.svg");
			
			// Добавляем IPX версии иконок, которые могут использоваться в ProjectCard
			routes.add("/_ipx/q_80&s_400x300/icons/Figma-logo.svg");
			routes.add("/_ipx/q_80&s_400x300/icons/gemini.svg");
			routes.add("/_ipx/q_80&s_400x300/icons/lucide.svg");
			routes.add("/_ipx/q_80&s_400x300/icons/openai.svg");
			routes.add("/_ipx/q_80&s_384x230/icons/Figma-logo.svg");
			routes.add("/_ipx/q_80&s_384x230/icons/gemini.svg");
			routes.add("/_ipx/q_80&s_384x230/icons/lucide.svg");
			routes.add("/_ipx/q_80&s_384x230/icons/openai.svg");
			routes.add("/_ipx/q_80&s_200x120/icons/Figma-logo.svg");
			routes.add("/_ipx/q_80&s_200x120/icons/gemini.svg");
			routes.add("/_ipx/q_80&s_200x120/icons/lucide.svg");
			routes.add("/_ipx/q_80&s_200x120/icons/openai.svg");
			// Добавляем размеры, которые появляются в ошибках
			routes.add("/_ipx/q_80&s_40x40/icons/Figma-logo.svg");
			routes.add("/_ipx/q_80&s_40x40/icons/gemini.svg");
			routes.add("/_ipx/q_80&s_40x40/icons/lucide.svg");
			routes.add("/_ipx/q_80&s_40x40/icons/openai.svg");
			// Добавляем размеры для фоновых изображений
			routes.add("/_ipx/q_80&s_768x576/projects/blast/background-en.webp");
			routes.add("/_ipx/q_80&s_768x576/projects/marlowmc/background.webp");
			routes.add("/_ipx/q_80&s_768x576/projects/aura/background.webp");
			routes.add("/_ipx/q_80&s_768x576/projects/canvloop/background.webp");
			routes.add("/_ipx/q_80&s_768x576/projects/rinpyu/background.webp");
			routes.add("/_ipx/q_80&s_768x576/projects/maddlink/background.webp");
			routes.add("/_ipx/q_80&s_768x576/projects/matreshna/background.webp");
			// Добавляем размеры для логотипов проектов
			routes.add("/_ipx/q_80&s_384x230/projects/kotle/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/ont-lekt/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/ont-prof/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/md3-theme/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/vkui-theme/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/fluent-ovk/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/mibinopener/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/toastgen/logo.svg");
			routes.add("/_ipx/q_80&s_384x230/projects/ovktweaks/logo.svg");

			config.prerender.routes = Array.from(routes);
		},
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
