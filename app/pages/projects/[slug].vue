<template>
	<div
		class="project-page"
		:style="{
			'--accent': project?.meta?.color || '#4b5563',
		}"
	>
		<!-- HERO SECTION -->
		<div class="project-header">
			<!-- Фон -->
			<div
				class="header-background"
				:style="{ viewTransitionName: transitionName('bg') }"
			>
				<div v-if="hasBackground" class="background-image-wrapper">
					<NuxtImg
						:src="backgroundImageUrl"
						:alt="`${project?.title || 'Project'} background`"
						class="background-image"
						:class="{ 'is-opaque': isOpaqueBackground }"
						width="1600"
						height="900"
						placeholder
					/>
					<div
						class="background-overlay"
						:class="{ 'force-contrast': isOpaqueBackground }"
					/>
				</div>
				<div v-else class="gradient-background" :style="headerStyle" />
			</div>

			<!-- Контент внутри шапки -->
			<div class="header-content container-limit">
				<div class="header-top-row">
					<div
						class="header-logo-wrapper"
						:style="{ viewTransitionName: transitionName('logo') }"
					>
						<!-- 1. Логотип (картинка) -->
						<NuxtImg
							v-if="finalLogoPath && !logoLoadFailed"
							:src="finalLogoPath"
							:alt="`${project?.title || 'Project'} logo`"
							class="project-logo-image"
							width="200"
							height="100"
							@error="handleLogoError"
						/>

						<!-- 2. Fallback: Иконка -->
						<div v-else-if="project?.meta?.icon" class="project-icon-large">
							{{ project.meta.icon }}
						</div>

						<!-- 3. Fallback: Название (Если иконки нет, показываем название крупно, хотя оно есть и ниже) -->
						<div v-else class="project-title-fallback-hero">
							{{ project?.title }}
						</div>
					</div>
				</div>

				<div class="header-info">
					<div class="meta-badges-list">
						<div v-if="project.meta?.type" class="meta-badge">
							<div class="meta-badge__icon">
								<DynamicIcon
									:icon="getTypeIcon(project.meta.type)"
									:size="20"
								/>
							</div>
							<span class="meta-badge__text">{{
								getTypeLabel(project.meta.type)
							}}</span>
						</div>

						<div v-if="project.meta?.stage" class="meta-badge">
							<div class="meta-badge__icon">
								<DynamicIcon
									:icon="getStageIcon(project.meta.stage)"
									:size="20"
								/>
							</div>
							<span class="meta-badge__text">{{
								getStageLabel(project.meta.stage)
							}}</span>
						</div>

						<div v-if="project.meta?.date || project.date" class="meta-badge">
							<div class="meta-badge__icon">
								<Calendar :size="20" />
							</div>
							<span class="meta-badge__text">{{
								formatDate(project.meta?.date || project.date || "")
							}}</span>
						</div>
					</div>

					<h1
						class="project-title-hero"
						:style="{ viewTransitionName: transitionName('title') }"
					>
						{{ project?.title }}
					</h1>
					<p class="project-description-hero">{{ project?.description }}</p>

					<div class="header-tags">
						<TechTag
							v-for="tech in project?.meta?.technologies"
							:key="tech"
							:tag-slug="tech"
							:clickable="false"
							:expanded="true"
							class="hero-tag"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Основной контент страницы -->
		<div class="project-body container-limit">
			<div class="project-layout-grid">
				<main class="main-content-column">
					<div class="main-actions">
						<a
							v-if="project?.meta?.demo"
							:href="project.meta.demo"
							target="_blank"
							class="action-button primary"
						>
							<Link :size="18" /> Демо
						</a>
						<a
							v-if="project?.meta?.github"
							:href="project.meta.github"
							target="_blank"
							class="action-button secondary"
						>
							<GitHubIcon /> GitHub
						</a>

						<template v-if="project?.meta?.type === 'design'">
							<a
								v-if="project.meta?.behance"
								:href="project.meta.behance"
								target="_blank"
								class="action-button behance"
							>
								<DynamicIcon icon="behance" /> Behance
							</a>
							<a
								v-if="project.meta?.dribbble"
								:href="project.meta.dribbble"
								target="_blank"
								class="action-button dribbble"
							>
								<DynamicIcon icon="dribbble" /> Dribbble
							</a>
						</template>
					</div>

					<div class="project-markdown">
						<ContentRenderer :value="project?.body as any" />
					</div>

					<div v-if="gallery && gallery.length" class="project-gallery-section">
						<div class="section-header">
							<h2>{{ $t("common.gallery") }}</h2>
							<div class="gallery-controls">
								<button
									class="control-btn"
									:class="{ active: galleryMode === 'grid' }"
									@click="galleryMode = 'grid'"
								>
									<DynamicIcon icon="lucide:grid-3x3" />
								</button>
								<button
									class="control-btn"
									:class="{ active: galleryMode === 'carousel' }"
									@click="galleryMode = 'carousel'"
								>
									<DynamicIcon icon="lucide:monitor-play" />
								</button>
							</div>
						</div>
						<GalleryGrid v-if="galleryMode === 'grid'" :images="gallery" />
						<ImageCarousel v-else :images="gallery" />
					</div>

					<div
						v-if="bottomLinks.length || topLinks.length"
						class="project-footer-links"
					>
						<a
							v-for="(link, idx) in [...topLinks, ...bottomLinks]"
							:key="idx"
							:href="link.href"
							target="_blank"
							class="project-link-simple"
						>
							<DynamicIcon :icon="link.icon || 'link'" />
							{{ link.label }}
						</a>
					</div>
				</main>

				<aside class="sidebar-column" v-if="toc && toc.length > 0">
					<div class="toc-wrapper">
						<h3 class="toc-title">
							{{ $t("common.tableOfContents") || "Содержание" }}
						</h3>
						<nav class="toc-nav">
							<ul>
								<li v-for="link in toc" :key="link.id">
									<a
										:href="`#${link.id}`"
										@click.prevent="scrollToHeading(link.id)"
										:class="{ 'active-toc-link': isActiveTocLink(link.id) }"
									>
										{{ link.text }}
									</a>
									<ul v-if="link.children && link.children.length">
										<li v-for="child in link.children" :key="child.id">
											<a
												:href="`#${child.id}`"
												@click.prevent="scrollToHeading(child.id)"
												class="sub-link"
												:class="{
													'active-toc-link': isActiveTocLink(child.id),
												}"
											>
												{{ child.text }}
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</aside>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import type { CSSProperties } from "vue";
import { ContentRenderer } from "#components";
import { Link, Calendar } from "lucide-vue-next";
import GalleryGrid from "~/components/GalleryGrid.vue";
import ImageCarousel from "~/components/ImageCarousel.vue";
import { GitHubIcon } from "vue3-simple-icons";
import TechTag from "~/components/TechTag.vue";
import DynamicIcon from "~/components/DynamicIcon.vue";
import type { ProjectContent, ProjectLink } from "~/composables/useProjects";

