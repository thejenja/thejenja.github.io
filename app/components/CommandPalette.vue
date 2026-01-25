<template>
	<Teleport to="body">
		<div v-if="bsodActive" class="bsod-overlay" @click="disableBSOD">
			<div class="bsod-content">
				<div class="bsod-face">:(</div>
				<div class="bsod-text">
					Your PC ran into a problem and needs to restart. We're just collecting
					some error info, and then we'll restart for you.
					<br /><br />
					0% complete
					<br /><br />
					<small>Stop code: CRITICAL_PROCESS_DIED</small>
				</div>
			</div>
		</div>

		<Transition name="fade">
			<button
				v-if="!isOpen && isMobile && !bsodActive"
				class="mobile-fab"
				@click="open"
			>
				<CommandIcon class="w-6 h-6" />
			</button>
		</Transition>

		<Transition name="fade">
			<div v-if="isOpen" class="cmd-backdrop" @click="close" />
		</Transition>

		<Transition name="slide-up">
			<div v-if="isOpen" class="cmd-modal" role="dialog">
				<div class="cmd-search-wrapper">
					<SearchIcon class="cmd-search-icon" />
					<input
						ref="inputRef"
						v-model="query"
						class="cmd-input"
						type="text"
						:placeholder="placeholderText"
						@keydown.down.prevent="move(1)"
						@keydown.up.prevent="move(-1)"
						@keydown.enter.prevent="runSelected"
						@keydown.esc.prevent="close"
						autocomplete="off"
					/>
					<div v-if="query" class="cmd-clear" @click="query = ''">
						<XIcon class="w-4 h-4" />
					</div>
				</div>

				<div class="cmd-list" role="listbox">
					<div
						v-for="(cmd, idx) in filtered"
						:key="cmd.id"
						:class="[
							'cmd-item',
							{ selected: idx === selectedIndex, 'danger-item': cmd.danger },
						]"
						@click="run(cmd)"
						@mousemove="selectedIndex = idx"
					>
						<div class="cmd-item-icon" :class="{ 'spin-hover': cmd.spin }">
							<component :is="cmd.icon" stroke-width="2" />
						</div>

						<div class="cmd-item-content">
							<div class="cmd-item-title">
								{{ cmd.title }}
								<span v-if="cmd.tag" :class="['cmd-tag', cmd.tagColor]">{{
									cmd.tag
								}}</span>
							</div>
							<div v-if="cmd.subtitle" class="cmd-item-subtitle">
								{{ cmd.subtitle }}
							</div>
						</div>

						<div v-if="cmd.shortcut" class="cmd-item-shortcut">
							{{ cmd.shortcut }}
						</div>
					</div>

					<div v-if="filtered.length === 0" class="cmd-empty">
						<GhostIcon class="w-8 h-8 opacity-50 mb-2" />
						<span>{{
							$t("commandPalette.notFound") || "Ничего не найдено..."
						}}</span>
					</div>
				</div>

				<div class="cmd-footer">
					<div class="cmd-footer-left">
						<span v-if="activeEffects.length > 0" class="active-effects">
							Active: {{ activeEffects.join(", ") }}
						</span>
					</div>
					<div class="cmd-key-group">
						<span class="cmd-key">Esc</span>
						<span class="label">Close</span>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import {
	Command as CommandIcon,
	Search as SearchIcon,
	X as XIcon,
	Home,
	Briefcase,
	Moon,
	Sun,
	Languages,
	Terminal,
	Zap,
	RotateCw,
	Move,
	Calculator,
	Bug,
	MonitorX,
	Music,
	FlipHorizontal,
	GhostIcon,
} from "lucide-vue-next";

// Состояние
const isOpen = ref(false);
const query = ref("");
const selectedIndex = ref(0);
const inputRef = ref(null);
const isMobile = ref(false);
const bsodActive = ref(false);
const activeEffects = ref([]); // Список активных эффектов для отображения

