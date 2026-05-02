<template>
	<div
		class="app"
		:class="{
			dark: colorMode.value === 'dark',
			'full-width-app': isProjectPage,
		}"
	>
		<Header />

		<div
			id="main-content"
			class="container"
			:class="{ 'full-width-container': isProjectPage }"
			role="main"
		>
			<div
				id="live-region"
				aria-live="polite"
				aria-atomic="true"
				class="sr-only"
			></div>
			<NuxtPage />
		</div>

		<Footer />
		<BottomBar />
	</div>
</template>

<script setup>
import { computed } from "vue";
import Header from "./components/UI/Header.vue";
import Footer from "./components/UI/Footer.vue";
import BottomBar from "./components/UI/BottomBar.vue";
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
			: {})
	},
	link: [
		...(i18nHead.value.link || []),
		{ rel: "canonical", href: `https://thejenja.github.io${route.path === "/" ? "" : route.path}` },
	],
	meta: [...(i18nHead.value.meta || [])]
}));

// Функция для отправки сообщений в live region (доступно глобально)
const announce = (message) => {
	const region = document.getElementById("live-region");
	if (region) {
		region.textContent = message;
		// Сброс через таймаут, чтобы скринридеры успели прочитать
		setTimeout(() => {
			region.textContent = "";
		}, 1000);
	}
};

// Для простоты добавим в window
if (typeof window !== "undefined") {
	window.$announce = announce;
}

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
