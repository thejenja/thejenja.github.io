import { ref, onMounted, onUnmounted } from "vue";

export function useAnimationPreferences() {
	const prefersReducedMotion = ref(false);

	const checkPreferences = () => {
		// Проверяем настройки пользователя по анимациям
		prefersReducedMotion.value = window.matchMedia(
			"(prefers-reduced-motion: reduce"
		).matches;
	};

	const shouldAnimate = (
		animationType: "basic" | "complex" | "decorative" = "basic"
	) => {
		if (prefersReducedMotion.value) {
			return false;
		}
		return true;
	};

	const getAnimationDuration = (baseDuration: number) => {
		if (!shouldAnimate("basic")) {
			return 0;
		}
		return baseDuration;
	};

	const getStaggerDelay = (baseDelay: number) => {
		if (!shouldAnimate("basic")) {
			return 0;
		}
		return baseDelay;
	};

	onMounted(() => {
		checkPreferences();

		// Слушаем изменения настроек
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce");
		mediaQuery.addEventListener("change", checkPreferences);

		// Очистка при размонтировании
		onUnmounted(() => {
			mediaQuery.removeEventListener("change", checkPreferences);
		});
	});

	return {
		prefersReducedMotion,
		shouldAnimate,
		getAnimationDuration,
		getStaggerDelay,
	};
}
