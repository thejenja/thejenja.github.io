export const useMarkAnimation = () => {
	// Пошаговая анимация подсветки <mark>
	const animateMarks = (
		rootElement: HTMLElement | null,
		delay: number = 1000
	) => {
		if (!rootElement) return;

		const marks = rootElement.querySelectorAll("mark");
		console.log(`Found ${marks.length} mark elements`);

		if (marks.length === 0) return;

		// Сброс перед повторным запуском
		marks.forEach((el) => el.classList.remove("animate"));

		// Ступенчатая задержка
		marks.forEach((el, i) => {
			setTimeout(() => {
				console.log(`Animating mark ${i + 1}`);
				el.classList.add("animate");
			}, i * delay);
		});
	};

	// Анимация всех mark элементов на странице
	const animateAllMarks = (delay: number = 1000) => {
		const marks = document.querySelectorAll("mark");
		console.log(`Found ${marks.length} mark elements globally`);

		if (marks.length === 0) return;

		// Сброс перед повторным запуском
		marks.forEach((el) => el.classList.remove("animate"));

		// Ступенчатая задержка
		marks.forEach((el, i) => {
			setTimeout(() => {
				console.log(`Animating global mark ${i + 1}`);
				el.classList.add("animate");
			}, i * delay);
		});
	};

	return {
		animateMarks,
		animateAllMarks,
	};
};
