<template>
	<div class="about-page">
		<AnimatedSection animation-type="fade" :delay="0">
			<AboutMe />
		</AnimatedSection>

		<AnimatedSection animation-type="slide-up" :delay="200">
			<Links />
		</AnimatedSection>
	</div>
</template>

<script setup>
import AboutMe from "~/components/AboutMe.vue";
import Links from "~/components/Links.vue";
import { useSEO } from "~/composables/useSEO";

const { t } = useI18n();

// SEO для страницы "Обо мне"
const seo = useSEO();
useHead(() => ({
	...seo.getPageSEO(),
	title: seo.getPageTitle("about.title"),
	meta: [
		...seo.getPageSEO().meta,
		{
			name: "description",
			content: seo.getPageDescription("about.intro"),
		},
	],
}));

// OG Image для страницы "Обо мне"
defineOgImage({
	component: "HomeTemplate",
	props: {
		title: t("about.title"),
		description: t("about.intro"),
		tagline: t("hero.greeting"),
	},
});
</script>

<style scoped>
.about-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.about-page > * {
	will-change: transform, opacity;
}
</style>
