import { ref } from "vue";

export function usePageTransitions() {
	const transitionName = ref("page");

	const { shouldAnimate } = useAnimationPreferences();

	const startTransition = () => {
		// Простая логика для начала перехода
	};

	const endTransition = () => {
		// Простая логика для окончания перехода
	};

	// Предустановленные переходы для разных маршрутов
	const getTransitionForRoute = (to: string, from: string) => {
		if (!shouldAnimate("basic")) {
			return "none";
		}

		// Главная страница - fade
		if (to === "/" || from === "/") {
			return "fade";
		}

		// Проекты - slide
		if (to.includes("/projects") || from.includes("/projects")) {
			return "slide";
		}

		// По умолчанию - slide
		return "slide";
	};

	return {
		transitionName,
		startTransition,
		endTransition,
		getTransitionForRoute,
	};
}
