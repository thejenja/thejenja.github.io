// app/plugins/command-palette-global.client.ts
export default defineNuxtPlugin(() => {
	// Глобальный обработчик клавиш для CommandPalette
	function onGlobalKeydown(e: KeyboardEvent) {
		// Проверяем, не печатает ли пользователь в input/textarea
		const target = e.target as HTMLElement;
		if (
			target &&
			(target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable)
		) {
			return;
		}

		// Комбинация Ctrl/Cmd + K (работает при любой раскладке)
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
			e.preventDefault();
			// Отправляем событие для открытия CommandPalette
			document.dispatchEvent(new CustomEvent("command-palette:open"));
			return;
		}

		// Комбинация Ctrl/Cmd + Shift + P (альтернатива)
		if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
			e.preventDefault();
			document.dispatchEvent(new CustomEvent("command-palette:open"));
			return;
		}

		// Комбинация Ctrl/Cmd + J (еще одна альтернатива)
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
			e.preventDefault();
			document.dispatchEvent(new CustomEvent("command-palette:open"));
			return;
		}

		// Символ "/" (работает при любой раскладке)
		if (e.key === "/" || e.key === "?" || e.key === "\\") {
			e.preventDefault();
			document.dispatchEvent(new CustomEvent("command-palette:open"));
			return;
		}

		// Комбинация Alt + / (для пользователей с AltGr)
		if (e.altKey && (e.key === "/" || e.key === "?")) {
			e.preventDefault();
			document.dispatchEvent(new CustomEvent("command-palette:open"));
			return;
		}

		// Комбинация F1 (классическая клавиша помощи)
		if (e.key === "F1") {
			e.preventDefault();
			document.dispatchEvent(new CustomEvent("command-palette:open"));
			return;
		}

		// Комбинация Ctrl/Cmd + / (еще одна альтернатива)
		if ((e.ctrlKey || e.metaKey) && e.key === "/") {
			e.preventDefault();
			document.dispatchEvent(new CustomEvent("command-palette:open"));
			return;
		}
	}

	// Добавляем глобальный обработчик
	document.addEventListener("keydown", onGlobalKeydown);

	// Очищаем при размонтировании
	onUnmounted(() => {
		document.removeEventListener("keydown", onGlobalKeydown);
	});
});
