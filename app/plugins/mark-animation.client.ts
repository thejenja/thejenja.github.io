export default defineNuxtPlugin(() => {
	// Автоматическая анимация всех mark элементов при загрузке страницы
	if (process.client) {
		// Ждём полной загрузки DOM
		onMounted(() => {
			// Небольшая задержка для полной загрузки контента
			setTimeout(() => {
				const marks = document.querySelectorAll("mark");
				if (marks.length > 0) {
					console.log(`Auto-animating ${marks.length} mark elements`);

					// Ступенчатая анимация
					marks.forEach((el, i) => {
						setTimeout(() => {
							el.classList.add("animate");
						}, i * 1000);
					});
				}
			}, 500);
		});
	}
});