const router = useRouter();
const colorMode = useColorMode();
const { locale, setLocale, t } = useI18n();

// Placeholder меняется если включен режим "Инцидент 31 августа"
const placeholderText = computed(() => {
	return activeEffects.value.includes("BrokenLocales")
		? "cmd.input_placeholder_render_text"
		: t("commandPalette.placeholder") || "Type a command...";
});

// --- Утилиты ---

function showNotification(message, icon = "✨") {
	const el = document.createElement("div");
	el.className = "toast-notification";
	el.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
	document.body.appendChild(el);
	requestAnimationFrame(() => el.classList.add("show"));
	setTimeout(() => {
		el.classList.remove("show");
		setTimeout(() => el.remove(), 300);
	}, 3000);
}

function checkMobile() {
	isMobile.value = window.innerWidth <= 768;
}

// --- Логика Эффектов ---

// Сброс всего
const resetReality = () => {
	document.body.style = "";
	document.body.classList.remove(
		"matrix-mode",
		"gravity-mode",
		"mirror-mode",
		"barrel-roll-active",
	);

	// Восстанавливаем тексты для 31 августа
	if (window._originalTexts) {
		window._originalTexts.forEach(({ node, text }) => {
			node.textContent = text;
		});
		window._originalTexts = null;
	}

	bsodActive.value = false;
	activeEffects.value = [];
	showNotification("Reality restored", "😌");
};

// Barrel Roll (Исправленный)
const triggerBarrelRoll = () => {
	if (document.body.classList.contains("barrel-roll-active")) return;

	document.body.classList.add("barrel-roll-active");
	showNotification("Do a Barrel Roll!", "✈️");

	// Автоматический сброс класса после завершения анимации
	setTimeout(() => {
		document.body.classList.remove("barrel-roll-active");
	}, 2000);
};

// Инцидент 31 августа (Broken Locales)
const triggerAug31 = () => {
	if (activeEffects.value.includes("BrokenLocales")) return;

	activeEffects.value.push("BrokenLocales");
	window._originalTexts = [];

	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: (node) => {
				// Игнорируем скрипты, стили и саму палитру
				if (
					node.parentElement.closest(".cmd-modal") ||
					node.parentElement.tagName === "SCRIPT" ||
					node.parentElement.tagName === "STYLE"
				) {
					return NodeFilter.FILTER_REJECT;
				}
				return node.textContent.trim().length > 0
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_REJECT;
			},
		},
	);

	let node;
	while ((node = walker.nextNode())) {
		window._originalTexts.push({ node, text: node.textContent });
		// Генерируем "ключ" из текста: "Привет мир" -> "common.privet_mir_label"
		const mockKey = node.textContent
			.trim()
			.slice(0, 10)
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "_");
		node.textContent = `loc.${mockKey}_undefined`;
	}

	showNotification("Localization service unavailable", "⚠️");
};

// 52 + 15 (Meme)
const triggerMemeMath = () => {
	showNotification("Wait, that's illegal...", "🧮");
	window.open("https://knowyourmeme.com/memes/52-15-67", "_blank");
};

// BSOD
const triggerBSOD = () => {
	bsodActive.value = true;
	// Авто выход через 5 секунд, если пользователь испугался
	setTimeout(() => {
		if (bsodActive.value) disableBSOD();
	}, 8000);
};

const disableBSOD = () => {
	bsodActive.value = false;
	showNotification("System recovered", "💻");
};

// Mirror Mode
const triggerMirror = () => {
	document.body.classList.toggle("mirror-mode");
	if (document.body.classList.contains("mirror-mode")) {
		activeEffects.value.push("Mirror");
	} else {
		activeEffects.value = activeEffects.value.filter((e) => e !== "Mirror");
	}
};

// --- Команды ---

