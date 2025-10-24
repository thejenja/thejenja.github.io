<template>
	<div
		class="project-page"
		:style="{
			'--accent': project?.meta?.color || '#4b5563',
		}"
	>
		<div class="project-content">
			<!-- Кнопка закрытия (для возврата к списку проектов) -->
			<NuxtLinkLocale to="/projects" class="close-button">
				<X />
			</NuxtLinkLocale>

			<!-- Цветная шапка с логотипом и верхними ссылками -->
			<div class="project-header" :style="headerStyle">
				<!-- Фоновое изображение -->
				<div v-if="hasBackground" class="project-background">
					<img
						:src="backgroundImageUrl"
						:alt="`${project?.title || 'Project'} background`"
						class="background-image"
						width="400"
						height="300"
					/>
				</div>

				<!-- Логотип проекта -->
				<div class="project-logo">
					<img
						v-if="hasLogo"
						:src="projectAssets.logo || undefined"
						:alt="`${project?.title || 'Project'} logo`"
						class="project-logo-image"
						width="300"
						height="100"
					/>
					<div v-else class="project-icon-large">
						{{ project?.meta?.icon || "📁" }}
					</div>
				</div>

				<div class="gradient-mask"></div>
			</div>

			<!-- Контент проекта -->
			<div v-if="project" class="project-content-wrapper">
				<h1 class="project-title">{{ project.title }}</h1>
				<p class="project-description">{{ project.description }}</p>

				<!-- Мета-информация проекта -->
				<div class="project-meta-info">
					<!-- Дата -->
					<div v-if="project.meta?.date || project.date" class="meta-item">
						<Calendar :size="16" />
						<span>{{
							formatDate(project.meta?.date || project.date || "")
						}}</span>
					</div>

					<!-- Тип проекта -->
					<div v-if="project.meta?.type" class="meta-item">
						<DynamicIcon :icon="getTypeIcon(project.meta.type)" :size="16" />
						<span>{{ getTypeLabel(project.meta.type) }}</span>
					</div>

					<!-- Статус проекта -->
					<div v-if="project.meta?.stage" class="meta-item">
						<DynamicIcon :icon="getStageIcon(project.meta.stage)" :size="16" />
						<span>{{ getStageLabel(project.meta.stage) }}</span>
					</div>
				</div>

				<div class="project-tags">
					<TechTag
						v-for="tech in project.meta?.technologies"
						:key="tech"
						:tag-slug="tech"
						:clickable="false"
					/>
				</div>

				<!-- Выбор платформы для дизайн-проектов (вверху) -->
				<div
					v-if="
						project.meta?.type === 'design' &&
						(project.meta?.behance || project.meta?.dribbble)
					"
					class="design-platform-choice top"
				>
					<label class="choice-label">{{ $t("links.choosePlatform") }}</label>
					<div class="platform-buttons">
						<a
							v-if="project.meta?.behance"
							:href="project.meta.behance"
							target="_blank"
							rel="noopener noreferrer"
							class="project-link behance"
						>
							<DynamicIcon icon="behance" /> Behance
						</a>
						<a
							v-if="project.meta?.dribbble"
							:href="project.meta.dribbble"
							target="_blank"
							rel="noopener noreferrer"
							class="project-link dribbble"
						>
							<DynamicIcon icon="dribbble" /> Dribbble
						</a>
					</div>
				</div>

				<!-- Верхние ссылки (кастом) -->
				<div v-if="topLinks && topLinks.length" class="project-links-top">
					<a
						v-for="(link, idx) in topLinks"
						:key="idx"
						:href="link.href"
						target="_blank"
						rel="noopener noreferrer"
						class="project-link small"
					>
						<DynamicIcon :icon="link.icon || 'link'" />
						{{ link.label }}
					</a>
				</div>

				<!-- Markdown контент -->
				<div class="project-markdown">
					<ContentRenderer :value="project.body as any" />
				</div>

				<!-- Галерея, если указана -->
				<div v-if="gallery && gallery.length" class="project-gallery">
					<div class="gallery-controls">
						<button
							class="gallery-toggle"
							:class="{ active: galleryMode === 'grid' }"
							@click="galleryMode = 'grid'"
						>
							{{ $t("common.gallery") }}
						</button>
						<button
							class="gallery-toggle"
							:class="{ active: galleryMode === 'carousel' }"
							@click="galleryMode = 'carousel'"
						>
							{{ $t("common.carousel") }}
						</button>
					</div>
					<GalleryGrid v-if="galleryMode === 'grid'" :images="gallery" />
					<ImageCarousel v-else :images="gallery" />
				</div>

				<div class="project-links">
					<!-- Обычные ссылки для проектов -->
					<a
						v-if="project.meta?.demo"
						:href="project.meta.demo"
						target="_blank"
						rel="noopener noreferrer"
						class="project-link demo"
					>
						<Link /> Демо
					</a>
					<a
						v-if="project.meta?.github"
						:href="project.meta.github"
						target="_blank"
						rel="noopener noreferrer"
						class="project-link github"
					>
						<GitHubIcon /> GitHub
					</a>

					<!-- Нижние ссылки (кастом) -->
					<a
						v-for="(link, idx) in bottomLinks"
						:key="`b-${idx}`"
						:href="link.href"
						target="_blank"
						rel="noopener noreferrer"
						class="project-link"
					>
						<DynamicIcon :icon="link.icon || 'link'" />
						{{ link.label }}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { CSSProperties } from "vue";
