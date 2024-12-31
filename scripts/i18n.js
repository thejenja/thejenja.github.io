/*
Основной код взят с https://github.com/dazecoop/vanilla-js-i18n-translator/

Функция с кнопкой переключения языка сгенерирована в ChatGPT
*/

// List of available locales
const availableLocales = ["ru", "en"];

// Default locale.
const defaultLanguage = "en";

// Manually detect users' language, strip languages such as `en-GB` to just `en`.
let language = (
	window.navigator.userLanguage || window.navigator.language
).substr(0, 2);

// If `?lang=` exists in URL params & is valid, then use that instead.
const urlParams = new URLSearchParams(window.location.search);
const langFromUrl = urlParams.get("lang");
if (langFromUrl && availableLocales.includes(langFromUrl)) {
	language = langFromUrl;
}

// Set `pageLanguage` only if its available within our locales, otherwise default.
let pageLanguage = defaultLanguage;
if (availableLocales.includes(language)) {
	pageLanguage = language;
}

// Locale translations.
const locales = {
	// EN
	en: {
		header: {
			home: "Home",
			"about-me": "About me",
			donate: "Donate",
		},
		start: {
			hi: "hi, i'm",
			iam: "thejenja",
			"scroll-message": "Use the scroll to find out about me",
		},
		aboutme: {
			info: "A front-end developer focused on HTML, CSS, and JavaScript. I also contribute to translations on Hosted Weblate and Crowdin, make memes, post videos on TikTok, and experiment with AI.",
		},
		donate: {
			info: "If you enjoy my content, you can support me with a donation. Any amount helps me grow and create more. Thank you for your support!",
		},
	},

	// RU
	ru: {
		header: {
			home: "Главная",
			"about-me": "Обо мне",
			donate: "Донат",
		},
		start: {
			hi: "привет",
			iam: "я thejenja",
			"scroll-message": "Используй скролл, чтобы узнать обо мне",
		},
		aboutme: {
			info: "Фронтенд-разработчик с фокусом на HTML, CSS и JavaScript. Занимаюсь переводами на Hosted Weblate и Crowdin, делаю мемы, выкладываю ролики в TikTok и экспериментирую с нейросетями.",
		},
		donate: {
			info: "Если тебе нравится мой контент, ты можешь поддержать меня донатом. Любая сумма поможет мне развиваться и создавать больше интересного. Спасибо за поддержку!",
		},
	},
};

// Get all page elements to be translated.
const elements = document.querySelectorAll("[data-i18n]");

// Get JSON object of translations.
const json = locales[pageLanguage];

// On each element, found the translation from JSON file & update.
elements.forEach((element, index) => {
	const key = element.getAttribute("data-i18n");
	let text = key.split(".").reduce((obj, i) => (obj ? obj[i] : null), json);

	// Вот это кстати оч удобная штука, я так {age} прописывал, но до финала не дошло... вроде

	// Does this text have any variables? (eg {something})
	const variables = text.match(/{(.*?)}/g);
	if (variables) {
		// Iterate each variable in the text.
		variables.forEach((variable) => {
			// Filter all `data-*` attributes for this element to find the matching key.
			Object.entries(element.dataset).filter(([key, value]) => {
				if (`{${key}}` === variable) {
					try {
						// Attempt to run actual JavaScript code.
						text = text.replace(
							`${variable}`,
							new Function(`return (${value})`)()
						);
					} catch (error) {
						// Probably just static text replacement.
						text = text.replace(`${variable}`, value);
					}
				}
			});
		});
	}

	// Regular text replacement for given locale.
	element.innerHTML = text;
});

// Set <html> tag lang attribute.
const htmlElement = document.querySelector("html");
htmlElement.setAttribute("lang", pageLanguage);

// тут уже чатгпт начался

// Функция для смены языка
function toggleLanguage() {
	// Определяем следующий язык
	const newLanguage = pageLanguage === "en" ? "ru" : "en";

	// Обновляем параметр ?lang= в URL
	const url = new URL(window.location);
	url.searchParams.set("lang", newLanguage);
	window.history.pushState({}, "", url);

	// надо будет сгенерить динамическую смену, а то чёт перезагрузка - фу

	// Сохраняем новый язык и перезагружаем страницу
	location.reload();
}

// Присваиваем функцию переключения языка кнопке
document
	.getElementById("language-toggle")
	.addEventListener("click", toggleLanguage);
