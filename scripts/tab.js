/*
Определяем в какой секции находимся, фиксим неприятный скроллбар в #start
Да, тоже чатгпт
*/

document.addEventListener("DOMContentLoaded", function () {
	const sections = document.querySelectorAll("section");
	const navLinks = document.querySelectorAll(".nav-link");
	const main = document.querySelector("main");

	// Обработчик пересечения секций с областью видимости
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Добавляем класс .visible для активации анимации
					entry.target.classList.add("visible");

					// Обновляем активную ссылку в меню
					navLinks.forEach((link) => link.classList.remove("active"));
					const activeLink = document.querySelector(
						`.nav-link[href="#${entry.target.id}"]`
					);
					if (activeLink) activeLink.classList.add("active");

					// Изменяем цвет скроллбара для секции #start
					if (entry.target.id === "start") {
						main.classList.add("active-scrollbar");
					} else {
						main.classList.remove("active-scrollbar");
					}
				} else {
					// Убираем класс .visible, если секция покидает видимость
					entry.target.classList.remove("visible");
				}
			});
		},
		{ threshold: 0.5 }
	);

	// Наблюдаем за каждой секцией и добавляем класс анимации
	sections.forEach((section) => {
		section.classList.add("section-animation"); // добавляем базовый класс для анимации
		observer.observe(section);
	});

	// Добавляем обработчик на якорные ссылки
	navLinks.forEach((link) => {
		link.addEventListener("click", (event) => {
			// Отключаем scroll-snap перед переходом по якорю
			main.style.scrollSnapType = "none";

			// Ждём завершения прокрутки, после чего включаем scroll-snap обратно
			setTimeout(() => {
				main.style.scrollSnapType = "y mandatory";
			}, 1000); // Можно подкорректировать тайминг
		});
	});
});