const commands = computed(() => {
	const list = [
		// === Основное ===
		{
			id: "home",
			title: t("commandPalette.commands.goHome") || "Go Home",
			icon: Home,
			keywords: "home главная",
			action: () => router.push("/"),
		},
		{
			id: "projects",
			title: t("commandPalette.commands.goProjects") || "Projects",
			icon: Briefcase,
			keywords: "work projects проекты",
			action: () => router.push("/projects"),
		},
		{
			id: "theme",
			title: colorMode.preference === "dark" ? "Light Mode" : "Dark Mode",
			icon: colorMode.preference === "dark" ? Sun : Moon,
			keywords: "theme dark light тема",
			shortcut: "Ctrl+J",
			action: () =>
				(colorMode.preference =
					colorMode.preference === "dark" ? "light" : "dark"),
		},
		{
			id: "lang",
			title: locale.value === "ru" ? "English" : "Русский",
			icon: Languages,
			keywords: "lang ru en язык",
			action: () => setLocale(locale.value === "ru" ? "en" : "ru"),
		},

		// === Fun & Easter Eggs ===
		{
			id: "egg-barrel",
			title: "Barrel Roll",
			icon: RotateCw,
			tag: "Fun",
			tagColor: "tag-orange",
			keywords: "spin roll barrel бочка",
			spin: true,
			action: triggerBarrelRoll,
		},
		{
			id: "egg-matrix",
			title: "Matrix Mode",
			subtitle: "Wake up, Neo",
			icon: Terminal,
			tag: "Geek",
			tagColor: "tag-green",
			keywords: "matrix neo hack code матрица",
			action: () => {
				document.body.classList.add("matrix-mode");
				activeEffects.value.push("Matrix");
				showNotification("Follow the white rabbit", "🐰");
			},
		},
		{
			id: "egg-gravity",
			title: "Broken Gravity",
			icon: Move,
			tag: "Phys",
			tagColor: "tag-blue",
			keywords: "gravity fall newton физика падение",
			action: () => {
				document.body.classList.add("gravity-mode");
				activeEffects.value.push("Gravity");
				showNotification("Gravity: OFF", "🍎");
			},
		},
		{
			id: "egg-aug31",
			title: "August 31st Incident",
			subtitle: "Break localization keys",
			icon: Bug,
			tag: "Meme",
			tagColor: "tag-red",
			keywords: "bug i18n key localization locale 31 августа",
			danger: true,
			action: triggerAug31,
		},
		{
			id: "egg-bsod",
			title: "BSOD",
			subtitle: "Simulate system crash",
			icon: MonitorX,
			keywords: "windows crash error blue screen ошибка",
			danger: true,
			action: triggerBSOD,
		},
		{
			id: "egg-mirror",
			title: "Mirror World",
			icon: FlipHorizontal,
			keywords: "mirror flip reverse зеркало",
			action: triggerMirror,
		},
		{
			id: "egg-rick",
			title: "Never Gonna Give You Up",
			icon: Music,
			keywords: "rick roll never gonna music рикролл",
			action: () => {
				window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
			},
		},

		// === Reset ===
		{
			id: "reset",
			title: "Reset Reality",
			subtitle: "Fix everything",
			icon: Zap,
			keywords: "reset clear clean сброс вернуть",
			action: resetReality,
		},
	];

	// Динамическая пасхалка: Калькулятор 52+15
	// Проверяем, содержит ли запрос "52+15" или "52 + 15"
	if (query.value.replace(/\s/g, "") === "52+15") {
		list.unshift({
			id: "meme-math",
			title: "67",
			subtitle: "Wait, that's illegal...",
			icon: Calculator,
			tag: "Meme",
			tagColor: "tag-purple",
			keywords: "52 15 math",
			action: triggerMemeMath,
		});
	}

	return list;
});

