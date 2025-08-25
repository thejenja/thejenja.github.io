<template>
	<Teleport to="body">
		<!-- Мобильная кнопка для открытия CommandPalette -->
		<button
			v-if="!isOpen && isMobile"
			class="mobile-cmd-button"
			@click="open"
			:title="$t('commandPalette.openHint')"
			aria-label="Open command palette"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
		</button>

		<div v-if="isOpen" class="cmd-overlay" @click="close" />
		<div v-if="isOpen" class="cmd-container" role="dialog" aria-modal="true">
			<div class="cmd-header">
				<input
					ref="inputRef"
					v-model="query"
					class="cmd-input"
					type="text"
					:placeholder="placeholder"
					@keydown.down.prevent="move(1)"
					@keydown.up.prevent="move(-1)"
					@keydown.enter.prevent="runSelected"
					@keydown.esc.prevent="close"
				/>
			</div>
			<div class="cmd-list" role="listbox">
				<div
					v-for="(cmd, idx) in filtered"
					:key="cmd.id"
					:class="['cmd-item', { selected: idx === selectedIndex }]"
					role="option"
					@click="run(cmd)"
				>
					<div class="cmd-title">{{ cmd.title }}</div>
					<div v-if="cmd.subtitle" class="cmd-subtitle">{{ cmd.subtitle }}</div>
				</div>
				<div v-if="filtered.length === 0" class="cmd-empty">
					{{ $t("commandPalette.notFound") }}
				</div>
			</div>
			<div class="cmd-footer">
				<div class="shortcuts-info">
					<span class="shortcut"> <kbd>Ctrl</kbd> + <kbd>K</kbd> </span>
					<span class="shortcut"> <kbd>Ctrl</kbd> + <kbd>J</kbd> </span>
					<span class="shortcut">
						<kbd>F1</kbd>
					</span>
					<span class="shortcut">
						<kbd>/</kbd>
					</span>
				</div>
				<div class="footer-hints">
					<span>/</span>
					<span>{{ $t("commandPalette.openHint") }}</span>
					<span>Esc</span>
					<span>{{ $t("commandPalette.closeHint") }}</span>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, readonly } from "vue";

const isOpen = ref(false);
const query = ref("");
const selectedIndex = ref(0);
const inputRef = ref(null);

// Определяем, является ли устройство мобильным
const isMobile = ref(false);

const router = useRouter();
const colorMode = useColorMode();
const { locale, setLocale } = useI18n();
const { showPreloader, togglePreloader } = useAppSettings();

// Функция для определения мобильного устройства
function checkMobile() {
	isMobile.value = window.innerWidth <= 768 || "ontouchstart" in window;
}

// Функция для показа уведомлений
function showNotification(message, type = "info") {
	// Создаем элемент уведомления
	const notification = document.createElement("div");
	notification.className = `notification notification-${type}`;
	notification.textContent = message;

	// Стили для уведомления
	Object.assign(notification.style, {
		position: "fixed",
		top: "20px",
		right: "20px",
		padding: "12px 20px",
		borderRadius: "8px",
		color: "white",
		fontWeight: "500",
		zIndex: "10000",
		transform: "translateX(100%)",
		transition: "transform 0.3s ease",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
	});

	// Цвета для разных типов уведомлений
	const colors = {
		success: "#10b981",
		info: "#3b82f6",
		warning: "#f59e0b",
		error: "#ef4444",
	};

	notification.style.backgroundColor = colors[type] || colors.info;

	// Добавляем в DOM
	document.body.appendChild(notification);

	// Показываем уведомление
	setTimeout(() => {
		notification.style.transform = "translateX(0)";
	}, 100);

	// Скрываем через 3 секунды
	setTimeout(() => {
		notification.style.transform = "translateX(100%)";
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300);
	}, 3000);
}

const placeholder = computed(() => $t("commandPalette.placeholder"));

