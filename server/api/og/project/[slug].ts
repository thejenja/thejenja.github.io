import { defineEventHandler, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "slug");

	// Импортируем queryContent для получения данных из content
	const { queryContent } = await import("#content/server");

	try {
		// Пытаемся получить проект на английском языке
		const enProjects = await queryContent("projects/en").find();
		const enProject = enProjects.find((p: any) =>
			p._path?.endsWith(`/${slug}`)
		);

		if (enProject) {
			return {
				title: enProject.title || `${slug} - Project`,
				description: enProject.description || "Project details page",
				type: enProject.meta?.type || "web-app",
				stage: enProject.meta?.stage || "completed",
				technologies: enProject.meta?.technologies || ["nuxt", "vue"],
				backgroundColor: enProject.meta?.color || "#4b5563",
				icon: enProject.meta?.icon || "💻",
				projectSlug: slug,
			};
		}

		// Пробуем получить проект на русском языке
		const ruProjects = await queryContent("projects/ru").find();
		const ruProject = ruProjects.find((p: any) =>
			p._path?.endsWith(`/${slug}`)
		);

		if (ruProject) {
			return {
				title: ruProject.title || `${slug} - Проект`,
				description: ruProject.description || "Страница проекта",
				type: ruProject.meta?.type || "web-app",
				stage: ruProject.meta?.stage || "completed",
				technologies: ruProject.meta?.technologies || ["nuxt", "vue"],
				backgroundColor: ruProject.meta?.color || "#4b5563",
				icon: ruProject.meta?.icon || "💻",
				projectSlug: slug,
			};
		}

		// Если проект не найден, возвращаем заглушку
		return {
			title: `${slug} - Project`,
			description: "Project details page",
			type: "web-app",
			stage: "completed",
			technologies: ["nuxt", "vue"],
			backgroundColor: "#4b5563",
			icon: "💻",
			projectSlug: slug,
		};
	} catch (error) {
		// В случае ошибки возвращаем заглушку
		console.error(`Error loading project ${slug}:`, error);
		return {
			title: `${slug} - Project`,
			description: "Project details page",
			type: "web-app",
			stage: "completed",
			technologies: ["nuxt", "vue"],
			backgroundColor: "#4b5563",
			icon: "💻",
			projectSlug: slug,
		};
	}
});
