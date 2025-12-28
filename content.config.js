// content.config.js
import { defineContentConfig, defineCollection } from "@nuxt/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

export default defineContentConfig({
	collections: {
		projects: defineCollection(
			asSitemapCollection({
				type: "page",
				source: "projects/**/*.md",
			})
		),
		projectsEn: defineCollection(
			asSitemapCollection({
				type: "page",
				source: "projects/en/**/*.md",
				// Добавляем метаданные для английской локали
				transform: (content) => {
					return {
						...content,
						_locale: "en",
					};
				},
			})
		),
		projectsRu: defineCollection(
			asSitemapCollection({
				type: "page",
				source: "projects/ru/**/*.md",
				// Добавляем метаданные для русской локали
				transform: (content) => {
					return {
						...content,
						_locale: "ru",
					};
				},
			})
		),
	},
});