import { ContentRenderer } from "#components";
import { Link, X, Calendar } from "lucide-vue-next";
import GalleryGrid from "~/components/GalleryGrid.vue";
import ImageCarousel from "~/components/ImageCarousel.vue";
import { GitHubIcon } from "vue3-simple-icons";
import TechTag from "~/components/TechTag.vue";
import DynamicIcon from "~/components/DynamicIcon.vue";
import SafeImage from "~/components/SafeImage.vue";
import type { ProjectContent, ProjectLink } from "~/composables/useProjects";

const { t, locale } = useI18n();

// Получаем slug из параметров маршрута
const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Загружаем проект по slug
const { loadProjectBySlug } = useProjects();

const { data: project } = await useAsyncData(
	`project-${slug.value}`,
	async () => {
		try {
			// Получаем проект по slug и текущей локали
			const currentLocale = locale.value;
			console.log(`Loading project ${slug.value} for locale ${currentLocale}`);
			const projectData = await loadProjectBySlug(slug.value, currentLocale);
			console.log(`Loaded project data:`, projectData);

			return projectData as ProjectContent;
		} catch (error) {
			console.error(`Error loading project ${slug.value}:`, error);
			return null;
		}
	}
);

// Получаем ресурсы проекта
const getProjectAssets = (slug: string) => {
	if (!slug) {
		return {
			logo: null as string | null,
			background: null as string | null,
			preview: null as string | null,
			gallery: [] as Array<string | GalleryItem>,
		};
	}

	return {
		logo: `/projects/${slug}/logo.svg`,
		background: `/projects/${slug}/background.webp`,
		preview: `/projects/${slug}/preview.webp`,
		gallery: [] as Array<string | GalleryItem>,
	};
};

// Получаем ресурсы проекта
const projectAssets = computed(() => {
	const projectSlug = project.value?.meta?.slug;
	return projectSlug
		? getProjectAssets(projectSlug)
		: {
				logo: undefined,
				background: undefined,
				preview: undefined,
				gallery: [] as Array<string | GalleryItem>,
			};
});

// Определяем, есть ли логотип
const hasLogo = computed(() => {
	const projectSlug = project.value?.meta?.slug;
	return Boolean(projectSlug && projectAssets.value.logo);
});

// URL фонового изображения
const backgroundImageUrl = computed<string | undefined>(() => {
	const meta = project.value?.meta || {};
	// Используем только явно заданный backgroundImage в метаданных
	return meta.backgroundImage || undefined;
});

// Определяем, есть ли фон (изображение)
const hasBackground = computed(() => Boolean(backgroundImageUrl.value));

// CSS шапки: поддержка произвольного background
const headerStyle = computed<CSSProperties>(() => {
	const meta = project.value?.meta || {};
	const style: CSSProperties = {};
	if (typeof meta.background === "string" && meta.background.length > 0) {
		style.background = meta.background;
	} else {
		style.background = meta.color || "#4b5563";
	}
	return style;
});

// Верхние/нижние ссылки из метаданных
const topLinks = computed<ProjectLink[]>(() => {
	const meta = project.value?.meta || {};
	return Array.isArray(meta.linksTop) ? meta.linksTop : [];
});

const bottomLinks = computed<ProjectLink[]>(() => {
	const meta = project.value?.meta || {};
	return Array.isArray(meta.linksBottom) ? meta.linksBottom : [];
});

// Галерея и режим отображения
const gallery = computed<Array<string | GalleryItem>>(() => {
	const meta = project.value?.meta || {};
	return Array.isArray(meta.gallery) ? meta.gallery : [];
});

const galleryMode = ref<"grid" | "carousel">("grid");

