import type {
	ProjectMeta,
	ProjectContent,
	ProjectLink,
	ProjectType,
	ProjectStage,
} from "~/types";

// Реэкспорт типов для обратной совместимости
export type {
	ProjectMeta,
	ProjectContent,
	ProjectLink,
	ProjectType,
	ProjectStage,
};

// queryCollection доступен глобально на сервере в Nuxt Content 3
declare const queryCollection: (name: string) => {
	all: () => Promise<unknown[]>;
};

// Fallback данные для проектов (если queryCollection недоступен)
const fallbackProjects: ProjectContent[] = [
	{
		title: "Portfolio",
		description:
			"This site is a portfolio created using Nuxt 4 and modern technologies",
		date: "2026-01-01",
		meta: {
			slug: "portfolio",
			type: "website" as const,
			stage: "completed" as const,
			featured: true,
			technologies: ["Nuxt", "Vue", "GSAP"],
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
		type: string = "all",
	) => {
		return `${collectionName}-${locale}-${type}`;
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

	// Общая функция для загрузки проектов с обработкой ошибок
	const fetchProjects = async (
		locale: string,
	): Promise<ProjectContent[] | null> => {
		try {
			const projects = await queryCollection(
				locale === "en" ? "projectsEn" : "projectsRu",
			).all();
			return projects as ProjectContent[];
		} catch (collectionError) {
			console.warn(
				`Ошибка при загрузке коллекции для локали ${locale}:`,
				collectionError,
			);
			try {
				const projects = await queryCollection("projects").all();
				return projects as ProjectContent[];
			} catch (generalError) {
				console.warn(
					"Ошибка при загрузке общей коллекции проектов:",
					generalError,
				);
				return null;
			}
		}
	};

	// Загружаем проекты в зависимости от текущей локали
	const loadAllProjects = async (
		locale?: string,
	): Promise<ProjectContent[]> => {
		try {
			const currentLocale = locale || "en";
			const cacheKey = getCacheKey("projects", currentLocale, "all");

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				return projectsCache.value.get(cacheKey)!;
			}

			const result = await fetchProjects(currentLocale);
			const projects = result || fallbackProjects;

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, projects as ProjectContent[]);

			return projects as ProjectContent[];
		} catch (error) {
			console.error("Ошибка загрузки проектов:", error);
			return fallbackProjects as ProjectContent[];
		}
	};

	// Загружаем проект по slug
	const loadProjectBySlug = async (
		slug: string,
		locale?: string,
	): Promise<ProjectContent | null> => {
		try {
			const currentLocale = locale || "ru";
			const cacheKey = getCacheKey("projects", currentLocale, `slug-${slug}`);

			// Проверяем кэш
			if (projectsCache.value.has(cacheKey)) {
				const cached = projectsCache.value.get(cacheKey) as ProjectContent[];
				return (cached && cached.length > 0 ? cached[0] : null) || null;
			}

			const projects = (await fetchProjects(currentLocale)) || [];

			const result =
				projects.find((project) => project.meta?.slug === slug) || null;

			// Сохраняем в кэш
			projectsCache.value.set(cacheKey, result ? [result] : []);

			return result;
		} catch (error) {
			console.error("Ошибка загрузки проекта:", error);
			return null;
		}
	};

	return {
		loadAllProjects,
		loadProjectBySlug,
		refreshProjects,
	};
};
