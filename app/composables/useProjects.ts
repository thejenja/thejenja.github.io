// Fallback данные для проектов (если queryCollection недоступен)
const fallbackProjects = [
	{
		title: "Portfolio",
		description:
			"This site is a portfolio created using Nuxt 4 and modern technologies",
		date: "2024-01-01",
		meta: {
			slug: "portfolio",
			type: "website" as const,
			stage: "completed" as const,
			featured: true,
			technologies: ["Nuxt 4", "Vue 3", "GSAP", "Tailwind CSS"],
			tags: [
				{ name: "Nuxt 4", color: "emerald", icon: "vue" },
				{ name: "Vue 3", color: "emerald", icon: "vue" },
				{ name: "GSAP", color: "purple", icon: "library" },
				{ name: "Tailwind CSS", color: "cyan", icon: "css" },
			],
			github: "https://github.com/thejenja/portfolio",
			demo: null,
		},
		_path: "/projects/portfolio",
	},
];

export const useProjects = () => {
	// Создаем реактивные ссылки для кэширования
	const projectsCache = ref(new Map<string, any>());

	// Функция для получения уникального ключа кэша
	const getCacheKey = (
		collectionName: string,
		locale: string,
		type: string = "all"
	) => {
		return `${collectionName}-${locale}-${type}`;
	};

	// Функция для очистки кэша
	const clearCache = () => {
		projectsCache.value.clear();
	};

	// Функция для принудительного обновления
	const refreshProjects = async (locale?: string) => {
		const currentLocale = locale || "ru";
		const enKey = getCacheKey("projectsEn", currentLocale);
		const ruKey = getCacheKey("projectsRu", currentLocale);

		projectsCache.value.delete(enKey);
		projectsCache.value.delete(ruKey);

		// Очищаем кэш Nuxt
		await clearNuxtData();
	};

	// Загружаем проекты в зависимости от текущей локали
	const loadAllProjects = async (locale?: string) => {
		try {
			// Проверяем, доступен ли queryCollection
			if (typeof queryCollection === "undefined") {
				console.warn("queryCollection не доступен, возвращаем fallback данные");
				return fallbackProjects;
			}

			const currentLocale = locale || "en";
			const collectionName =
				currentLocale === "en" ? "projectsEn" : "projectsRu";
			const cacheKey = getCacheKey(collectionName, currentLocale, "all");

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				return projectsCache.value.get(cacheKey);
			}

			const result = await queryCollection(collectionName).all();
			const projects = result || fallbackProjects;

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, projects);

			return projects;
		} catch (error) {
			console.error("Ошибка загрузки проектов:", error);
			return fallbackProjects;
		}
	};

	// Загружаем только избранные проекты
	const loadFeaturedProjects = async (locale?: string) => {
		try {
			// Проверяем, доступен ли queryCollection
			if (typeof queryCollection === "undefined") {
				console.warn("queryCollection не доступен, возвращаем fallback данные");
				return fallbackProjects.filter(
					(project) => project.meta?.featured === true
				);
			}

			const currentLocale = locale || "ru";
			const collectionName =
				currentLocale === "en" ? "projectsEn" : "projectsRu";
			const cacheKey = getCacheKey(collectionName, currentLocale, "featured");

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				return projectsCache.value.get(cacheKey);
			}

			const projects = await queryCollection(collectionName).all();
			const result = projects.filter(
				(project) => project.meta?.featured === true
			);

			const finalResult =
				result.length > 0
					? result
					: fallbackProjects.filter(
							(project) => project.meta?.featured === true
						);

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, finalResult);

			return finalResult;
		} catch (error) {
			console.error("Ошибка загрузки избранных проектов:", error);
			return fallbackProjects.filter(
				(project) => project.meta?.featured === true
			);
		}
	};

	// Загружаем проект по slug
	const loadProjectBySlug = async (slug: string, locale?: string) => {
		try {
			if (typeof queryCollection === "undefined") {
				console.warn("queryCollection не доступен, возвращаем null");
				return null;
			}

			const currentLocale = locale || "ru";
			const collectionName =
				currentLocale === "en" ? "projectsEn" : "projectsRu";
			const cacheKey = getCacheKey(
				collectionName,
				currentLocale,
				`slug-${slug}`
			);

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				return projectsCache.value.get(cacheKey);
			}

			const result = await queryCollection(collectionName)
				.where({ slug })
				.findOne();

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, result);

			return result || null;
		} catch (error) {
			console.error("Ошибка загрузки проекта:", error);
			return null;
		}
	};

	return {
		loadAllProjects,
		loadFeaturedProjects,
		loadProjectBySlug,
		refreshProjects,
		clearCache,
	};
};
