// Система иконок для тегов
export interface TagIcon {
	slug: string;
	name: string;
	icon: string; // 'simple-icons:icon-name'
	color: string; // CSS цвет для тега
}

// Предустановленные иконки только для используемых технологий
export const defaultTagIcons: TagIcon[] = [
	// Frontend Frameworks
	{
		slug: "vue",
		name: "Vue.js",
		icon: "simple-icons:VueDotjs",
		color: "#41b883",
	},
	{
		slug: "react",
		name: "React",
		icon: "simple-icons:CreateReactApp",
		color: "#61DAFB",
	},
	{
		slug: "nuxt",
		name: "Nuxt.js",
		icon: "simple-icons:Nuxt",
		color: "#00dc82",
	},
	{
		slug: "next",
		name: "Next.js",
		icon: "simple-icons:ErpNext",
		color: "#000000",
	}, // fallback

	// Языки программирования
	{
		slug: "typescript",
		name: "TypeScript",
		icon: "simple-icons:TypeScript",
		color: "#3178C6",
	},
	{
		slug: "javascript",
		name: "JavaScript",
		icon: "simple-icons:JavaScript",
		color: "#F7DF1E",
	},
	{
		slug: "php",
		name: "PHP",
		icon: "simple-icons:JavaScript",
		color: "#777BB4",
	}, // fallback

	// Стили и CSS
	{ slug: "css", name: "CSS", icon: "simple-icons:Html5", color: "#1572B6" }, // fallback
	{ slug: "scss", name: "SCSS", icon: "simple-icons:Sass", color: "#CC6699" },
	{ slug: "sass", name: "Sass", icon: "simple-icons:Sass", color: "#CC6699" },
	{
		slug: "tailwind",
		name: "Tailwind CSS",
		icon: "simple-icons:TailwindCss",
		color: "#06B6D4",
	},

	// Backend и базы данных
	{
		slug: "laravel",
		name: "Laravel",
		icon: "simple-icons:Laravel",
		color: "#FF2D20",
	},
	{
		slug: "nodejs",
		name: "Node.js",
		icon: "simple-icons:Hashnode",
		color: "#339933",
	}, // fallback
	{
		slug: "mysql",
		name: "MySQL",
		icon: "simple-icons:MySql",
		color: "#4479A1",
	},
	{
		slug: "postgresql",
		name: "PostgreSQL",
		icon: "simple-icons:PostgreSql",
		color: "#336791",
	},
	{
		slug: "mongodb",
		name: "MongoDB",
		icon: "simple-icons:MongoDb",
		color: "#47A248",
	},
	{
		slug: "redis",
		name: "Redis",
		icon: "simple-icons:Redis",
		color: "#DC382D",
	},

	// Инструменты разработки
	{ slug: "vite", name: "Vite", icon: "simple-icons:Vite", color: "#646CFF" },
	{
		slug: "webpack",
		name: "Webpack",
		icon: "simple-icons:Webpack",
		color: "#8DD6F9",
	},
	{
		slug: "git",
		name: "Git",
		icon: "simple-icons:JavaScript",
		color: "#F05032",
	}, // fallback
	{
		slug: "docker",
		name: "Docker",
		icon: "simple-icons:Docker",
		color: "#2496ED",
	},
	{
		slug: "eslint",
		name: "ESLint",
		icon: "simple-icons:EsLint",
		color: "#4B32C3",
	},
	{
		slug: "prettier",
		name: "Prettier",
		icon: "simple-icons:Prettier",
		color: "#F7B93E",
	},

	// Специализированные библиотеки
	{
		slug: "gsap",
		name: "GSAP",
		icon: "simple-icons:GreenSock",
		color: "#88CE02",
	},
	{
		slug: "inertia",
		name: "Inertia.js",
		icon: "simple-icons:Inertia",
		color: "#9553E9",
	},
	{
		slug: "pinia",
		name: "Pinia",
		icon: "simple-icons:JavaScript",
		color: "#FFD02F",
	}, // fallback
	{
		slug: "vue-router",
		name: "Vue Router",
		icon: "simple-icons:VueDotjs",
		color: "#41b883",
	},
	{
		slug: "vue-i18n",
		name: "Vue I18n",
		icon: "simple-icons:VueDotjs",
		color: "#41b883",
	},
	{
		slug: "fabric",
		name: "Fabric.js",
		icon: "simple-icons:JavaScript",
		color: "#F7DF1E",
	},

	// Платформы и хостинг
	{
		slug: "telegram",
		name: "Telegram",
		icon: "simple-icons:Telegram",
		color: "#26A5E4",
	},
	{
		slug: "supabase",
		name: "Supabase",
		icon: "simple-icons:Supabase",
		color: "#3ECF8E",
	},
	{
		slug: "vercel",
		name: "Vercel",
		icon: "simple-icons:Vercel",
		color: "#000000",
	},
	{
		slug: "netlify",
		name: "Netlify",
		icon: "simple-icons:Netlify",
		color: "#00C7B7",
	},

	// Технологии браузера
	{
		slug: "webgl",
		name: "WebGL",
		icon: "simple-icons:WebGl",
		color: "#990000",
	},
	{
		slug: "webworkers",
		name: "Web Workers",
		icon: "simple-icons:JavaScript",
		color: "#F7DF1E",
	},
	{
		slug: "canvas",
		name: "Canvas API",
		icon: "simple-icons:Html5",
		color: "#E34F26",
	},
	{ slug: "pwa", name: "PWA", icon: "simple-icons:Pwa", color: "#5A0FC8" },
	{
		slug: "chrome-extension",
		name: "Chrome Extension",
		icon: "simple-icons:ChromeWebStore",
		color: "#4285F4",
	},
	{
		slug: "wxt",
		name: "WXT",
		icon: "simple-icons:ChromeWebStore",
		color: "#4285F4",
	},

	// Дизайн
	{
		slug: "figma",
		name: "Figma",
		icon: "/icons/Figma-logo.svg",
		color: "#0e0e0e",
	},

	// Fallback для неизвестных тегов
	{
		slug: "unknown",
		name: "Unknown",
		icon: "lucide:question-mark",
		color: "#6B7280",
	},
	{
		slug: "simple-icons",
		name: "Simple Icons",
		icon: "simple-icons:SimpleIcons",
		color: "#0e0e0e",
	},
	{
		slug: "lucide-icons",
		name: "Lucide Icons",
		icon: "/icons/lucide.svg",
		color: "#F56565",
	},
	{
		slug: "sora",
		name: "Sora",
		icon: "/icons/openai.svg",
		color: "#0e0e0e",
	},
	{
		slug: "chatgpt",
		name: "ChatGPT",
		icon: "/icons/openai.svg",
		color: "#0e0e0e",
	},
	{
		slug: "gemini",
		name: "Gemini",
		icon: "/icons/gemini.svg",
		color: "#fff",
	},
];

