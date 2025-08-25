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
			<Transition
				:name="transitionName"
				mode="out-in"
				appear
				@before-enter="startTransition"
				@after-enter="endTransition"
				@before-leave="startTransition"
			>
				<NuxtPage />
			</Transition>
		</div>

		<Footer />

		<!-- Command Palette -->
		<CommandPalette />
	</div>
</template>

<script setup>
import ProgressiveBlur from "./components/ProgressiveBlur.vue";

const { t } = useI18n();
const colorMode = useColorMode();
const { isLoading, loadingProgress, loadingText, simulateLoading } =
	usePreloader();
const { showPreloader: settingShowPreloader } = useAppSettings();
const {
	transitionName,
	startTransition,
	endTransition,
	getTransitionForRoute,
} = usePageTransitions();

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
/* ===== Анимации страниц ===== */

/* Базовая анимация страниц */
.page-enter-active,
.page-leave-active {
	transition:
		opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
		transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
	opacity: 0;
	transform: translateY(20px);
}
.page-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

/* Fade переход */
.page-fade-enter-active,
.page-fade-leave-active {
	transition: opacity 0.3s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
	opacity: 0;
}

/* Slide переход */
.page-slide-enter-active,
.page-slide-leave-active {
	transition:
		opacity 0.4s ease,
		transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-enter-from {
	opacity: 0;
	transform: translateX(30px);
}
.page-slide-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}

/* Scale переход */
.page-scale-enter-active,
.page-scale-leave-active {
	transition:
		opacity 0.4s ease,
		transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-scale-enter-from {
	opacity: 0;
	transform: scale(0.95);
}
.page-scale-leave-to {
	opacity: 0;
	transform: scale(1.05);
}

/* ===== Fade для прелоадера ===== */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.page-enter-active,
	.page-leave-active,
	.page-fade-enter-active,
	.page-fade-leave-active,
	.page-slide-enter-active,
	.page-slide-leave-active,
	.page-scale-enter-active,
	.page-scale-leave-active {
		transition: none;
	}

	.page-enter-from,
	.page-leave-to,
	.page-fade-enter-from,
	.page-fade-leave-to,
	.page-slide-enter-from,
	.page-slide-leave-to,
	.page-scale-enter-from,
	.page-scale-leave-to {
		opacity: 1;
		transform: none;
	}
}
</style>
