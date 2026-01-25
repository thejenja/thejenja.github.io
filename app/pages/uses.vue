<template>
	<div class="uses-page">
		<header class="page-header">
			<h1>
				{{ $t("uses.title") }}
			</h1>
			<p class="description">{{ $t("uses.description") }}</p>
		</header>

		<div class="uses-content">
			<!-- Секция Tech Stack -->
			<section class="uses-section">
				<h2>
					{{ $t("uses.techStack") }}
					<Code2 class="section-icon" />
				</h2>
				<div class="tech-stack-grid">
					<TechTag
						v-for="tech in techStack"
						:key="tech"
						:tag-slug="tech"
						:expanded="true"
					/>
				</div>
			</section>

			<!-- Секция Setup -->
			<section class="uses-section">
				<h2>
					{{ $t("uses.setup") }}
					<Settings class="section-icon" />
				</h2>
				<div class="setup-tiles">
					<div
						v-for="(item, index) in setup"
						:key="'setup-' + index"
						class="setup-tile"
					>
						<div class="tile-icon-wrapper">
							<component :is="item.icon" v-if="item.icon" class="tile-icon" />
						</div>
						<div class="tile-content">
							<span class="tile-label">{{ item.category }}</span>
							<span class="tile-value">{{ item.tools }}</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import {
	Laptop,
	Code2,
	Settings,
	Monitor,
	Code,
	Terminal,
	Chrome,
} from "lucide-vue-next";
import TechTag from "~/components/TechTag.vue";
import { useSEO } from "~/composables/useSEO";

const { t } = useI18n();

// SEO для страницы "Стек"
const seo = useSEO();
useHead(() => ({
	...seo.getPageSEO(),
	title: seo.getPageTitle("uses.title"),
	meta: [
		...seo.getPageSEO().meta,
		{
			name: "description",
			content: seo.getPageDescription("uses.description"),
		},
	],
}));

// OG Image для страницы "Стек"
defineOgImage({
	component: "HomeTemplate",
	props: {
		title: t("uses.title"),
		description: t("uses.description"),
		tagline: t("hero.greeting"),
	},
});

const techStack = [
	"vue",
	"nuxt",
	"javascript",
	"typescript",
	"nodejs",
	"express",
	"figma",
	"photoshop",
	"illustrator",
	"git",
	"github",
	"vercel",
];

const setup = [
	{ category: "Editor", tools: "VS Code", icon: Code },
	{
		category: "Terminal",
		tools: "Windows Terminal, PowerShell",
		icon: Terminal,
	},
	{ category: "Browser", tools: "Google Chrome", icon: Chrome },
	{
		category: "Laptop",
		tools: "Chuwi Corebook X 14",
		icon: Monitor,
	},
];
</script>

<style scoped>
.uses-page {
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
	color: var(--primary);
}

.description {
	color: var(--text-secondary);
	margin-bottom: 2.5rem;
	line-height: 1.6;
}

.uses-content {
	display: flex;
	flex-direction: column;
	gap: 3rem;
}

.uses-section h2 {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 1.5rem;
	font-size: 1.5rem;
}

.section-icon {
	width: 24px;
	height: 24px;
	color: var(--text-secondary);
}

.tech-stack-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 1rem;
}

.setup-tiles {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-top: 1rem;
}

.setup-tile {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem;
	background: var(--bg-tertiary);
	color: var(--text);
	border-radius: 12px;
	border: 1px solid transparent;
	cursor: default;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	width: 100%;
	height: 100%;
	min-height: 100px;
}

.setup-tile:hover {
	background: var(--bg-secondary);
	border-color: var(--bg-tertiary);
	transform: translateY(-2px);
}

.tile-icon-wrapper {
	display: flex;
	align-items: center;
}

.tile-icon {
	width: 1.5rem;
	height: 1.5rem;
}

.tile-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
}

.tile-label {
	font-size: 0.9rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.tile-value {
	font-size: 0.95rem;
	color: var(--text-secondary);
}

@media (max-width: 600px) {
	.setup-tiles {
		grid-template-columns: 1fr;
	}
}
</style>