const filtered = computed(() => {
	const q = query.value.trim().toLowerCase();
	if (!q) return commands.value;

	// Если пользователь ввел точный математический пример, не фильтруем, а показываем наш unshift результат первым
	if (q.replace(/\s/g, "") === "52+15") return commands.value;

	return commands.value.filter(
		(c) =>
			c.title.toLowerCase().includes(q) ||
			(c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
			(c.keywords && c.keywords.toLowerCase().includes(q)),
	);
});

// --- Lifecycle & Handlers ---

function open() {
	isOpen.value = true;
	selectedIndex.value = 0;
	nextTick(() => inputRef.value?.focus());
}

function close() {
	isOpen.value = false;
	setTimeout(() => {
		query.value = "";
	}, 200);
}

function move(delta) {
	if (!filtered.value.length) return;
	selectedIndex.value =
		(selectedIndex.value + delta + filtered.value.length) %
		filtered.value.length;
	// Авто-скролл
	const el = document.querySelector(".cmd-item.selected");
	el?.scrollIntoView({ block: "nearest" });
}

function run(cmd) {
	close();
	cmd.action?.();
}

function runSelected() {
	if (filtered.value.length > 0) run(filtered.value[selectedIndex.value]);
}

function onKeydown(e) {
	if (
		["INPUT", "TEXTAREA"].includes(e.target.tagName) ||
		e.target.isContentEditable
	)
		return;

	if (
		((e.ctrlKey || e.metaKey) &&
			["k", "j", "/"].includes(e.key.toLowerCase())) ||
		e.key === "F1"
	) {
		e.preventDefault();
		open();
	}
}

onMounted(() => {
	document.addEventListener("keydown", onKeydown);
	window.addEventListener("resize", checkMobile);
	checkMobile();
});

onUnmounted(() => {
	document.removeEventListener("keydown", onKeydown);
	window.removeEventListener("resize", checkMobile);
	resetReality(); // Очистка при размонтировании
});

defineExpose({ open, close });
</script>

<style>
@keyframes barrelRoll {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.barrel-roll-active {
	animation: barrelRoll 1s ease-in-out;
}

.matrix-mode {
	filter: invert(1) hue-rotate(120deg) contrast(1.5);
	background: black !important;
	font-family: "Courier New", monospace !important;
}

.gravity-mode body > *:not(.cmd-modal):not(.cmd-backdrop) {
	transition: transform 1s ease-in;
	transform: translateY(100vh) rotate(20deg);
}

.mirror-mode {
	transform: scaleX(-1);
}

.toast-notification {
	position: fixed;
	bottom: 30px;
	left: 50%;
	transform: translateX(-50%) translateY(20px);
	background: rgba(15, 23, 42, 0.9);
	color: white;
	padding: 10px 24px;
	border-radius: 50px;
	display: flex;
	gap: 12px;
	align-items: center;
	font-weight: 500;
	opacity: 0;
	transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	z-index: 10000;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.1);
}
.toast-notification.show {
	opacity: 1;
	transform: translateX(-50%) translateY(0);
}
</style>

<style scoped>
:root {
	--cmd-bg: rgba(255, 255, 255, 0.7);
	--cmd-border: rgba(0, 0, 0, 0.08);
	--cmd-text: #1a1a1a;
	--cmd-sub: #666;
	--cmd-select: rgba(0, 0, 0, 0.05);
}

.dark .cmd-modal {
	--cmd-bg: rgba(10, 10, 10, 0.7);
	--cmd-border: rgba(255, 255, 255, 0.1);
	--cmd-text: #f0f0f0;
	--cmd-sub: #888;
	--cmd-select: rgba(255, 255, 255, 0.1);
}

.bsod-overlay {
	position: fixed;
	inset: 0;
	background: #0078d7;
	color: white;
	z-index: 99999;
	display: flex;
	align-items: center;
	padding: 10%;
	font-family: "Segoe UI", sans-serif;
	cursor: pointer;
}
.bsod-face {
	font-size: 8rem;
	margin-bottom: 2rem;
}
.bsod-text {
	font-size: 1.5rem;
	line-height: 1.5;
}

.cmd-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(4px);
	z-index: 3000;
}

