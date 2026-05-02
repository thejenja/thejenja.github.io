export const useSEO = () => {
	const { locale, t } = useI18n();
	const colorMode = useColorMode();
	const route = useRoute();

	// Получаем базовый URL сайта из Site Config (падает в fallback при отсутствии)
	let siteUrl = "https://thejenja.github.io";
	try {
		const cfg = typeof useSiteConfig === "function" ? useSiteConfig() : null;
		if (cfg?.url) siteUrl = cfg.url as string;
		// eslint-disable-next-line no-empty
	} catch {}

	const getAbsoluteUrl = (path: string) => {
		try {
			return new URL(path, siteUrl).toString();
		} catch {
			return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
		}
	};

	const currentPath = computed(() => route.path);
	const currentUrl = computed(() => getAbsoluteUrl(currentPath.value));

	// Базовые SEO мета-теги
	const getBaseMeta = () => ({
		charset: "utf-8",
		viewport: "width=device-width, initial-scale=1",
		title: t("seo.title"),
		meta: [
			{
				name: "description",
				content: t("seo.description"),
			},
			{
				name: "keywords",
				content: t("seo.keywords"),
			},
			{
				name: "author",
				content: t("seo.author"),
			},
			{
				name: "robots",
				content: "index, follow",
			},
		],
	});

	// Функция для генерации title страницы
	const getPageTitle = (pageTitleKey?: string) => {
		if (pageTitleKey) {
			return `${t(pageTitleKey)} - ${t("seo.title")}`;
		}
		return t("seo.title");
	};

	// Функция для генерации description страницы
	const getPageDescription = (pageDescriptionKey?: string) => {
		if (pageDescriptionKey) {
			return t(pageDescriptionKey);
		}
		return t("seo.description");
	};

	// Open Graph мета-теги
	const getOpenGraphMeta = () => ({
		property: "og:type",
		content: "website",
	});

	const getOpenGraphTitle = () => ({
		property: "og:title",
		content: t("seo.ogTitle"),
	});

	const getOpenGraphDescription = () => ({
		property: "og:description",
		content: t("seo.ogDescription"),
	});

	const getOpenGraphSitename = () => ({
		property: "og:site_name",
		content: "thejenja",
	});

	const getOpenGraphUrl = () => ({
		property: "og:url",
		content: currentUrl.value,
	});

	// Twitter Card мета-теги
	const getTwitterCard = () => ({
		name: "twitter:card",
		content: "summary_large_image",
	});

	const getTwitterTitle = () => ({
		name: "twitter:title",
		content: t("seo.twitterTitle"),
	});

	const getTwitterDescription = () => ({
		name: "twitter:description",
		content: t("seo.twitterDescription"),
	});

	// Адаптивные favicon ссылки
	const getFaviconLinks = () => {
		const isDark = colorMode.value === "dark";
		const themeSuffix = isDark ? "-dark" : "-light";

		return [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: `/favicon${themeSuffix}.svg`,
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: `/favicon${themeSuffix}.ico`,
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: `/apple-touch-icon${themeSuffix}.png`,
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: `/favicon-32x32${themeSuffix}.png`,
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: `/favicon-16x16${themeSuffix}.png`,
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
			},
			// canonical генерируется i18n через useLocaleHead
		];
	};

	// Тема-зависимые мета-теги
	const getThemeMeta = () => {
		const isDark = colorMode.value === "dark";
		const themeColor = isDark ? "#1a1a1a" : "#fff";
		const msTileColor = isDark ? "#1a1a1a" : "#667eea";

		return [
			{
				name: "theme-color",
				content: themeColor,
			},
			{
				name: "msapplication-TileColor",
				content: msTileColor,
			},
		];
	};

	// Полные SEO мета-теги для страницы
	const getPageSEO = () => {
		const baseMeta = getBaseMeta();

		return {
			...baseMeta,
			meta: [
				...baseMeta.meta,
				getOpenGraphMeta(),
				getOpenGraphTitle(),
				getOpenGraphDescription(),
				getOpenGraphSitename(),
				getOpenGraphUrl(),
				getTwitterCard(),
				getTwitterTitle(),
				getTwitterDescription(),
				...getThemeMeta(),
			],
			link: getFaviconLinks(),
		};
	};

	// Обновление SEO при смене темы
	const updateThemeSEO = () => {
		const head = useHead(getPageSEO());
		return head;
	};

	// Обновление SEO при смене языка
	const updateLocaleSEO = () => {
		const head = useHead(getPageSEO());
		return head;
	};

	// JSON-LD Schema.org: Person (for portfolio owner)
	const getPersonSchema = () => ({
		"@context": "https://schema.org",
		"@type": "Person",
		name: "thejenja",
		alternateName: "Eugene",
		url: siteUrl,
		jobTitle: "Frontend Developer & Designer",
		sameAs: [
			"https://github.com/thejenja",
			"https://www.linkedin.com/in/thejenja/",
			"https://x.com/thejenja",
		],
	});

	// JSON-LD Schema.org: WebSite
	const getWebsiteSchema = () => ({
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: t("seo.title"),
		url: siteUrl,
		potentialAction: {
			"@type": "SearchAction",
			target: `${siteUrl}/projects?search={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	});

	// JSON-LD Schema.org: CreativeWork (for projects)
	const getProjectSchema = (project: {
		title: string;
		description: string;
		date?: string;
		image?: string;
		technologies?: string[];
		demo?: string;
		github?: string;
	}) => ({
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: project.title,
		description: project.description,
		dateCreated: project.date,
		image: project.image ? getAbsoluteUrl(project.image) : undefined,
		keywords: project.technologies?.join(", "),
		url: project.demo,
		codeRepository: project.github,
		author: {
			"@type": "Person",
			name: "thejenja",
		},
	});

	// JSON-LD Schema.org: WebPage
	const getWebPageSchema = (pageTitle?: string, pageDescription?: string) => ({
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: pageTitle || t("seo.title"),
		description: pageDescription || t("seo.description"),
		url: currentUrl.value,
		isPartOf: {
			"@type": "WebSite",
			name: t("seo.title"),
			url: siteUrl,
		},
	});

	// Get all schemas as script tags for head
	const getSchemaScripts = (
		pageType: "home" | "projects" | "project" | "about" | "uses" = "home",
		pageData?: Record<string, unknown>,
	) => {
		const schemas: Record<string, unknown>[] = [getPersonSchema(), getWebsiteSchema()];

		if (pageType === "home") {
			schemas.push(getWebPageSchema());
		} else if (pageType === "projects") {
			schemas.push(
				getWebPageSchema(
					t("projects.title"),
					t("projects.description"),
				),
			);
		} else if (pageType === "project" && pageData) {
			schemas.push(getProjectSchema(pageData as Parameters<typeof getProjectSchema>[0]));
		} else if (pageType === "about") {
			schemas.push(
				getWebPageSchema(t("about.title"), t("seo.description")),
			);
		} else if (pageType === "uses") {
			schemas.push(
				getWebPageSchema(t("uses.title"), t("uses.description")),
			);
		}

		return schemas.map((schema) => ({
			type: "application/ld+json",
			innerHTML: JSON.stringify(schema),
		}));
	};

	// Следим за изменениями темы и языка
	watch([colorMode, locale, () => route.fullPath], () => {
		updateThemeSEO();
		updateLocaleSEO();
	});

	return {
		getPageSEO,
		updateThemeSEO,
		updateLocaleSEO,
		getFaviconLinks,
		getThemeMeta,
		getPageTitle,
		getPageDescription,
	};
};
