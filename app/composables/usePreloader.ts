import { ref } from "vue";

export function usePreloader() {
	const isLoading = ref(true);
	const loadingProgress = ref(0);
	const loadingText = ref("Загрузка...");

	const hidePreloader = () => {
		isLoading.value = false;
	};

	const showPreloader = () => {
		isLoading.value = true;
		loadingProgress.value = 0;
	};

	// Упрощенная симуляция загрузки
	const simulateLoading = async (
		steps: { text: string; duration: number }[] = []
	) => {
		showPreloader();

		const defaultSteps = [
			{ text: "Инициализация...", duration: 400 },
			{ text: "Загрузка ресурсов...", duration: 600 },
			{ text: "Подготовка интерфейса...", duration: 500 },
			{ text: "Почти готово...", duration: 300 },
		];

		const loadingSteps = steps.length > 0 ? steps : defaultSteps;

		for (const [index, step] of loadingSteps.entries()) {
			loadingText.value = step.text;
			loadingProgress.value = ((index + 1) / loadingSteps.length) * 100;
			await new Promise((resolve) => setTimeout(resolve, step.duration));
		}

		// Финальная задержка перед скрытием
		setTimeout(() => {
			hidePreloader();
		}, 500);
	};

	return {
		isLoading,
		loadingProgress,
		loadingText,
		hidePreloader,
		showPreloader,
		simulateLoading,
	};
}
