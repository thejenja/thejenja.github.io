// content.config.js
import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
	collections: {
		projects: defineCollection({
			type: "page",
			source: "projects/**/*.md",
		}),
		projectsEn: defineCollection({
			type: "page",
			source: "projects/en/**/*.md",
			// Добавляем метаданные для английской локали
			transform: (content) => {
				return {
					...content,
					_locale: "en",
				};
			},
		}),
		projectsRu: defineCollection({
			type: "page",
			source: "projects/ru/**/*.md",
			// Добавляем метаданные для русской локали
			transform: (content) => {
				return {
					...content,
					_locale: "ru",
				};
			},
		}),
	},
});