const { t, locale } = useI18n();
const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { loadProjectBySlug } = useProjects();

definePageMeta({
	prerender: true,
});

const { data: project } = await useAsyncData(
	() => `project-${slug.value}-${locale.value}`,
	() => loadProjectBySlug(slug.value, locale.value)
);

// --- LOGO FALLBACK LOGIC ---
const logoLoadFailed = ref(false);
const handleLogoError = () => {
	logoLoadFailed.value = true;
};

// Определяем путь к логотипу.
// Если в meta.logo задан путь — используем его.
// Если нет — генерируем дефолтный.
const finalLogoPath = computed(() => {
	if (project.value?.meta?.logo) return project.value.meta.logo;
	const projectSlug = project.value?.meta?.slug;
	return projectSlug ? `/projects/${projectSlug}/logo.svg` : undefined;
});
// ----------------------------

const backgroundImageUrl = computed<string | undefined>(
	() => project.value?.meta?.backgroundImage || undefined
);
const hasBackground = computed(() => Boolean(backgroundImageUrl.value));

const isOpaqueBackground = computed(
	() => project.value?.meta?.backgroundOpacity === "opaque"
);

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

const topLinks = computed<ProjectLink[]>(
	() => project.value?.meta?.linksTop || []
);
const bottomLinks = computed<ProjectLink[]>(
	() => project.value?.meta?.linksBottom || []
);
const gallery = computed(() => project.value?.meta?.gallery || []);
const galleryMode = ref<"grid" | "carousel">("grid");

const toc = computed(() => {
	return project.value?.body?.toc?.links || [];
});

// Текущий активный ID заголовка
const activeTocId = ref<string | null>(null);

const isActiveTocLink = (id: string) => {
	return activeTocId.value === id;
};

const scrollToHeading = (id: string) => {
	const element = document.getElementById(id);
	if (element) {
		const offset = 100;
		const elementPosition = element.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth",
		});
	}
};

const updateActiveTocLink = () => {
	const headings = toc.value.flatMap((link: any) => {
		const mainHeading = document.getElementById(link.id);
		const subHeadings = link.children
			? link.children.map((child: any) => document.getElementById(child.id))
			: [];
		return [mainHeading, ...subHeadings].filter(
			(heading) => heading !== null
		) as HTMLElement[];
	});

	if (headings.length === 0) return;

	const scrollPosition = window.scrollY + 120;

	for (let i = headings.length - 1; i >= 0; i--) {
		const heading = headings[i];
		if (heading && heading.offsetTop <= scrollPosition) {
			const id = heading.getAttribute("id");
			if (id) {
				activeTocId.value = id;
				break;
			}
		}
	}
};