const commands = computed(() => [
	{
		id: "nav-home",
		title: $t("commandPalette.commands.goHome"),
		keywords: "home главная",
		action: () => router.push("/"),
	},
	{
		id: "nav-projects",
		title: $t("commandPalette.commands.goProjects"),
		keywords: "projects проекты",
		action: () => router.push("/projects"),
	},
	{
		id: "theme-toggle",
		title: $t("commandPalette.commands.toggleTheme"),
		subtitle: $t("commandPalette.commands.themeCurrent", [
			colorMode.preference === "dark" ? $t("theme.dark") : $t("theme.light"),
		]),
		keywords: "theme тема dark light тёмная светлая",
		action: () => {
			const next = colorMode.preference === "dark" ? "light" : "dark";
			colorMode.preference = next;
		},
	},
	{
		id: "lang-ru",
		title: "Русский",
		subtitle:
			locale.value === "ru"
				? "Текущий"
				: $t("commandPalette.commands.switchToRussian"),
		keywords: "ru русский russian язык",
		action: () => setLocale("ru"),
	},
	{
		id: "lang-en",
		title: "English",
		subtitle:
			locale.value === "en"
				? "Current"
				: $t("commandPalette.commands.switchToEnglish"),
		keywords: "en english англ язык",
		action: () => setLocale("en"),
	},
	// Пасхалка: Brainrot En
	{
		id: "lang-brainrot",
		title: "Brainrot",
		subtitle: "Gen Z mode activated",
		keywords: "brainrot genz zoomer brain rot",
		action: () => {
			// Переключаемся на brainrot локализацию
			setLocale("brainrot");
			// Включаем специальные стили
			document.documentElement.setAttribute("data-brainrot", "true");
			// Показываем уведомление
			showNotification("Brainrot mode activated! 🤪", "success");
		},
	},
	// Пасхалка: Серость
	{
		id: "filter-grayscale",
		title: "Серость",
		subtitle: "filter: grayscale(100%)",
		keywords: "серость grayscale filter серая",
		action: () => {
			document.body.style.filter = "grayscale(100%)";
			showNotification("Серость активирована! 🌫️", "info");
		},
	},
	// Пасхалка: Где мои очки?
	{
		id: "filter-blur",
		title: "Где мои очки?",
		subtitle: "filter: blur(2px)",
		keywords: "очки blur filter размытие",
		action: () => {
			document.body.style.filter = "blur(2px)";
			showNotification("Очки потерялись! 👓", "warning");
		},
	},
	// Пасхалка: АААААА МОИ ГЛАЗА
	{
		id: "filter-contrast",
		title: "АААААА МОИ ГЛАЗА",
		subtitle: "filter: contrast(200%) brightness(150%)",
		keywords: "глаза contrast brightness filter контраст яркость",
		action: () => {
			document.body.style.filter = "contrast(200%) brightness(150%)";
			showNotification("АААААА МОИ ГЛАЗА! 😵‍💫", "error");
		},
	},
	// Пасхалка: Сброс фильтров
	{
		id: "filter-reset",
		title: "Вернуть нормально",
		subtitle: "Сбросить все фильтры и локализацию",
		keywords: "сброс reset filter нормально english",
		action: () => {
			document.body.style.filter = "";
			document.documentElement.removeAttribute("data-brainrot");
			// Возвращаемся к обычному English
			setLocale(locale.value === "en" ? "ru" : "en");
			showNotification("Back to normal English! 😌", "success");
		},
	},
	{
		id: "open-nav",
		title: $t("commandPalette.commands.openNavigation"),
		keywords: "menu навигация navigation",
		action: () => {
			const nav = document.getElementById("navigation");
			if (nav && nav.showPopover) nav.showPopover();
		},
	},
	{
		id: "open-source",
		title: $t("commandPalette.commands.openSource"),
		keywords: "github source код",
		action: () =>
			window.open("https://github.com/thejenja/thejenja.github.io", "_blank"),
	},
	{
		id: "preloader-toggle",
		title: $t("commandPalette.commands.preloaderToggle", [
			showPreloader.value
				? $t("commandPalette.commands.on")
				: $t("commandPalette.commands.off"),
		]),
		keywords: "preloader loading прелоадер",
		action: () => togglePreloader(),
	},
	{
		id: "preloader-show-now",
		title: $t("commandPalette.commands.preloaderShow"),
		keywords: "preloader show now",
		action: () => document.dispatchEvent(new CustomEvent("app:show-preloader")),
	},
]);

const filtered = computed(() => {
	const q = query.value.trim().toLowerCase();
	if (!q) return commands.value;
	return commands.value.filter(
		(c) =>
			c.title.toLowerCase().includes(q) ||
			(c.keywords && c.keywords.toLowerCase().includes(q))
	);
});

function open() {
	isOpen.value = true;
	selectedIndex.value = 0;
	nextTick(() => inputRef.value?.focus());
}

