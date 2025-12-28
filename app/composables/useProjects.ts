// Типы данных для проектов
export interface ProjectMeta {
	slug?: string;
	color?: string;
	background?: string;
	backgroundImage?: string;
	technologies?: string[];
	tags?: Array<{
		name: string;
		color: string;
		icon?: string;
	}>;
	type?:
		| "web-app"
		| "mobile-app"
		| "website"
		| "library"
		| "tool"
		| "game"
		| "design";
	stage?: "planning" | "in-progress" | "completed" | "on-hold" | "archived";
	featured?: boolean;
	github?: string;
	demo?: string;
	date?: string;
	icon?: string;
	behance?: string;
	dribbble?: string;
	linksTop?: ProjectLink[];
	linksBottom?: ProjectLink[];
	gallery?: Array<string | GalleryItem>;
}

// Типы для ссылок и галереи
export interface ProjectLink {
	label: string;
	href: string;
	icon: string;
}

export interface GalleryItem {
	src: string;
	alt?: string;
}

export interface ProjectContent {
	title?: string;
	description?: string;
	body?: unknown;
	meta?: ProjectMeta;
	date?: string;
	_path?: string;
}

// Fallback данные для проектов (если queryCollection недоступен)
const fallbackProjects: ProjectContent[] = [
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
			demo: undefined,
		},
		_path: "/projects/portfolio",
	},
];

export const useProjects = () => {
	// Создаем реактивные ссылки для кэширования
	const projectsCache = ref(new Map<string, ProjectContent[]>());

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
	const loadAllProjects = async (
		locale?: string
	): Promise<ProjectContent[]> => {
		try {
			// Проверяем, доступен ли queryCollection
			if (typeof queryCollection === "undefined") {
				// console.warn("queryCollection не доступен, возвращаем fallback данные");
				return fallbackProjects as ProjectContent[];
			}

			const currentLocale = locale || "en";
			const cacheKey = getCacheKey("projects", currentLocale, "all");

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				return projectsCache.value.get(cacheKey)!;
			}

			const result = await queryCollection(
				currentLocale === "en" ? "projectsEn" : "projectsRu"
			).all();
			const projects = result || fallbackProjects;

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, projects as ProjectContent[]);

			return projects as ProjectContent[];
		} catch {
			// console.error("Ошибка загрузки проектов:", error);
			return fallbackProjects as ProjectContent[];
		}
	};

	// Загружаем только избранные проекты
	const loadFeaturedProjects = async (
		locale?: string
	): Promise<ProjectContent[]> => {
		try {
			// Проверяем, доступен ли queryCollection
			if (typeof queryCollection === "undefined") {
				// console.warn("queryCollection не доступен, возвращаем fallback данные");
				return fallbackProjects.filter(
					(project) => project.meta?.featured === true
				) as ProjectContent[];
			}

			const currentLocale = locale || "ru";
			const cacheKey = getCacheKey("projects", currentLocale, "featured");

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				return projectsCache.value.get(cacheKey)!;
			}

			const projects = await queryCollection(
				currentLocale === "en" ? "projectsEn" : "projectsRu"
			).all();
			const result = (projects as ProjectContent[]).filter(
				(project) => project.meta?.featured === true
			);

			const finalResult =
				result.length > 0
					? result
					: (fallbackProjects.filter(
							(project) => project.meta?.featured === true
						) as ProjectContent[]);

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, finalResult);

			return finalResult;
		} catch {
			// console.error("Ошибка загрузки избранных проектов:", error);
			return fallbackProjects.filter(
				(project) => project.meta?.featured === true
			) as ProjectContent[];
		}
	};

	// Загружаем проект по slug
	const loadProjectBySlug = async (
		slug: string,
		locale?: string
	): Promise<ProjectContent | null> => {
		try {
			if (typeof queryCollection === "undefined") {
				// console.warn("queryCollection не доступен, возвращаем null");
				return null;
			}

			const currentLocale = locale || "ru";
			const cacheKey = getCacheKey("projects", currentLocale, `slug-${slug}`);

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				return (projectsCache.value.get(cacheKey) as ProjectContent) || null;
			}
			const projects = await queryCollection(
				currentLocale === "en" ? "projectsEn" : "projectsRu"
			).all();
			const result = (projects as ProjectContent[]).find(
				(project) => project.meta?.slug === slug
			);

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, [result] as ProjectContent[]);

			return result || null;
		} catch {
			// console.error("Ошибка загрузки проекта:", error);
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
