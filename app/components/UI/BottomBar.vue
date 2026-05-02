<template>
	<nav class="bottom-bar" role="navigation" aria-label="Mobile navigation">
		<NuxtLinkLocale
			v-for="link in mainLinks"
			:key="link.to"
			:to="link.to"
			class="bottom-bar-item"
			:exact="link.to === '/'"
			:aria-label="link.label"
		>
			<Icon :name="link.icon" :size="24" />
		</NuxtLinkLocale>
	</nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { t } = useI18n();

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
	{
		to: "/support",
		label: t("navigation.support"),
		icon: "mingcute:heart-fill",
	},
]);
</script>

<style scoped>
.bottom-bar {
	display: none;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10000;
	background: var(--bg);
	border-top: 1px solid var(--border);
	padding: 0.5rem 1rem;
	padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
	justify-content: space-around;
	align-items: center;
	view-transition-name: bottom-bar;
}

.bottom-bar-item {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	border-radius: 12px;
	corner-shape: superellipse(1.5);
	color: var(--text-secondary);
	text-decoration: none;
	transition: all 0.2s ease;
	min-width: 44px;
	min-height: 44px;
}

.bottom-bar-item:hover {
	color: var(--text);
	background: var(--bg-tertiary);
}

.bottom-bar-item.router-link-active {
	color: var(--text);
	background: var(--bg-secondary);
}

@media (max-width: 768px) {
	.bottom-bar {
		display: flex;
	}
}

@media (prefers-reduced-motion: reduce) {
	.bottom-bar-item {
		transition: none;
	}
}
</style>