function close() {
	isOpen.value = false;
	query.value = "";
}

function move(delta) {
	if (!filtered.value.length) return;

	const newIndex =
		(selectedIndex.value + delta + filtered.value.length) %
		filtered.value.length;
	selectedIndex.value = newIndex;

	// Автоматический скролл к выбранному элементу
	nextTick(() => {
		const selectedElement = document.querySelector(".cmd-item.selected");
		const listContainer = document.querySelector(".cmd-list");

		if (selectedElement && listContainer) {
			// Проверяем, виден ли выбранный элемент
			const containerRect = listContainer.getBoundingClientRect();
			const elementRect = selectedElement.getBoundingClientRect();

			// Если элемент выше контейнера
			if (elementRect.top < containerRect.top) {
				selectedElement.scrollIntoView({
					block: "start",
					behavior: "smooth",
				});
			}
			// Если элемент ниже контейнера
			else if (elementRect.bottom > containerRect.bottom) {
				selectedElement.scrollIntoView({
					block: "end",
					behavior: "smooth",
				});
			}
		}
	});
}

function run(cmd) {
	close();
	cmd.action?.();
}

function runSelected() {
	if (!filtered.value.length) return;
	run(filtered.value[selectedIndex.value]);
}

function isTypingInInput(target) {
	const el = target;
	const tag = el.tagName;
	if (tag === "INPUT" || tag === "TEXTAREA") return true;
	if (el.isContentEditable) return true;
	return false;
}

function onKeydown(e) {
	// Проверяем, не печатает ли пользователь в input/textarea
	if (isTypingInInput(e.target)) return;

	// Комбинация Ctrl/Cmd + K (работает при любой раскладке)
	if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
		e.preventDefault();
		open();
		return;
	}

	// Комбинация Ctrl/Cmd + Shift + P (альтернатива)
	if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
		e.preventDefault();
		open();
		return;
	}

	// Комбинация Ctrl/Cmd + J (еще одна альтернатива)
	if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
		e.preventDefault();
		open();
		return;
	}

	// Символ "/" (работает при любой раскладке)
	if (e.key === "/" || e.key === "?" || e.key === "\\") {
		e.preventDefault();
		open();
		return;
	}

	// Комбинация Alt + / (для пользователей с AltGr)
	if (e.altKey && (e.key === "/" || e.key === "?")) {
		e.preventDefault();
		open();
		return;
	}

	// Комбинация F1 (классическая клавиша помощи)
	if (e.key === "F1") {
		e.preventDefault();
		open();
		return;
	}

	// Комбинация Ctrl/Cmd + / (еще одна альтернатива)
	if ((e.ctrlKey || e.metaKey) && e.key === "/") {
		e.preventDefault();
		open();
		return;
	}
}

// Функция для проверки, активен ли CommandPalette
function isCommandPaletteActive() {
	return isOpen.value;
}

// Экспортируем функции для использования в других компонентах
defineExpose({
	open,
	close,
	isOpen: readonly(isOpen),
	isCommandPaletteActive,
});

onMounted(() => {
	document.addEventListener("keydown", onKeydown);
	checkMobile(); // Инициализируем проверку мобильного устройства

	// Добавляем обработчик изменения размера окна
	window.addEventListener("resize", checkMobile);

	// Слушаем глобальные события для открытия CommandPalette
	document.addEventListener("command-palette:open", () => {
		if (!isOpen.value) {
			open();
		}
	});
});

