// content.config.js
import { defineContentConfig, defineCollection } from "@nuxt/content";
import { defineSitemapSchema } from "@nuxtjs/sitemap/content";
import { z } from "zod";

export default defineContentConfig({
	collections: {
		projects: defineCollection({
			type: "page",
			source: "projects/**/*.md",
			schema: z.object({
				sitemap: defineSitemapSchema({ z }),
			}),
		}),
		projectsEn: defineCollection({
			type: "page",
			source: "projects/en/**/*.md",
			schema: z.object({
				sitemap: defineSitemapSchema({ z, name: "projectsEn" }),
			}),
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
			schema: z.object({
				sitemap: defineSitemapSchema({ z, name: "projectsRu" }),
			}),
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
