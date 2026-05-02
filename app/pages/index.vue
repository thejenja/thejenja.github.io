<template>
	<div class="home-page">
		<AnimatedSection animation-type="fade" :delay="0">
			<Hero />
		</AnimatedSection>

		<AnimatedSection animation-type="slide-up" :delay="800">
			<ContactMe />
		</AnimatedSection>
	</div>
</template>

<script setup>
import ContactMe from '~/components/sections/ContactMe.vue';
import Hero from '~/components/sections/Hero.vue';

// SEO для главной страницы
const { getPageSEO } = useSEO();
useHead(() => ({
	...getPageSEO(),
	script: [
		{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Person",
				name: "Eugene (thejenja)",
				url: "https://thejenja.github.io",
				sameAs: [
					"https://github.com/thejenja",
					"https://t.me/thejenja",
					"https://www.linkedin.com/in/thejenja/",
				],
				jobTitle: "Frontend Developer & Designer",
				knowsAbout: ["Vue.js", "Nuxt", "UI Design", "Web Development"],
			}),
		},
	],
}));

// OG Image для главной страницы
defineOgImage("HomeTemplate");

// Компоненты будут автоматически анимироваться через AnimatedSection
</script>

<style scoped>
.home-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.home-page > * {
	will-change: transform, opacity;
}
</style>
