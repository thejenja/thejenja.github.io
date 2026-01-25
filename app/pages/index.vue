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
// SEO для главной страницы
const { getPageSEO } = useSEO();
useHead(getPageSEO());

// OG Image для главной страницы
defineOgImage({
	component: "HomeTemplate",
	props: {
		title: "Eugene (thejenja) - Frontend Developer",
		description: "Personal portfolio showcasing web development projects",
		tagline: "Creating beautiful and functional web experiences",
	},
});

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
