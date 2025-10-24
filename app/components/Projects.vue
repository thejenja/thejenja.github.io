<template>
	<section class="projects">
		<div class="projects-header">
			<h2 class="projects-title">{{ $t("projects.title") }}</h2>
			<NuxtLink to="/projects" class="show-more-button">
				<BriefcaseBusiness />
				{{ $t("projects.showMore") }}
			</NuxtLink>
		</div>

		<!-- Контент с анимированной загрузкой -->
		<ContentLoader
			:is-loading="pending"
			:skeleton-count="3"
			skeleton-variant="project"
		>
			<TimelineProjects :projects="projects || []" :compact="true" :limit="3" />
		</ContentLoader>
	</section>
</template>

<script setup lang="ts">
import { BriefcaseBusiness } from "lucide-vue-next";
import TimelineProjects from "~/components/TimelineProjects.vue";


const { loadFeaturedProjects, refreshProjects } = useProjects();

// Получаем текущую локаль
const { locale } = useI18n();

// Используем computed для реактивности при изменении локали
const {
	data: projects,
	pending,
	refresh,
} = await useAsyncData(
	() => `projects-${locale.value}`,
	() => loadFeaturedProjects(locale.value)
);

// Следим за изменением локали и обновляем проекты
watch(locale, async (newLocale) => {
	await refreshProjects(newLocale);
	await refresh();
});
</script>

<style scoped>
.projects-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}

.show-more-button {
	background: var(--bg-tertiary);
	color: var(--text);
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 8px;
	font-size: 0.875rem;
	font-weight: 500;
	text-decoration: none;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: all 0.3s ease;
	cursor: pointer;
}

.show-more-button:hover {
	background: var(--bg-tertiary);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
