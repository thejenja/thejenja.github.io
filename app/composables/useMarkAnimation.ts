export const useMarkAnimation = () => {
	// Пошаговая анимация подсветки <mark>
	const animateMarks = (
		rootElement: HTMLElement | null,
		delay: number = 1000
	) => {
		if (!rootElement) return;

		const marks = rootElement.querySelectorAll("mark");

		if (marks.length === 0) return;

		// Сброс перед повторным запуском
		marks.forEach((el) => el.classList.remove("animate"));

		// Ступенчатая задержка
		marks.forEach((el, i) => {
			setTimeout(() => {
				el.classList.add("animate");
			}, i * delay);
		});
	};

	return {
		animateMarks,
	};
};
