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
		icon: "simple-icons:vuedotjs",
		color: "#41b883",
	},
	{
		slug: "nuxt",
		name: "Nuxt.js",
		icon: "simple-icons:nuxt",
		color: "#00dc82",
	},
	{
		slug: "next",
		name: "Next.js",
		icon: "simple-icons:nextdotjs",
		color: "#000",
	},

	{
		slug: "html",
		name: "HTML",
		icon: "simple-icons:html5",
		color: "#E34F26",
	},
	// Языки программирования
	{
		slug: "typescript",
		name: "TypeScript",
		icon: "simple-icons:typescript",
		color: "#3178C6",
	},
	{
		slug: "javascript",
		name: "JavaScript",
		icon: "simple-icons:javascript",
		color: "#F7DF1E",
	},
	{
		slug: "php",
		name: "PHP",
		icon: "simple-icons:php",
		color: "#777BB4",
	},
	{
		slug: "photopea",
		name: "Photopea",
		icon: "simple-icons:photopea",
		color: "#18A497",
	},

	// Стили и CSS
	{ slug: "css", name: "CSS", icon: "simple-icons:css", color: "#663399" },
	{ slug: "scss", name: "SCSS", icon: "simple-icons:sass", color: "#CC6699" },
	{ slug: "sass", name: "Sass", icon: "simple-icons:sass", color: "#CC6699" },
	{
		slug: "jquery",
		name: "JQuery",
		icon: "simple-icons:jquery",
		color: "#0769AD",
	},

	// Backend и базы данных
	{
		slug: "laravel",
		name: "Laravel",
		icon: "simple-icons:laravel",
		color: "#FF2D20",
	},
	{
		slug: "nodejs",
		name: "Node.js",
		icon: "simple-icons:nodedotjs",
		color: "#339933",
	},
	{
		slug: "mysql",
		name: "MySQL",
		icon: "simple-icons:mysql",
		color: "#4479A1",
	},
	{
		slug: "postgresql",
		name: "PostgreSQL",
		icon: "simple-icons:postgresql",
		color: "#336791",
	},
	{
		slug: "mongodb",
		name: "MongoDB",
		icon: "simple-icons:mongodb",
		color: "#47A248",
	},
	{
		slug: "redis",
		name: "Redis",
		icon: "simple-icons:redis",
		color: "#DC382D",
	},

	// Инструменты разработки
	{ slug: "vite", name: "Vite", icon: "simple-icons:vite", color: "#646CFF" },
	{
		slug: "webpack",
		name: "Webpack",
		icon: "simple-icons:webpack",
		color: "#8DD6F9",
	},
	{
		slug: "git",
		name: "Git",
		icon: "simple-icons:git",
		color: "#F05032",
	},
	{
		slug: "docker",
		name: "Docker",
		icon: "simple-icons:docker",
		color: "#2496ED",
	},
	{
		slug: "eslint",
		name: "ESLint",
		icon: "simple-icons:eslint",
		color: "#4B32C3",
	},
	{
		slug: "prettier",
		name: "Prettier",
		icon: "simple-icons:prettier",
		color: "#F7B93E",
	},

	// Специализированные библиотеки
	{
		slug: "gsap",
		name: "GSAP",
		icon: "simple-icons:greensock",
		color: "#88CE02",
	},
	{
		slug: "inertia",
		name: "Inertia.js",
		icon: "simple-icons:inertia",
		color: "#9553E9",
	},
	{
		slug: "pinia",
		name: "Pinia",
		icon: "simple-icons:pinia",
		color: "#FFD859",
	},
	{
		slug: "vue-router",
		name: "Vue Router",
		icon: "simple-icons:vuedotjs",
		color: "#41b883",
	},
	{
		slug: "vue-i18n",
		name: "Vue I18n",
		icon: "simple-icons:vuedotjs",
		color: "#41b883",
	},
	{
		slug: "fabric",
		name: "Fabric.js",
		icon: "simple-icons:javascript",
		color: "#F7DF1E",
	},

	// Платформы и хостинг
	{
		slug: "telegram",
		name: "Telegram",
		icon: "simple-icons:telegram",
		color: "#26A5E4",
	},
	{
		slug: "supabase",
		name: "Supabase",
		icon: "simple-icons:supabase",
		color: "#3ECF8E",
	},
	{
		slug: "vercel",
		name: "Vercel",
		icon: "simple-icons:vercel",
		color: "#000",
	},
	{
		slug: "netlify",
		name: "Netlify",
		icon: "simple-icons:netlify",
		color: "#00C7B7",
	},
	{
		slug: "express",
		name: "Express",
		icon: "simple-icons:express",
		color: "#000",
	},
	{
		slug: "github",
		name: "GitHub",
		icon: "simple-icons:github",
		color: "#181717",
	},

	// Технологии браузера
	{
		slug: "webgl",
		name: "WebGL",
		icon: "simple-icons:webgl",
		color: "#990000",
	},
	{
		slug: "webworkers",
		name: "Web Workers",
		icon: "simple-icons:javascript",
		color: "#F7DF1E",
	},
	{
		slug: "canvas",
		name: "Canvas API",
		icon: "simple-icons:html5",
		color: "#E34F26",
	},
	{ slug: "pwa", name: "PWA", icon: "simple-icons:pwa", color: "#5A0FC8" },

	// Дизайн
	{
		slug: "figma",
		name: "Figma",
		icon: "logos:figma",
		color: "#0e0e0e",
	},
	{
		slug: "photoshop",
		name: "Adobe Photoshop",
		icon: "simple-icons:adobephotoshop",
		color: "#31A8FF",
	},
	{
		slug: "illustrator",
		name: "Adobe Illustrator",
		icon: "simple-icons:adobeillustrator",
		color: "#FF9A00",
	},
	{
		slug: "next",
		name: "Next.js",
		icon: "simple-icons:ErpNext",
		color: "#000",
	}, // fallback

	{
		slug: "html",
		name: "HTML",
		icon: "simple-icons:Html5",
		color: "#E34F26",
	},
	// Языки программирования
	{
		slug: "photopea",
		name: "Photopea",
		icon: "simple-icons:Photopea",
		color: "#18A497",
	},

	// Стили и CSS
	{ slug: "css", name: "CSS", icon: "simple-icons:Css", color: "#663399" }, // fallback
	{ slug: "scss", name: "SCSS", icon: "simple-icons:Sass", color: "#CC6699" },
	{ slug: "sass", name: "Sass", icon: "simple-icons:Sass", color: "#CC6699" },
	{
		slug: "jquery",
		name: "JQuery",
		icon: "simple-icons:Jquery",
		color: "#0769AD",
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
		icon: "simple-icons:Nodedotjs",
		color: "#339933",
	}, // fallback
	{
		slug: "mysql",
		name: "MySQL",
		icon: "simple-icons:Mysql",
		color: "#4479A1",
	},
	{
		slug: "postgresql",
		name: "PostgreSQL",
		icon: "simple-icons:Postgresql",
		color: "#336791",
	},
	{
		slug: "sqlite",
		name: "SQLite",
		icon: "simple-icons:sqlite",
		color: "#003B57",
	},
	{
		slug: "mongodb",
		name: "MongoDB",
		icon: "simple-icons:Mongodb",
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
		icon: "simple-icons:Git",
		color: "#F05032",
	}, // fallback
	{
		slug: "docker",
		name: "Docker",
		icon: "simple-icons:Docker",
		color: "#2496ED",
	},
	{
		slug: "npm",
		name: "npm",
		icon: "simple-icons:npm",
		color: "#CB3837",
	},
	{
		slug: "eslint",
		name: "ESLint",
		icon: "simple-icons:Eslint",
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
		slug: "jetstream",
		name: "Jetstream",
		icon: "simple-icons:laravel",
		color: "#FF2D20",
	},
	{
		slug: "pinia",
		name: "Pinia",
		icon: "simple-icons:Pinia",
		color: "#FFD859",
	}, // fallback
	{
		slug: "vue-router",
		name: "Vue Router",
		icon: "simple-icons:Vuedotjs",
		color: "#41b883",
	},
	{
		slug: "vue-i18n",
		name: "Vue I18n",
		icon: "simple-icons:Vuedotjs",
		color: "#41b883",
	},
	{
		slug: "fabric",
		name: "Fabric.js",
		icon: "simple-icons:Javascript",
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
		color: "#000",
	},
	{
		slug: "netlify",
		name: "Netlify",
		icon: "simple-icons:Netlify",
		color: "#00C7B7",
	},
	{
		slug: "express",
		name: "Express",
		icon: "simple-icons:Express",
		color: "#000",
	},
	{
		slug: "api",
		name: "API",
		icon: "mingcute:code-fill",
		color: "#6B7280",
	},
	{
		slug: "github",
		name: "GitHub",
		icon: "simple-icons:Github",
		color: "#181717",
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
		icon: "simple-icons:chromewebstore",
		color: "#4285F4",
	},
	{
		slug: "wxt",
		name: "WXT",
		icon: "simple-icons:wxt",
		color: "#67D55E",
	},
	{
		slug: "photoshop",
		name: "Adobe Photoshop",
		icon: "simple-icons:AdobePhotoshop",
		color: "#31A8FF",
	},
	{
		slug: "illustrator",
		name: "Adobe Illustrator",
		icon: "simple-icons:AdobeIllustrator",
		color: "#FF9A00",
	},

	// Fallback для неизвестных тегов
	{
		slug: "unknown",
		name: "Unknown",
		icon: "mingcute:question-fill",
		color: "#6B7280",
	},
	{
		slug: "simple-icons",
		name: "Simple Icons",
		icon: "simple-icons:simpleicons",
		color: "#0e0e0e",
	},
	{
		slug: "lucide-icons",
		name: "Lucide Icons",
		icon: "simple-icons:lucide",
		color: "#F56565",
	},
	{
		slug: "sora",
		name: "Sora",
		icon: "simple-icons:openai",
		color: "#0e0e0e",
	},
	{
		slug: "chatgpt",
		name: "ChatGPT",
		icon: "simple-icons:openai",
		color: "#0e0e0e",
	},
	{
		slug: "ai",
		name: "AI",
		icon: "simple-icons:openai",
		color: "#0e0e0e",
	},
	{
		slug: "gemini",
		name: "Gemini",
		icon: "vscode-icons:file-type-gemini",
		color: "#fff",
	},
	{
		slug: "adonisjs",
		name: "AdonisJS",
		icon: "simple-icons:Adonisjs",
		color: "#5A45FF",
	},
];

export function useTagIcons() {
	// Получить fallback тег
	const getFallbackTag = (slug: string): TagIcon => {
		const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
		const tag =
			defaultTagIcons.find(
				(tag) => tag.slug === normalizedSlug || tag.slug === slug.toLowerCase(),
			) || null;

		return (
			tag || {
				slug: slug.toLowerCase(),
				name: slug,
				icon: "simple-icons:JavaScript", // Используем существующую иконку
				color: "#6b7280",
			}
		);
	};

	return {
		getFallbackTag,
	};
}
