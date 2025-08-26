// app/plugins/devtools-messages.client.ts
export default defineNuxtPlugin(() => {
	if (import.meta.client && import.meta.dev) {
		// Массив забавных сообщений
		const messages = [
			"Так, что ты здесь забыл?",
			"Смотришь исходный код? Хороший выбор!",
			"Используется Nuxt 4 и современные веб-технологии",
			"Поддерживает темную и светлую темы",
			"Оптимизировано для производительности",
			"Здесь нет секретов, только любовь к коду",
		];

		// Функция для вывода сообщений в консоль
		const logDevMessage = () => {
			const randomMessage =
				messages[Math.floor(Math.random() * messages.length)];

			console.log(
				`%c${randomMessage}`,
				"background: linear-gradient(45deg, #ac86cb66 0%, #c78e9e66 100%); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;"
			);
		};

		// Выводим сообщение при загрузке страницы
		logDevMessage();

		// Выводим сообщение при нажатии F12
		document.addEventListener("keydown", (e) => {
			if (e.key === "F12") {
				setTimeout(logDevMessage, 100);
			}
		});

		// Выводим сообщение при нажатии Ctrl+Shift+I (Cmd+Option+I на Mac)
		document.addEventListener("keydown", (e) => {
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
				setTimeout(logDevMessage, 100);
			}
		});

		// Выводим сообщение при нажатии Ctrl+Shift+C (Cmd+Option+C на Mac)
		document.addEventListener("keydown", (e) => {
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
				setTimeout(logDevMessage, 100);
			}
		});

		// Пасхалка при нажатии Ctrl+U (Cmd+U на Mac)
		document.addEventListener("keydown", (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "u") {
				logDevMessage();
				console.log(
					`%cПасхалка! Ты нашел секретную комбинацию клавиш!`,
					"background: linear-gradient(45deg, #ac86cb66 0%, #c78e9e66 100%); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;"
				);
			}
		});

		// Пасхалка при правом клике
		document.addEventListener("contextmenu", () => {
			logDevMessage();
			console.log(
				`%cПравый клик! Ты тоже знаешь секреты!`,
				"background: linear-gradient(45deg, #ac86cb66 0%, #c78e9e66 100%); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;"
			);
		});
	}
});