onMounted(() => {
	window.addEventListener("scroll", updateActiveTocLink);
	nextTick(() => {
		updateActiveTocLink();
	});
});

onUnmounted(() => {
	window.removeEventListener("scroll", updateActiveTocLink);
});

const formatDate = (dateString: string) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return dateString;
	return date.toLocaleDateString(locale.value === "ru" ? "ru-RU" : "en-US", {
		year: "numeric",
		month: "long",
	});
};

const getTypeIcon = (type: string) => {
	const map: Record<string, string> = {
		"web-app": "lucide:globe",
		"mobile-app": "lucide:smartphone",
		website: "lucide:globe",
		library: "lucide:package",
		tool: "lucide:wrench",
		game: "lucide:gamepad-2",
		design: "lucide:palette",
	};
	return map[type] || "lucide:code";
};
const getTypeLabel = (type: string) => t(`projectTypes.${type}`, type);

const getStageIcon = (stage: string) => {
	const map: Record<string, string> = {
		planning: "lucide:clock",
		"in-progress": "lucide:code",
		completed: "lucide:check-circle",
		"on-hold": "lucide:pause",
		archived: "lucide:archive",
	};
	return map[stage] || "lucide:code";
};
const getStageLabel = (stage: string) => t(`projectStages.${stage}`, stage);

useHead(() => {
	if (!project.value) {
		return {
			title: t("projects.title"),
		};
	}

	return {
		title: `${project.value.title} - ${t("seo.title")}`,
		meta: [
			{
				property: "theme-color",
				content: project.value.meta?.color || "#4b5563",
			},
		],
	};
});

const transitionName = (element: string) => {
	if (!slug.value) return undefined;
	const safeSlug = slug.value.replace(/[^a-z0-9-_]/gi, "");
	return `project-${element}-${safeSlug}`;
};
</script>

<style scoped>
.project-page {
	width: 100%;
	min-height: 100vh;
	background: var(--bg-primary);
}

.container-limit {
	max-width: 1100px;
	margin: 0 auto;
	padding: 0 2rem;
	width: 100%;
}

/* === HEADER / HERO SECTION === */
.project-header {
	position: relative;
	min-height: 70vh;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding-bottom: 3rem;
	color: white;
}

.header-background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	overflow: hidden;
}

.background-image-wrapper {
	width: 100%;
	height: 100%;
	position: relative;
}

.background-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: opacity 0.3s ease;
}

.background-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0.1) 0%,
		rgba(0, 0, 0, 0.3) 50%,
		rgba(0, 0, 0, 0.85) 100%
	);
	z-index: 1;
}

.background-overlay.force-contrast {
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0.2) 0%,
		rgba(0, 0, 0, 0.6) 40%,
		rgba(0, 0, 0, 0.95) 100%
	);
}

.background-image.is-opaque {
	opacity: 1;
}

.gradient-background {
	width: 100%;
	height: 100%;
	background: var(--accent);
	background: linear-gradient(
		135deg,
		var(--accent),
		color-mix(in srgb, var(--accent), black 50%)
	);
}

.header-content {
	position: relative;
	z-index: 10;
	display: flex;
	flex-direction: column;
	height: 100%;
	padding-top: 2rem;
}

.header-top-row {
	display: flex;
	justify-content: flex-start;
	margin-bottom: auto;
}

.header-logo-wrapper {
	opacity: 0.95;
	transition: transform 0.3s;
}
.header-logo-wrapper:hover {
	transform: scale(1.02);
}

.project-logo-image {
	min-height: 120px;
	max-height: 140px;
	height: auto;
}

.project-icon-large {
	font-size: 5rem;
}

.project-title-fallback-hero {
	font-size: 3rem;
	font-weight: 700;
	text-transform: uppercase;
	line-height: 1;
}

/* --- INFO BLOCK --- */
.header-info {
	margin-top: 2rem;
}

.project-title-hero {
	font-size: 3.5rem;
	font-weight: 600;
	margin: 0.5rem 0 1rem;
	line-height: 1.1;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	width: fit-content;
}

.project-description-hero {
	font-size: 1.25rem;
	max-width: 700px;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.6;
	text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
	margin-bottom: 1.5rem;
}

.meta-badges-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-bottom: 1rem;
}

.meta-badge {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	color: white;
	padding: 0.4rem 0.6rem;
	border-radius: 12px;
	font-size: 0.95rem;
	font-weight: 600;
	transition: background 0.3s ease;
}

