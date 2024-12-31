/*
Из-за того что девтулс)) не позволяет проверять свойства в постоянно меняющемся DOM, я решил сгенерить какое-то решение

НО ВОТ БЕДА, никаких нормальных вариантов кроме

1. Скрипт, определяющий резкую смену размера экрана
    А если у меня оконный DevTools он ничего не сделает))

2. Готовая либа
    Хорошая попытка, но после того что она постоянно чистит консоль, а я планировал через console.log пасхалки оставить - вариант плохой

*/

import devtools from "/scripts/devtools.js";

// Check if it's open
console.log("Is DevTools open:", devtools.isOpen);

// Check it's orientation, `undefined` if not open
console.log("DevTools orientation:", devtools.orientation);

// Get notified when it's opened/closed or orientation changes
window.addEventListener("devtoolschange", (event) => {
	console.log("Is DevTools open:", event.detail.isOpen);
	console.log("DevTools orientation:", event.detail.orientation);
	document.getElementById("gradient").remove();
});
