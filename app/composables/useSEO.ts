export const useSEO = () => {
	const { locale, t } = useI18n();
	const colorMode = useColorMode();
	const route = useRoute();

	// Получаем базовый URL сайта из Site Config (падает в fallback при отсутствии)
	let siteUrl = "https://thejenja.github.io";
	try {
		// @ts-ignore - доступно при установленных SEO модулях
		const cfg = typeof useSiteConfig === "function" ? useSiteConfig() : null;
		if (cfg?.url) siteUrl = cfg.url as string;
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
		const themeColor = isDark ? "#1a1a1a" : "#ffffff";
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
	};
};