.meta-badge:hover {
	background: rgba(255, 255, 255, 0.25);
}

.meta-badge__icon {
	display: flex;
	align-items: center;
	opacity: 0.9;
}

.header-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

/* === LAYOUT GRID === */
.project-body {
	padding-top: 3rem;
	padding-bottom: 4rem;
	background: var(--bg-primary);
	position: relative;
	z-index: 2;
}

.project-layout-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
}

@media (min-width: 1024px) {
	.project-layout-grid {
		grid-template-columns: 1fr 250px;
		gap: 3rem;
	}
}

.main-content-column {
	min-width: 0;
}

/* === SIDEBAR TOC === */
.sidebar-column {
	display: none;
}

@media (min-width: 1024px) {
	.sidebar-column {
		display: block;
		position: relative;
	}

	.toc-wrapper {
		position: sticky;
		top: 2rem;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 12px;
		border: 1px solid var(--border);
	}

	.toc-title {
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.toc-nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.toc-nav li {
		margin-bottom: 0.5rem;
	}

	.toc-nav a {
		text-decoration: none;
		color: var(--text);
		font-size: 0.9rem;
		transition: color 0.2s;
		display: block;
		line-height: 1.4;
	}

	.toc-nav a:hover {
		color: var(--accent);
	}

	.toc-nav a.active-toc-link {
		color: var(--accent);
		font-weight: 600;
	}

	.toc-nav .sub-link {
		padding-left: 1rem;
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	.toc-nav .sub-link.active-toc-link {
		color: var(--accent);
		font-weight: 600;
	}
}

/* === ACTIONS & CONTENT === */
.main-actions {
	display: flex;
	gap: 1rem;
	margin-bottom: 3rem;
	flex-wrap: wrap;
}

.action-button {
	display: inline-flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1.5rem;
	border-radius: 12px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.2s ease;
	font-size: 1rem;
}

.action-button.primary {
	background: var(--accent);
	color: white;
	box-shadow: 0 4px 14px -4px color-mix(in srgb, var(--accent), transparent 30%);
}
.action-button.primary:hover {
	transform: translateY(-2px);
	filter: brightness(1.1);
}

.action-button.secondary {
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	color: var(--text);
}
.action-button.secondary:hover {
	background: var(--bg-tertiary);
	border-color: var(--accent);
}

.action-button.behance {
	background: #1769ff;
	color: white;
}
.action-button.dribbble {
	background: #ea4c89;
	color: white;
}

/* Markdown */
.project-markdown {
	margin-bottom: 4rem;
}
.project-markdown :deep(p) {
	font-size: 1.1rem;
	line-height: 1.8;
	margin-bottom: 1.5rem;
	color: var(--text-secondary);
}
.project-markdown :deep(h2) {
	font-size: 1.8rem;
	margin-top: 2.5rem;
	margin-bottom: 1rem;
	color: var(--text);
	scroll-margin-top: 80px;
}
.project-markdown :deep(a) {
	color: var(--accent);
}
.project-markdown :deep(h3) {
	font-size: 1.4rem;
	margin-top: 2rem;
	margin-bottom: 0.75rem;
	color: var(--text);
	scroll-margin-top: 80px;
}
.project-markdown :deep(img) {
	border-radius: 12px;
	max-width: 100%;
	border: 1px solid var(--border);
}

/* Gallery */
.project-gallery-section {
	margin-top: 2rem;
	border-top: 1px solid var(--border);
	padding-top: 2rem;
}
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}
.control-btn {
	background: var(--bg-tertiary);
	border: 1px solid var(--border);
	border-radius: 8px;
	padding: 0.5rem;
	margin-left: 0.5rem;
	cursor: pointer;
	color: var(--text-secondary);
}
.control-btn.active {
	background: var(--accent);
	color: white;
	border-color: var(--accent);
}

/* Footer links */
.project-footer-links {
	margin-top: 3rem;
	padding-top: 2rem;
	border-top: 1px solid var(--border);
	display: flex;
	flex-wrap: wrap;
	gap: 1.5rem;
}
.project-link-simple {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--text-secondary);
	text-decoration: none;
	font-weight: 500;
	transition: color 0.2s;
}
.project-link-simple:hover {
	color: var(--accent);
}

/* Mobile */
@media (max-width: 768px) {
	.container-limit {
		padding: 0 1.25rem;
	}
	.project-header {
		min-height: 60vh;
	}
	.project-title-hero {
		font-size: 2.5rem;
	}
	.main-actions {
		flex-direction: column;
	}
	.action-button {
		justify-content: center;
	}
	.project-logo-image {
		max-width: 160px;
	}
	.project-title-fallback-hero {
		font-size: 2rem;
	}
}
</style>
