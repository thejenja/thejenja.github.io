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
	gap: 1rem;
}

/* Дополнительные стили для плавности анимаций */
.home-page > * {
	will-change: transform, opacity;
}

/* Стили для секции тестирования */
.test-section {
	text-align: center;
	padding: 2rem;
	background: var(--bg-secondary);
	border-radius: 12px;
	margin: 2rem auto;
	max-width: 800px;
}

.test-section h2 {
	font-size: 1.5rem;
	margin-bottom: 1.5rem;
	color: var(--text);
}

.test-links {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
}

.test-link {
	display: inline-block;
	padding: 0.75rem 1.5rem;
	background: var(--accent);
	color: white;
	text-decoration: none;
	border-radius: 8px;
	transition: all 0.3s ease;
	font-weight: 500;
}

.test-link:hover {
	background: var(--accent-hover, #4f46e5);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
