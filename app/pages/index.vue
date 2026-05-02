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

const { t, locale } = useI18n();

useSeoMeta({
	title: t('seo.title'),
	description: t('seo.description'),
	keywords: t('seo.keywords'),
	author: t('seo.author'),
	ogTitle: t('seo.ogTitle'),
	ogDescription: t('seo.ogDescription'),
	twitterTitle: t('seo.twitterTitle'),
	twitterDescription: t('seo.twitterDescription'),
});

useSchemaOrg([
	{
		'@type': 'Person',
		name: 'Eugene (thejenja)',
		url: 'https://thejenja.github.io',
		sameAs: [
			'https://github.com/thejenja',
			'https://t.me/thejenja',
			'https://www.linkedin.com/in/thejenja/',
		],
		jobTitle: 'Frontend Developer & Designer',
		knowsAbout: ['Vue.js', 'Nuxt', 'UI Design', 'Web Development'],
	},
	{
		'@type': 'WebSite',
		name: 'thejenja',
		url: 'https://thejenja.github.io',
		potentialAction: {
			'@type': 'SearchAction',
			target: 'https://thejenja.github.io/projects?search={search_term_string}',
			'query-input': 'required name=search_term_string',
		},
	},
	{
		'@type': 'WebPage',
		name: computed(() => t('seo.title')),
		description: computed(() => t('seo.description')),
	},
	{
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thejenja.github.io' },
		],
	},
]);

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
