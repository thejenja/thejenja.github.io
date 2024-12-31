/*
На старых версиях сайта, я вручную писал цвета при наведении, а сейчас подумал
НАПИШУ-КА В ЧАТГПТ КАК ЭТО МОЖНО УПРОСТИТЬ))))
*/

document.querySelectorAll(".btns a").forEach((element) => {
	element.addEventListener("mouseover", () => {
		// Получаем id элемента и создаем имя CSS-переменной
		const socialColor = getComputedStyle(
			document.documentElement
		).getPropertyValue(`--${element.id}`);
		if (socialColor) {
			element.style.backgroundColor = socialColor;
		}
	});

	element.addEventListener("mouseout", () => {
		// Убираем цвет фона при уходе курсора
		element.style.backgroundColor = "";
	});
});

// Выбираем все элементы списка
document.querySelectorAll(".tag-list li").forEach((item) => {
	// Получаем текстовое содержимое элемента
	const tagName = item.textContent.trim();

	// Создаем имя класса на основе текста, чтобы избежать пробелов и символов
	const className = `tag-${tagName.toLowerCase().replace(/\s+/g, "-")}`;

	// Присваиваем созданный класс элементу
	item.classList.add(className);

	// Создаем CSS правило для этого класса
	const style = document.createElement("style");
	style.textContent = `
      .${className} {
          color: var(--${tagName.toLowerCase()});
      }
  `;
	document.head.appendChild(style);
});
