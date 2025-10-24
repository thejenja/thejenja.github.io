<template>
	<div class="home-page">
		<AnimatedSection animation-type="fade" :delay="0">
			<Hero />
		</AnimatedSection>

		<AnimatedSection animation-type="slide-up" :delay="200">
			<AboutMe />
		</AnimatedSection>

		<AnimatedSection animation-type="slide-left" :delay="400">
			<Links />
		</AnimatedSection>

		<AnimatedSection animation-type="scale" :delay="600">
			<AsyncWrapper :threshold="0.2" skeleton-variant="project">
				<TimelineProjects :projects="projects" :compact="true" :limit="3" />
			</AsyncWrapper>
		</AnimatedSection>

		<AnimatedSection animation-type="slide-up" :delay="800">
			<ContactMe />
		</AnimatedSection>
	</div>
</template>

<script setup>
import TimelineProjects from "~/components/TimelineProjects.vue";

// OG Image для главной страницы
defineOgImage({
	component: "HomeTemplate",
	props: {
		title: "Eugene (thejenja) - Frontend Developer",
		description: "Personal portfolio showcasing web development projects",
		tagline: "Creating beautiful and functional web experiences",
	},
});

// Получаем текущую локаль
const { locale } = useI18n();

// Загружаем проекты для главной страницы с учетом локали
const { loadFeaturedProjects, refreshProjects } = useProjects();

// Используем computed для реактивности при изменении локали
const { data: projects, refresh } = await useAsyncData(
	() => `featured-projects-${locale.value}`,
	() => loadFeaturedProjects(locale.value)
);

// Следим за изменением локали и обновляем проекты
watch(locale, async (newLocale) => {
	await refreshProjects(newLocale);
	await refresh();
});

// SEO для главной страницы
const { getPageSEO } = useSEO();
useHead(getPageSEO());

// Компоненты будут автоматически анимироваться через AnimatedSection
</script>

<style scoped>
.home-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

/* Дополнительные стили для плавности анимаций */
.home-page > * {
	will-change: transform, opacity;
}
</style>
