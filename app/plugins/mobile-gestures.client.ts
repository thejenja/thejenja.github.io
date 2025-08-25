// app/plugins/mobile-gestures.client.ts
export default defineNuxtPlugin(() => {
	let touchStartY = 0;
	let touchStartTime = 0;

	// Обработчик для свайпа вниз с верхнего края экрана
	function onTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
		touchStartTime = Date.now();
	}

	function onTouchMove(e: TouchEvent) {
		const touchY = e.touches[0].clientY;
		const touchTime = Date.now();
		const deltaY = touchY - touchStartY;
		const deltaTime = touchTime - touchStartTime;

		// Если свайп вниз с верхнего края экрана (в пределах 100px от верха)
		if (touchStartY < 100 && deltaY > 50 && deltaTime < 500) {
			e.preventDefault();
		}
	}

	function onTouchEnd(e: TouchEvent) {
		const touchY = e.changedTouches[0].clientY;
		const touchTime = Date.now();
		const deltaY = touchY - touchStartY;
		const deltaTime = touchTime - touchStartTime;

		// Если свайп вниз с верхнего края экрана
		if (touchStartY < 100 && deltaY > 50 && deltaTime < 500) {
			// Отправляем событие для открытия CommandPalette
			document.dispatchEvent(new CustomEvent("command-palette:open"));
		}
	}

	// Добавляем обработчики только на мобильных устройствах
	if ("ontouchstart" in window) {
		document.addEventListener("touchstart", onTouchStart, { passive: false });
		document.addEventListener("touchmove", onTouchMove, { passive: false });
		document.addEventListener("touchend", onTouchEnd, { passive: true });

		// Очищаем при размонтировании
		onUnmounted(() => {
			document.removeEventListener("touchstart", onTouchStart);
			document.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("touchend", onTouchEnd);
		});
	}
});