onUnmounted(() => {
	document.removeEventListener("keydown", onKeydown);
	document.removeEventListener("command-palette:open", () => {});
	window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.cmd-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(2px);
	z-index: 3000;
}

.cmd-container {
	position: fixed;
	top: 10vh;
	left: 50%;
	transform: translateX(-50%);
	width: min(720px, 92vw);
	background: var(--bg-secondary);
	color: var(--text);
	border: 1px solid var(--border);
	border-radius: 12px;
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
	z-index: 3001;
	overflow: hidden;
	animation: fadeIn 0.12s ease-out;
}

.cmd-header {
	padding: 0.75rem;
	border-bottom: 1px solid var(--border);
}
.cmd-input {
	width: 100%;
	padding: 0.75rem 1rem;
	border-radius: 8px;
	border: 1px solid var(--border);
	background: var(--bg);
	color: var(--text);
	outline: none;
}

.cmd-list {
	max-height: 50vh;
	overflow: auto;
}
.cmd-item {
	padding: 0.75rem 1rem;
	cursor: pointer;
}
.cmd-item.selected {
	background: var(--bg-tertiary);
}
.cmd-title {
	font-weight: 600;
}
.cmd-subtitle {
	font-size: 0.85rem;
	color: var(--text-secondary);
}
.cmd-empty {
	padding: 1rem;
	color: var(--text-secondary);
}

.cmd-footer {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	justify-content: flex-end;
	padding: 0.5rem 0.75rem;
	border-top: 1px solid var(--border);
	font-size: 0.85rem;
	color: var(--text-secondary);
}

.shortcuts-info {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	font-size: 0.85rem;
	color: var(--text-secondary);
}

.shortcut {
	display: inline-flex;
	align-items: center;
	padding: 0.25rem 0.5rem;
	border: 1px solid var(--border);
	border-radius: 6px;
	background: var(--bg-tertiary);
	color: var(--text);
	font-family:
		"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
	font-size: 0.75rem;
	font-weight: 600;
	white-space: nowrap;
}

.footer-hints {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	font-size: 0.85rem;
	color: var(--text-secondary);
}

/* Стили для клавиш */
kbd {
	display: inline-block;
	padding: 0.2rem 0.4rem;
	margin: 0 0.1rem;
	font-family:
		"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
	font-size: 0.75rem;
	font-weight: 600;
	line-height: 1;
	color: var(--text);
	background-color: var(--bg);
	border: 1px solid var(--border);
	border-radius: 3px;
	box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

/* Адаптивность для footer */
@media (max-width: 768px) {
	.cmd-footer {
		flex-direction: column;
		gap: 0.75rem;
		align-items: stretch;
	}

	.shortcuts-info {
		justify-content: center;
		flex-wrap: wrap;
	}

	.footer-hints {
		justify-content: center;
	}
}

/* Мобильная кнопка CommandPalette */
.mobile-cmd-button {
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 56px;
	height: 56px;
	background: var(--bg-secondary);
	color: var(--text);
	border: none;
	border-radius: 50%;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	animation: mobile-button-float 3s ease-in-out infinite;
}

.mobile-cmd-button:hover {
	background: var(--bg-tertiary);
	transform: scale(1.1);
	box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.mobile-cmd-button:active {
	transform: scale(0.95);
}

@keyframes mobile-button-float {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-5px);
	}
}

/* Скрываем мобильную кнопку на десктопе */
@media (min-width: 769px) {
	.mobile-cmd-button {
		display: none;
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateX(-50%) translateY(-8px);
	}
	to {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}
}

/* Стили для уведомлений */
.notification {
	position: fixed;
	top: 20px;
	right: 20px;
	padding: 12px 20px;
	border-radius: 8px;
	color: white;
	font-weight: 500;
	z-index: 10000;
	transform: translateX(100%);
	transition: transform 0.3s ease;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification-success {
	background-color: #10b981;
}

.notification-info {
	background-color: #3b82f6;
}

.notification-warning {
	background-color: #f59e0b;
}

.notification-error {
	background-color: #ef4444;
}

/* Улучшенные стили для скролла */
.cmd-list {
	max-height: 50vh;
	overflow-y: auto;
	scrollbar-width: thin;
	scrollbar-color: var(--border) transparent;
}

.cmd-list::-webkit-scrollbar {
	width: 6px;
}

.cmd-list::-webkit-scrollbar-track {
	background: transparent;
}

.cmd-list::-webkit-scrollbar-thumb {
	background-color: var(--border);
	border-radius: 3px;
}

.cmd-list::-webkit-scrollbar-thumb:hover {
	background-color: var(--text-secondary);
}

/* Анимация для выбранного элемента */
.cmd-item {
	padding: 0.75rem 1rem;
	cursor: pointer;
	transition: all 0.2s ease;
	border-left: 3px solid transparent;
}

.cmd-item:hover {
	background: var(--bg-tertiary);
	border-left-color: var(--accent);
}

.cmd-item.selected {
	background: var(--bg-tertiary);
	border-left-color: var(--accent);
	box-shadow: 0 0 0 1px var(--accent);
}

@media (prefers-reduced-motion: reduce) {
	.cmd-container {
		animation: none;
	}

	.cmd-item {
		transition: none;
	}
}
</style>