// Функции для мета-информации
const formatDate = (dateString: string) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return dateString;

	const localeCode = locale.value === "ru" ? "ru-RU" : "en-US";

	return date.toLocaleDateString(localeCode, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const getTypeIcon = (type: string) => {
	const iconMap: Record<string, string> = {
		"web-app": "lucide:globe",
		"mobile-app": "lucide:smartphone",
		website: "lucide:globe",
		library: "lucide:package",
		tool: "lucide:wrench",
		game: "lucide:gamepad-2",
		design: "lucide:palette",
	};
	return iconMap[type] || "lucide:code";
};

const getTypeLabel = (type: string) => {
	return t(`projectTypes.${type}`, type);
};

const getStageIcon = (stage: string) => {
	const iconMap: Record<string, string> = {
		planning: "lucide:clock",
		"in-progress": "lucide:code",
		completed: "lucide:check-circle",
		"on-hold": "lucide:pause",
		archived: "lucide:archive",
	};
	return iconMap[stage] || "lucide:code";
};

const getStageLabel = (stage: string) => {
	return t(`projectStages.${stage}`, stage);
};

// OG Image для страницы проекта
defineOgImage({
	component: "ProjectTemplate",
	props: {
		title: project.value?.title || `Project ${slug.value}`,
		description: project.value?.description || "Project details page",
		type: project.value?.meta?.type || "web-app",
		stage: project.value?.meta?.stage || "completed",
		technologies: project.value?.meta?.technologies || ["nuxt", "vue"],
		backgroundColor: project.value?.meta?.color || "#4b5563",
		icon: project.value?.meta?.icon || "💻",
		projectSlug: slug.value,
	},
});

// SEO для страницы проекта
const seo = useSEO();
useHead(() => {
	const title = project.value?.title || t("projects.title");
	const projectColor = project.value?.meta?.color || "#4b5563";

	return {
		...seo.getPageSEO(),
		title: `${title} - ${t("seo.title")}`,
		meta: [
			...seo.getPageSEO().meta,
			{
				property: "theme-color",
				content: projectColor,
			},
		],
	};
});
</script>

<style scoped>
/* Стили страницы проекта */
.project-page {
	min-height: 10vh;
	background: var(--bg-primary);
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding: 1rem;
}

.project-content {
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	background: color-mix(
		in srgb,
		var(--accent, #4b5563) 10%,
		var(--bg-secondary)
	);
	border-radius: 16px;
	overflow: hidden;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px -5px rgba(0, 0, 0, 0.04);
	width: 100%;
	display: flex;
	flex-direction: column;
}

/* Цветная шапка */
.project-header {
	position: relative;
	height: 550px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

/* Верхние ссылки поверх шапки */
.project-links-top {
	display: flex;
	gap: 0.5rem;
}

/* Контент */
.project-content-wrapper {
	padding: 2rem;
	overflow-y: auto;
	flex: 1;
}

.project-title {
	margin: 0 0 0.5rem 0;
	color: var(--text);
	font-size: 1.75rem;
	font-weight: 700;
}

.project-description {
	color: var(--text-secondary);
	font-size: 1rem;
	line-height: 1.6;
	margin-bottom: 1.5rem;
}

.project-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
}

/* Мета-информация проекта */
.project-meta-info {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: var(--bg-tertiary);
	border-radius: 8px;
	border: 1px solid var(--border);
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--text-secondary);
	font-size: 0.875rem;
}

.meta-item svg {
	color: var(--accent, #4b5563);
}

.project-tag {
	background: var(--accent, #4b5563);
	color: white;
	padding: 0.375rem 0.875rem;
	border-radius: 8px;
	font-size: 0.8rem;
	font-weight: 500;
	transition: all 0.3s ease;
}

.project-tag:hover {
	transform: translateY(-1px);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Markdown контент */
.project-markdown {
	margin: 1.5rem 0;
	border-top: 1px solid var(--border);
	padding-top: 1.5rem;
}

/* Галерея */
.project-gallery {
	margin-top: 1.5rem;
}

.gallery-controls {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 0.75rem;
}

.gallery-toggle {
	background: var(--bg-tertiary);
	color: var(--text);
	border: 1px solid var(--border);
	padding: 0.375rem 0.75rem;
	border-radius: 6px;
	cursor: pointer;
}

.gallery-toggle.active {
	background: var(--accent, #4b5563);
	color: #fff;
	border-color: transparent;
}

.project-links {
	display: flex;
	gap: 1rem;
	margin-top: 2rem;
	padding-top: 1.5rem;
	border-top: 1px solid var(--border);
	flex-wrap: wrap;
}

.project-link {
	padding: 0.5rem 1rem;
	border-radius: 8px;
	text-decoration: none;
	font-size: 0.9rem;
	font-weight: 600;
	transition: all 0.3s ease;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	background: var(--bg-tertiary);
	border: 2px solid var(--border);
	color: var(--accent);
	flex-grow: 1;
}

.project-link.small {
	padding: 0.375rem 0.75rem;
	font-size: 0.8rem;
	background: color-mix(in oklab, var(--bg-secondary) 70%, transparent);
	border: 1px solid color-mix(in oklab, var(--border), transparent 60%);
}

.project-link.demo {
	background: var(--accent, #4b5563);
	color: white;
}

.project-link.github {
	background: var(--bg-tertiary);
	color: var(--text);
	border: 2px solid var(--border);
}

.project-link.behance {
	background: #1769ff;
	color: white;
	border: 2px solid transparent;
}

.project-link.dribbble {
	background: #ea4c89;
	color: white;
	border: 2px solid transparent;
}

/* Стили для выбора платформы дизайна */
.design-platform-choice {
	margin-bottom: 1rem;
}

.design-platform-choice.top {
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: var(--bg-secondary);
	border-radius: 8px;
	border: 1px solid var(--border);
}

.choice-label {
	display: block;
	font-size: 0.875rem;
	color: var(--text-secondary);
	margin-bottom: 0.5rem;
	font-weight: 500;
}

.platform-buttons {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.platform-buttons .project-link {
	flex: 1;
	min-width: 140px;
	justify-content: center;
}

.project-link:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Стили для markdown контента */
.project-markdown :deep(p) {
	color: var(--text-secondary);
	line-height: 1.7;
	margin-bottom: 1rem;
}

.project-markdown :deep(h1),
.project-markdown :deep(h2),
.project-markdown :deep(h3),
.project-markdown :deep(h4) {
	color: var(--text);
	margin-top: 1.5rem;
	margin-bottom: 0.75rem;
	font-weight: 600;
}

.project-markdown :deep(h1) {
	font-size: 1.5rem;
}

.project-markdown :deep(h2) {
	font-size: 1.25rem;
}

.project-markdown :deep(h3) {
	font-size: 1.125rem;
}

.project-markdown :deep(ul),
.project-markdown :deep(ol) {
	color: var(--text-secondary);
	margin-bottom: 1rem;
	padding-left: 1.5rem;
}

.project-markdown :deep(li) {
	margin-bottom: 0.5rem;
}

.project-markdown :deep(strong) {
	color: var(--text);
	font-weight: 600;
}

.project-markdown :deep(code) {
	background: var(--bg-tertiary);
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	font-family: "Courier New", monospace;
	font-size: 0.875rem;
	color: var(--text);
}

.project-markdown :deep(blockquote) {
	border-left: 4px solid var(--accent, #4b5563);
	padding-left: 1rem;
	margin: 1rem 0;
	font-style: italic;
	color: var(--text-secondary);
}

.project-markdown :deep(a) {
	color: var(--accent, #4b5563);
}

/* Фоновое изображение */
.project-background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
}

.background-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0.3;
}

/* Логотип */
.project-logo {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
}

.project-logo-image {
	max-height: 250px;
	max-width: 350px;
	width: auto;
	height: auto;
	transition: transform 0.3s ease;
}

.project-logo-image:hover {
	transform: scale(1.05);
}

.project-icon-large {
	font-size: 4rem;
	color: white;
	text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0.2));
}

.gradient-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(0deg, var(--bg-secondary) 0%, transparent 100%);
	--accent-secondary: color-mix(
		in srgb,
		var(--accent, #4b5563) 10%,
		var(--bg-secondary)
	);
	background: linear-gradient(
		0deg,
		var(--accent-secondary) 0%,
		transparent 100%
	);
	z-index: 1;
}

/* Кнопка закрытия */
.close-button {
	position: fixed;
	top: 1rem;
	right: 1rem;
	color: var(--text);
	border: none;
	cursor: pointer;
	padding: 0.75rem;
	border-radius: 0.5rem;
	transition: background 0.3s ease;
	z-index: 3;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-button:hover {
	background: var(--bg-tertiary);
	transform: scale(1.05);
}

/* Адаптивность */
@media (max-width: 768px) {
	.project-page {
		padding: 0.5rem 1rem;
	}

	.project-content {
		border-radius: 8px;
	}

	.project-icon-large {
		font-size: 3rem;
	}

	.project-content-wrapper {
		padding: 1.5rem;
	}

	.project-title {
		font-size: 1.5rem;
	}

	.project-links {
		flex-direction: column;
		gap: 0.75rem;
	}

	.project-link {
		text-align: center;
		justify-content: center;
	}
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.project-header,
	.project-logo-image,
	.project-icon-large,
	.background-image,
	.project-tag,
	.project-link {
		transition: none;
		animation: none;
	}
}
</style>