export function useTagIcons() {
	// Получить тег по slug
	const getTag = (slug: string): TagIcon | null => {
		const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
		return (
			defaultTagIcons.find(
				(tag) => tag.slug === normalizedSlug || tag.slug === slug.toLowerCase()
			) || null
		);
	};

	// Получить fallback тег
	const getFallbackTag = (slug: string): TagIcon => {
		const tag = getTag(slug);
		return (
			tag || {
				slug: slug.toLowerCase(),
				name: slug,
				icon: "simple-icons:JavaScript", // Используем существующую иконку
				color: "#6b7280",
			}
		);
	};

	// Добавить новый тег
	const addTag = (tag: TagIcon) => {
		const existingIndex = defaultTagIcons.findIndex((t) => t.slug === tag.slug);
		if (existingIndex >= 0) {
			defaultTagIcons[existingIndex] = tag;
		} else {
			defaultTagIcons.push(tag);
		}
	};

	// Получить все доступные теги
	const getAllTags = () => [...defaultTagIcons];

	// Получить теги по массиву slug'ов
	const getTagsBySlugs = (slugs: string[]): TagIcon[] => {
		return slugs.map((slug) => getFallbackTag(slug));
	};

	return {
		getTag,
		getFallbackTag,
		addTag,
		getAllTags,
		getTagsBySlugs,
	};
}