.cmd-modal {
	position: fixed;
	top: 15vh;
	left: 50%;
	transform: translateX(-50%);
	width: 90%;
	max-width: 600px;
	background: var(--cmd-bg);
	backdrop-filter: blur(24px) saturate(180%);
	-webkit-backdrop-filter: blur(24px) saturate(180%);
	border: 1px solid var(--cmd-border);
	border-radius: 16px;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	color: var(--cmd-text);
	z-index: 3001;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.cmd-search-wrapper {
	display: flex;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid var(--cmd-border);
}
.cmd-search-icon {
	width: 20px;
	color: var(--cmd-sub);
	margin-right: 12px;
}
.cmd-input {
	flex: 1;
	background: transparent;
	border: none;
	font-size: 1.1rem;
	color: var(--cmd-text);
	outline: none;
}
.cmd-clear {
	cursor: pointer;
	color: var(--cmd-sub);
	padding: 4px;
}

.cmd-list {
	max-height: 350px;
	overflow-y: auto;
	padding: 8px;
}
.cmd-list::-webkit-scrollbar {
	width: 4px;
}
.cmd-list::-webkit-scrollbar-thumb {
	background: var(--cmd-border);
	border-radius: 4px;
}

.cmd-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.1s;
}
.cmd-item.selected {
	background: var(--cmd-select);
}
.cmd-item.danger-item:hover .cmd-item-title {
	color: #ef4444;
}

.cmd-item-icon {
	color: var(--cmd-sub);
	display: flex;
	align-items: center;
}
.cmd-item.selected .cmd-item-icon {
	color: var(--cmd-text);
}
.spin-hover:hover {
	animation: spin 1s linear infinite;
}
@keyframes spin {
	100% {
		transform: rotate(360deg);
	}
}

.cmd-item-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.cmd-item-title {
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 8px;
}
.cmd-item-subtitle {
	font-size: 0.8rem;
	color: var(--cmd-sub);
}

.cmd-tag {
	font-size: 0.65rem;
	padding: 2px 6px;
	border-radius: 4px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}
.tag-orange {
	background: rgba(249, 115, 22, 0.15);
	color: #f97316;
}
.tag-green {
	background: rgba(34, 197, 94, 0.15);
	color: #22c55e;
}
.tag-red {
	background: rgba(239, 68, 68, 0.15);
	color: #ef4444;
}
.tag-blue {
	background: rgba(59, 130, 246, 0.15);
	color: #3b82f6;
}
.tag-purple {
	background: rgba(168, 85, 247, 0.15);
	color: #a855f7;
}

.cmd-item-shortcut {
	font-size: 0.75rem;
	color: var(--cmd-sub);
	background: var(--cmd-border);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
}
.cmd-empty {
	padding: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: var(--cmd-sub);
}

.cmd-footer {
	padding: 8px 16px;
	background: var(--cmd-select);
	border-top: 1px solid var(--cmd-border);
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.75rem;
}
.active-effects {
	color: #ef4444;
	font-weight: 600;
	font-family: monospace;
}
.cmd-key-group {
	display: flex;
	align-items: center;
	gap: 6px;
	color: var(--cmd-sub);
}
.cmd-key {
	background: var(--cmd-bg);
	border: 1px solid var(--cmd-border);
	border-radius: 4px;
	padding: 2px 6px;
	min-width: 20px;
	text-align: center;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.slide-up-enter-active {
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
	transition: all 0.2s ease-in;
}
.slide-up-enter-from {
	opacity: 0;
	transform: translateX(-50%) scale(0.95) translateY(10px);
}
.slide-up-leave-to {
	opacity: 0;
	transform: translateX(-50%) scale(0.95) translateY(10px);
}

.mobile-fab {
	position: fixed;
	bottom: 24px;
	right: 24px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background: var(--bg-tertiary);
	color: var(--text);
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 25px var(--bg-quaternary);
	z-index: 2000;
}
</style>
