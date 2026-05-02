<template>
	<a href="#main-content" class="skip-to-content">Skip to content</a>
	<header class="top-bar" role="banner">
		<div class="top-bar-inner">
			<!-- Logo -->
			<NuxtLinkLocale to="/" class="logo-link" aria-label="Home">
				<img
					src="/images/thejenja.svg"
					alt="thejenja"
					class="logo"
					width="100"
					height="28"
				/>
			</NuxtLinkLocale>

			<!-- Main navigation (centered) -->
			<nav class="main-nav" role="navigation" aria-label="Main">
				<!-- Back button for project pages (inside nav) -->
				<NuxtLinkLocale
					v-if="isProjectPage"
					to="/projects"
					class="nav-pill back-link"
					:aria-label="$t('navigation.backToProjects')"
				>
					<Icon name="mingcute:arrow-left-fill" :size="16" />
					<span>{{ $t("navigation.backToProjects") }}</span>
				</NuxtLinkLocale>

			<NuxtLinkLocale
				v-for="link in mainLinks"
				:key="link.to"
				:to="link.to"
				class="nav-pill"
			>
				<Icon :name="link.icon" :size="20" />
				<span>{{ link.label }}</span>
			</NuxtLinkLocale>
			</nav>

			<!-- Utilities -->
			<div class="nav-utils">
				<LanguageToggle minimal />
				<ThemeToggle :minimal="true" />
			</div>
		</div>
	</header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { t } = useI18n();

// Main navigation links
const mainLinks = computed(() => [
	{
		to: "/",
		label: t("navigation.home"),
		icon: "mingcute:home-5-fill",
	},
	{
		to: "/about",
		label: t("navigation.about"),
		icon: "mingcute:user-3-fill",
	},
	{
		to: "/projects",
		label: t("navigation.projects"),
		icon: "mingcute:folder-open-fill",
	},
]);

// Check if we're on a project detail page
const isProjectPage = computed(() => {
	return (
		route.path.includes("/projects/") &&
		route.params.slug &&
		Object.keys(route.params).includes("slug")
	);
});
</script>

<style scoped>
.top-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10000;
	padding: 0.75rem 1.5rem;
	background: transparent;
	pointer-events: none;
	view-transition-name: top-bar;
}

.top-bar-inner {
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	pointer-events: auto;
}

/* Logo */
.logo-link {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	transition: opacity 0.2s ease;
}

.logo-link:hover {
	opacity: 0.7;
}

.logo {
	height: 24px;
	width: auto;
}

/* Main navigation - centered */
.main-nav {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	flex: 1;
	max-width: fit-content;
	margin: 0 auto;
}

.nav-pill {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.5rem 1rem;
	border-radius: 16px;
	corner-shape: superellipse(1.5);
	color: var(--text-secondary);
	text-decoration: none;
	font-size: .9rem;
	font-weight: 500;
	transition: all 0.2s ease;
	white-space: nowrap;
	background: transparent;
	border: 1px solid transparent;
}

.nav-pill:hover {
	color: var(--text);
	background: var(--bg-tertiary);
}

.nav-pill.router-link-active {
	color: var(--text);
	background: var(--bg-secondary);
}

/* Back link styling */
.back-link {
	color: var(--text-secondary);
}

.back-link:hover {
	color: var(--text);
}

/* Utilities */
.nav-utils {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-shrink: 0;
}

/* Mobile: hide main nav, show bottom bar */
@media (max-width: 768px) {
	.top-bar {
		padding: 0.5rem 1rem;
	}

	.top-bar-inner {
		gap: 0.75rem;
	}

	.logo {
		height: 24px;
	}

	.main-nav {
		display: none;
	}

	.nav-utils {
		gap: 0.25rem;
	}
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
	.nav-pill,
	.logo-link {
		transition: none;
	}
}
</style>
