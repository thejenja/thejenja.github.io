<template>
	<div class="app" :class="{ dark: colorMode.value === 'dark' }">
		<!-- Прелоадер -->
		<Transition name="fade" appear>
			<Preloader
				v-if="isLoading"
				:progress="loadingProgress"
				:loading-text="loadingText"
			/>
		</Transition>

		<Navigation class="sidebar" />
		<!-- Плавная анимация между страницами -->
		<div class="container">
			<NuxtPage />
		</div>

		<Footer />

		<!-- Command Palette -->
		<CommandPalette />
	</div>
</template>

<script setup>
const { t } = useI18n();
const colorMode = useColorMode();
const { isLoading, loadingProgress, loadingText, simulateLoading } =
	usePreloader();
const { showPreloader: settingShowPreloader } = useAppSettings();
const { transitionName, getTransitionForRoute } = usePageTransitions();

// i18n SEO: canonical/hreflang + lang атрибут
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

// Отслеживаем изменения маршрута для выбора подходящей анимации
const router = useRouter();

router.beforeEach((to, from) => {
	const transitionType = getTransitionForRoute(to.path, from.path);
	transitionName.value = `page-${transitionType}`;
});

// Симулируем загрузку приложения
onMounted(() => {
	if (settingShowPreloader.value) {
		simulateLoading([
			{ text: t("preloader.steps.initApp"), duration: 200 },
			{ text: t("preloader.steps.loadComponents"), duration: 300 },
			{ text: t("preloader.steps.prepareInterface"), duration: 200 },
			{ text: t("preloader.steps.almostReady"), duration: 100 },
		]);
	}

	// Принудительный показ прелоадера
	document.addEventListener("app:show-preloader", () => {
		simulateLoading([
			{ text: t("preloader.steps.init"), duration: 200 },
			{ text: t("preloader.steps.load"), duration: 300 },
			{ text: t("preloader.steps.ready"), duration: 150 },
		]);
	});
});
</script>

<style scoped>
/* ===== Fade для прелоадера ===== */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
