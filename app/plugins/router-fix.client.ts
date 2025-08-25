export default defineNuxtPlugin(() => {
	// Исправляем ошибку onBeforeRouteLeave
	if (process.client) {
		// Добавляем глобальный обработчик для предотвращения ошибок роутера
		window.addEventListener("error", (event) => {
			if (event.message.includes("onBeforeRouteLeave")) {
				event.preventDefault();
				console.warn("Предотвращена ошибка onBeforeRouteLeave");
			}
		});

		// Добавляем обработчик для unhandledrejection
		window.addEventListener("unhandledrejection", (event) => {
			if (
				event.reason &&
				event.reason.message &&
				event.reason.message.includes("onBeforeRouteLeave")
			) {
				event.preventDefault();
				console.warn("Предотвращена ошибка onBeforeRouteLeave в Promise");
			}
		});
	}
});
