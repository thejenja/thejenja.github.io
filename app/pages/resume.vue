<template>
	<div class="resume-page">
		<header class="page-header">
			<h1>
				{{ $t("resume.title") }}
				<FileText class="header-icon" />
			</h1>
			<p class="description">{{ $t("resume.description") }}</p>
		</header>

		<div class="resume-content">
			<!-- Секция Скачивания (Hero Card) -->
			<section class="download-section">
				<div class="download-card not-ready-container">
					<div class="icon-box">
						<Download :size="32" />
					</div>
					<div class="text-content">
						<h2>{{ $t("resume.download") }}</h2>
						<span class="cta-text"
							>{{ $t("resume.downloadButton") }} (PDF)</span
						>
						<p class="not-ready-message">{{ $t("resume.notReady") }}</p>
					</div>
					<ArrowRight class="arrow-icon" />
				</div>
			</section>

			<!-- Секция Профилей (Grid как в референсе Links) -->
			<section class="profiles-section">
				<h2>{{ $t("resume.onlineProfiles") }}</h2>
				<div class="profiles-grid">
					<a
						href="https://www.linkedin.com/in/thejenja/"
						target="_blank"
						rel="noopener noreferrer"
						class="profile-tile linkedin"
					>
						<Linkedin :size="28" />
						<span>LinkedIn</span>
						<ExternalLink :size="16" class="external-icon" />
					</a>

					<a
						href="https://github.com/thejenja"
						target="_blank"
						rel="noopener noreferrer"
						class="profile-tile github"
					>
						<Github :size="28" />
						<span>GitHub</span>
						<ExternalLink :size="16" class="external-icon" />
					</a>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import {
	FileText,
	Download,
	ArrowRight,
	Linkedin,
	Github,
	ExternalLink,
} from "lucide-vue-next";
import { useSEO } from "~/composables/useSEO";

const { t } = useI18n();

// SEO для страницы "Резюме"
const seo = useSEO();
useHead(() => ({
	...seo.getPageSEO(),
	title: seo.getPageTitle("resume.title"),
	meta: [
		...seo.getPageSEO().meta,
		{
			name: "description",
			content: seo.getPageDescription("resume.description"),
		},
	],
}));

// OG Image для страницы "Резюме"
defineOgImage({
	component: "HomeTemplate",
	props: {
		title: t("resume.title"),
		description: t("resume.description"),
		tagline: t("hero.greeting"),
	},
});
</script>

<style scoped>
.resume-page {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

.page-header h1 {
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 2rem;
	margin-bottom: 0.5rem;
}

.header-icon {
	width: 32px;
	height: 32px;
}

.description {
	color: var(--text-secondary);
	margin-bottom: 2.5rem;
}

.resume-content {
	display: flex;
	flex-direction: column;
	gap: 3rem;
}

/* Стили для карточки скачивания */
.download-card {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	background: var(--bg-secondary);
	padding: 2rem;
	border-radius: 16px;
	text-decoration: none;
	color: var(--text);
	border: 1px solid var(--border, transparent);
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	position: relative;
	overflow: hidden;
}

.download-card.not-ready-container {
	cursor: not-allowed;
	opacity: 0.7;
}

.download-card.not-ready-container:hover {
	transform: none;
	background: var(--bg-secondary);
	box-shadow: none;
}

.download-card:hover {
	transform: scale(1.02);
	background: var(--bg-tertiary);
	box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.icon-box {
	background: var(--text);
	color: var(--bg);
	width: 60px;
	height: 60px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.4s ease;
}

.download-card:hover .icon-box {
	transform: rotate(-10deg) scale(1.1);
}

.text-content h2 {
	font-size: 1.25rem;
	margin: 0 0 0.25rem 0;
}

.cta-text {
	color: var(--text-secondary);
	font-size: 0.95rem;
}

.not-ready-message {
	color: var(--text-secondary);
	font-size: 0.85rem;
	margin-top: 0.5rem;
	font-style: italic;
}

.arrow-icon {
	margin-left: auto;
	opacity: 0.5;
	transition: all 0.3s ease;
}

.download-card:hover .arrow-icon {
	opacity: 1;
	transform: translateX(5px);
}

/* Стили для сетки профилей */
.profiles-section h2 {
	font-size: 1.25rem;
	margin-bottom: 1.5rem;
	color: var(--text-secondary);
}

.profiles-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

.profile-tile {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: var(--bg-secondary);
	color: var(--text);
	border-radius: 12px;
	text-decoration: none;
	font-weight: 600;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	border: 1px solid transparent;
}

.profile-tile:hover {
	transform: translateY(-4px);
	border-color: var(--bg-tertiary);
}

.profile-tile.linkedin:hover {
	background: #0077b5;
	color: white;
}

.profile-tile.github:hover {
	background: #24292e;
	color: white;
}

.external-icon {
	margin-left: auto;
	opacity: 0;
	transform: translateX(-10px);
	transition: all 0.3s ease;
}

.profile-tile:hover .external-icon {
	opacity: 1;
	transform: translateX(0);
}
</style>
