<template>
	<div
		class="app"
		:class="{
			dark: colorMode.value === 'dark',
			'full-width-app': isProjectPage,
		}"
	>
		<Navigation class="sidebar" />

		<div
			class="container"
			:class="{ 'full-width-container': isProjectPage }"
			role="main"
		>
			<NuxtPage />
		</div>

		<Footer />

		<CommandPalette />
	</div>
</template>

<script setup>
import { computed } from "vue";
const colorMode = useColorMode();
const route = useRoute(); // Получаем текущий маршрут
const { transitionName, getTransitionForRoute } = usePageTransitions();

// Проверяем, находится ли пользователь на странице проекта
// Обычно имя маршрута для [slug].vue это 'projects-slug' (или 'projects-slug___en' для i18n)
const isProjectPage = computed(() => {
	return route.name && route.name.toString().includes("projects-slug");
});

const i18nHead = useLocaleHead({
	addDirAttribute: true,
	identifierAttribute: "id",
	seo: true,
});

useHead(() => ({
	htmlAttrs: {
		lang: i18nHead.value.htmlAttrs?.lang,
		...(i18nHead.value.htmlAttrs?.dir
			? { dir: i18nHead.value.htmlAttrs.dir }
			: {}),
	},
	link: [...(i18nHead.value.link || [])],
	meta: [...(i18nHead.value.meta || [])],
}));

const router = useRouter();

router.beforeEach((to, from) => {
	const transitionType = getTransitionForRoute(to.path, from.path);
	transitionName.value = `page-${transitionType}`;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
