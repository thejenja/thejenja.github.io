<template>
	<section class="links">
		<h2>
			{{ $t("links.title") }}
			<Link />
		</h2>

		<div class="tabs">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				class="tab-button"
				:class="{ active: activeTab === tab.id }"
				:style="{ '--tab-color': tab.color }"
				@click="setActiveTab(tab.id)"
			>
				<component :is="tab.icon" v-if="tab.icon" :size="12" />
				{{ tab.label }}
			</button>
		</div>

		<div ref="linksContainer" class="links-content">
			<div class="links-grid-container">
				<TransitionGroup name="slide" tag="div" class="links-grid">
					<div
						v-for="link in currentLinks"
						:key="`${activeTab}-${link.id}`"
						class="link-item"
					>
						<a
							v-if="!link.popovertarget"
							ref="linkRefs"
							:href="link.url"
							target="_blank"
							:rel="link.rel || 'noopener noreferrer'"
							class="link-button"
							:class="{
								favorite: activeTab === 'favorites',
								[link.label.toLowerCase()]: true,
							}"
							:style="{ background: link.color }"
							:data-tooltip="link.label"
						>
							<component
								:is="link.icon"
								v-if="link.iconType !== 'svg'"
								:size="36"
								:style="{ fill: 'white' }"
							/>
							<SvgIcon v-else :src="link.icon" :size="36" />
						</a>
						<button
							v-else
							:popovertarget="link.popovertarget"
							class="link-button"
							:class="{
								favorite: activeTab === 'favorites',
								[link.label.toLowerCase()]: true,
							}"
							:style="{ background: link.color }"
							:data-tooltip="link.label"
						>
							<component
								:is="link.icon"
								v-if="link.iconType !== 'svg'"
								:size="36"
								:style="{ fill: 'white' }"
							/>
							<SvgIcon v-else :src="link.icon" :size="36" />
						</button>
					</div>
				</TransitionGroup>
			</div>
		</div>

		<!-- TON Space Popover -->
		<div id="ton" popover class="ton-popover">
			<div class="popover-content">
				<button
					class="close-button"
					popovertarget="ton"
					popovertargetaction="hide"
				>
					<X />
				</button>

				<!-- Цветная шапка -->
				<div class="project-header" style="background: #0098ea">
					<div class="project-logo">
						<div class="project-icon-large">
							<SvgIcon src="/icons/ton.svg" :size="36" />
						</div>
					</div>
					<div class="gradient-mask"></div>
				</div>

				<!-- Контент -->
				<div class="project-content-wrapper">
					<h2 class="project-title">TON Space</h2>
					<p class="project-description">
						{{ $t("links.supportProject") }}
					</p>

					<div class="ton-qr-container">
						<div class="ton-qr-code">
							<SvgIcon src="/images/qr-code.png" :size="120" />
						</div>
						<div class="ton-address-info">
							<p class="ton-address-label">
								{{ $t("links.donateAddress") }}
							</p>
							<div class="ton-address-container">
								<code class="ton-address"
									>UQBTXoCxBrXdcDyeo14xbpEt7kgtShT-1GWeWmSuwkkG2lL-</code
								>
								<button
									@click="
										copyToClipboard(
											'UQBTXoCxBrXdcDyeo14xbpEt7kgtShT-1GWeWmSuwkkG2lL-'
										)
									"
									class="ton-copy-btn"
									:title="$t('links.copyAddress')"
								>
									<Copy :size="16" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import {
	ref,
	computed,
	onMounted,
	onUnmounted,
	defineComponent,
	h,
	nextTick,
	watch,
} from "vue";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import {
	DribbbleIcon,
	GitHubIcon,
	CodePenIcon,
	XIcon,
	YouTubeIcon,
	VkIcon,
	StackOverflowIcon,
	MastodonIcon,
	MediumIcon,
	BehanceIcon,
	TwitchIcon,
	TikTokIcon,
} from "vue3-simple-icons";
import { Star, Copy, X, Link } from "lucide-vue-next";

// Компонент для отображения SVG иконок
const SvgIcon = defineComponent({
	name: "SvgIcon",
	props: {
		src: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			default: 24,
		},
	},
	setup(props) {
		return () =>
			h("img", {
				src: props.src,
				width: props.size,
				height: props.size,
				alt: "icon",
			});
	},
});

const activeTab = ref("all");
const linksContainer = ref(null);
const linkRefs = ref([]);
let tippyInstances = [];
let tippySingleton = null;

const { t } = useI18n();

const tabs = [
	{
		id: "favorites",
		label: t("links.favorites"),
		color: "#fbbf24",
		icon: Star,
	},
	{ id: "all", label: t("links.all"), color: "#8b5cf6" },
	{ id: "social", label: t("links.social"), color: "#3b82f6" },
	{ id: "code", label: t("links.code"), color: "#10b981" },
	{ id: "design", label: t("links.design"), color: "#f59e0b" },
	{ id: "donate", label: t("links.donate"), color: "#ef4444" },
	{ id: "alt", label: t("links.alt"), color: "#ec4899" },
];

// Массив избранных ссылок (только названия)
const favoriteLinks = ["Telegram", "DonationAlerts", "Behance", "GitHub"];

const allLinks = {
	social: [
		{
			id: 1,
			label: "YouTube",
			url: "https://www.youtube.com/@thejenja_",
			icon: YouTubeIcon,
			color: "#ff0000",
		},
		{
			id: 3,
			label: "X",
			url: "https://x.com/thejenja",
			icon: XIcon,
			color: "#000",
		},
		{
			id: 4,
			label: "Telegram",
			url: "https://t.me/thejenja",
			icon: "/icons/telegram-logo.svg",
			iconType: "svg",
			color: "#0088cc",
		},
		{
			id: 5,
			label: "VK",
			url: "https://vk.com/thejenja",
			icon: VkIcon,
			color: "#0d7eff",
		},
		{
			id: 6,
			label: "Twitch",
			url: "https://twitch.tv/thejenja",
			icon: TwitchIcon,
			color: "#9146ff",
		},
		{
			id: 7,
			label: "TikTok",
			url: "https://tiktok.com/@thejenja_",
			icon: TikTokIcon,
			color: "#000000",
		},
	],
	code: [
		{
			id: 1,
			label: "GitHub",
			url: "https://github.com/thejenja",
			icon: GitHubIcon,
			color: "#000000",
		},
		{
			id: 2,
			label: "CodePen",
			url: "https://codepen.io/thejenja",
			icon: CodePenIcon,
			color: "#000000",
		},
		{
			id: 3,
			label: "Stack Overflow",
			url: "https://stackoverflow.com/users/1234567890/thejenja",
			icon: StackOverflowIcon,
			color: "#f48024",
		},
		{
			id: 4,
			label: "UserStyles",
			url: "https://userstyles.world/user/thejenja",
			icon: "/icons/userstyles-logo.svg",
			iconType: "svg",
			color: "#1d1d1d",
		},
	],
	design: [
		{
			id: 1,
			label: "Behance",
			url: "https://www.behance.net/thejenja",
			icon: BehanceIcon,
			color: "#1769ff",
		},
		{
			id: 2,
			label: "Dribbble",
			url: "https://dribbble.com/thejenja",
			icon: DribbbleIcon,
			color: "#ea4c89",
		},
		{
			id: 3,
			label: "Figma",
			url: "https://www.figma.com/@thejenja",
			icon: "/icons/Figma-logo.svg",
			iconType: "svg",
			color: "#0e0e0e",
		},
		{
			id: 4,
			label: "Dprofile",
			url: "https://dprofile.ru/thejenja",
			icon: "/icons/dprofile-logo.svg",
			iconType: "svg",
			color: "#000",
		},
		{
			id: 4,
			label: "DSGners",
			url: "https://dsgners.ru/thejenja",
			icon: "/icons/dsgners-logo.svg",
			iconType: "svg",
			color: "#4772ff",
		},
	],
	donate: [
		{
			id: 1,
			label: "DonationAlerts",
			url: "https://donationalerts.com/r/thejenja",
			icon: "/icons/da.svg",
			iconType: "svg",
			color: "#f57d07",
		},
		{
			id: 2,
			label: "Boosty",
			url: "https://boosty.to/thejenja",
			icon: "/icons/boosty.svg",
			iconType: "svg",
			color: "#F15F2C",
		},
		{
			id: 3,
			label: "YooMoney",
			url: "https://yoomoney.ru/to/410019209648036",
			icon: "/icons/yoomoney.svg",
			iconType: "svg",
			color: "#8b3ffd",
		},
		{
			id: 4,
			label: "TON Space",
			popovertarget: "ton",
			icon: "/icons/ton.svg",
			iconType: "svg",
			color: "#0098EA",
		},
	],
	alt: [
		{
			id: 1,
			label: "Mastodon",
			url: "https://mastodon.ml/@thejenja",
			icon: MastodonIcon,
			color: "#8b5cf6",
			rel: "me",
		},
		{
			id: 3,
			label: "Medium",
			url: "https://medium.com/@thejenja",
			icon: MediumIcon,
			color: "#000000",
		},
	],
};

// Автоматически создаем раздел "all" из всех остальных разделов
const allLinksWithAll = computed(() => {
	const all = [];
	let idCounter = 1;

	// Собираем все ссылки из всех разделов
	Object.keys(allLinks).forEach((category) => {
		allLinks[category].forEach((link) => {
			all.push({
				...link,
				id: idCounter++,
				category, // добавляем информацию о категории для отладки
			});
		});
	});

	return {
		all,
		...allLinks,
	};
});

const currentLinks = computed(() => {
	if (activeTab.value === "favorites") {
		// Для вкладки "избранное" фильтруем ссылки по названиям
		return allLinksWithAll.value.all.filter((link) =>
			favoriteLinks.includes(link.label)
		);
	}
	return allLinksWithAll.value[activeTab.value] || [];
});

const setActiveTab = (tabId) => {
	activeTab.value = tabId;
};

// Инициализация Tippy с улучшенным Singleton
const initTippy = async () => {
	// Очищаем старые экземпляры
	cleanupTippy();

	await nextTick();

	const linkElements = document.querySelectorAll(".link-button[data-tooltip]");
	if (!linkElements.length) return;

	// Создаем тултипы для всех ссылок
	tippyInstances = Array.from(linkElements).map((el) =>
		tippy(el, {
			content: el.getAttribute("data-tooltip") || "",
			theme: "light",
			placement: "top",
			arrow: true,
			animation: false,
			duration: [0, 0],
			delay: [0, 0],
			appendTo: () => document.body,
			zIndex: 9999,
			allowHTML: false,
			maxWidth: 240,
			offset: [0, 8],
			trigger: "mouseenter focus",
			hideOnClick: false,
		})
	);

	// Создаем singleton с плавным переходом между ссылками
	tippySingleton = tippy.createSingleton(tippyInstances, {
		delay: [300, 0], // Задержка показа 300ms, скрытие без задержки
		moveTransition: "transform 0.2s ease-out",
		overrides: ["placement", "offset", "theme"],
	});

	// Глобальные обработчики для UX
	addGlobalTippyHandlers();
};

// Функция очистки Tippy для предотвращения утечек памяти
const cleanupTippy = () => {
	if (tippySingleton) {
		tippySingleton.destroy();
		tippySingleton = null;
	}
	tippyInstances.forEach((instance) => instance.destroy());
	tippyInstances = [];
};

// Глобальные обработчики для улучшенного UX
const addGlobalTippyHandlers = () => {
	// Обработчик для клавиши Escape - скрывает все тултипы
	const handleEscape = (e) => {
		if (e.key === "Escape" && tippySingleton) {
			tippySingleton.hideAll();
		}
	};

	// Обработчик для клика вне тултипов - скрывает все тултипы
	const handleClickOutside = (e) => {
		if (tippySingleton && !e.target.closest(".tippy-box")) {
			tippySingleton.hideAll();
		}
	};

	// Обработчик для изменения размера окна - скрывает все тултипы
	const handleResize = () => {
		if (tippySingleton) {
			tippySingleton.hideAll();
		}
	};

	// Добавляем обработчики
	document.addEventListener("keydown", handleEscape);
	document.addEventListener("click", handleClickOutside);
	window.addEventListener("resize", handleResize);

	// Сохраняем ссылки на обработчики для очистки
	window._tippyHandlers = {
		handleEscape,
		handleClickOutside,
		handleResize,
	};
};

// Удаление глобальных обработчиков для очистки памяти
const removeGlobalTippyHandlers = () => {
	if (window._tippyHandlers) {
		const { handleEscape, handleClickOutside, handleResize } =
			window._tippyHandlers;
		document.removeEventListener("keydown", handleEscape);
		document.removeEventListener("click", handleClickOutside);
		window.removeEventListener("resize", handleResize);
		delete window._tippyHandlers;
	}
};

// Дополнительные функции для управления тултипами
const _showAllTooltips = () => {
	if (tippySingleton) {
		tippySingleton.showAll();
	}
};

const _hideAllTooltips = () => {
	if (tippySingleton) {
		tippySingleton.hideAll();
	}
};

// Функция для обновления контента тултипа
const _updateTooltipContent = (elementId, newContent) => {
	const instance = tippyInstances.find(
		(inst) => inst.reference.id === elementId
	);
	if (instance) {
		instance.setContent(newContent);
	}
};

// Функция для принудительного обновления позиции всех тултипов
const _refreshTooltipPositions = () => {
	if (tippySingleton) {
		tippySingleton.hideAll();
		setTimeout(() => {
			tippyInstances.forEach((instance) => {
				if (instance.state.isVisible) {
					instance.show();
				}
			});
		}, 100);
	}
};

// Простая функция копирования в буфер обмена
const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text);
		// Можно добавить уведомление об успешном копировании
	} catch {
		// console.error("Ошибка копирования:", err);
		// Fallback для старых браузеров
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("copy");
		document.body.removeChild(textArea);
	}
};

// Улучшенная функция инициализации с проверкой состояния
const initTippyWithState = async () => {
	try {
		await initTippy();

		// Добавляем обработчик для изменения видимости элементов
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting && tippySingleton) {
						// Скрываем тултип если элемент не виден
						tippySingleton.hideAll();
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Наблюдаем за всеми ссылками
		document.querySelectorAll(".link-button").forEach((link) => {
			observer.observe(link);
		});

		// Сохраняем observer для очистки
		window._tippyObserver = observer;
	} catch {
		// console.warn("Ошибка инициализации Tippy:", error);
	}
};

// Обновляем тултипы при смене активной вкладки
watch(
	() => activeTab.value,
	() => {
		// Добавляем небольшую задержку для завершения анимации
		setTimeout(() => {
			initTippyWithState();
		}, 350); // Увеличиваем задержку до 350ms для завершения анимации
	}
);

onMounted(() => {
	initTippyWithState();
});

onUnmounted(() => {
	cleanupTippy();
	removeGlobalTippyHandlers();

	// Очищаем observer
	if (window._tippyObserver) {
		window._tippyObserver.disconnect();
		delete window._tippyObserver;
	}
});
</script>

<style scoped>
.tabs {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
}

.tab-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-grow: 1;
	justify-content: center;
	background: color-mix(in srgb, var(--tab-color), var(--bg) 80%);
	color: var(--text);
	text-transform: lowercase;
	padding: 0.5rem 1rem;
	border-radius: 12px;
	corner-shape: superellipse(1.5);
	font-size: 1rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	border: 2px solid transparent;
}

.tab-button:hover {
	color: color-mix(in srgb, var(--tab-color), var(--text) 25%);
}

.tab-button:active {
	transform: scale(0.95);
}

.tab-button.active {
	background: color-mix(in srgb, var(--tab-color), var(--bg) 65%);
	color: color-mix(in srgb, var(--tab-color), var(--text) 25%);
	border-color: color-mix(in srgb, var(--tab-color), var(--text) 25%);
}

.links-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 1rem;
	align-items: start;
	justify-items: center;
	position: relative;
}

@media (max-width: 768px) {
	.links-grid {
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	}
}

.link-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
}

/* Общие стили для всех link-button (a и button) */
.link-button {
	width: 100%;
	height: 64px;
	border-radius: 12px;
	corner-shape: superellipse(1.5);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	text-decoration: none;
	transition: all 0.3s ease;
	border: none;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

/* Правильные стили для TransitionGroup анимаций */
.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s ease;
}

.slide-enter-from {
	opacity: 0;
	transform: translateY(20px) scale(0.9);
}

.slide-leave-to {
	opacity: 0;
	transform: translateY(-20px) scale(0.9);
}

.slide-move {
	transition: transform 0.3s ease;
}

/* Убираем position: absolute для leave-active, который вызывает проблемы */
.slide-leave-active {
	position: relative;
	z-index: 0;
}

/* Предотвращаем растягивание элементов во время анимации */
.slide-enter-active .link-item,
.slide-leave-active .link-item {
	width: 100%;
	max-width: 120px;
}

/* Обеспечиваем плавность анимации без скачков размеров */
.links-grid {
	contain: layout style;
}

/* Мобильная адаптация для анимаций */
@media (max-width: 768px) {
	.slide-enter-active .link-item,
	.slide-leave-active .link-item {
		max-width: 100px;
	}
}

.link-button:hover {
	transform: translateY(-4px);
}

.link-button:active {
	transform: translateY(-1px);
}

/* Стили для button элементов (TON Space) */
.link-button[type="button"] {
	background: none;
	font-family: inherit;
	font-size: inherit;
}

.link-button[type="button"]:hover {
	transform: scale(1.05) translateY(-2px);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.link-button[type="button"]:active {
	transform: scale(0.95);
}

.tiktok svg,
.tiktok {
	filter: drop-shadow(0 0 0 transparent);
	transition: filter 0.3s ease;
}

.tiktok:hover svg,
.tiktok:hover {
	filter: drop-shadow(-2px -2px 0 #25f4ee) drop-shadow(2px 2px 0 #ff3353fc);
}

.link-button svg,
.link-button img {
	transition: all 0.3s ease;
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.link-button,
	.link-button::before {
		transition: none;
	}

	.link-button:hover,
	.link-button:active {
		transform: none;
		box-shadow: none;
	}
}

/* TON Popover стили */
/* Нативный popover стили */
[popover] {
	background: transparent;
	border: none;
	padding: 0;
	margin: auto;
	max-width: 500px;
	overflow: visible;
}

::backdrop {
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(10px);
}

.ton-popover {
	background: var(--bg);
	border: 2px solid var(--border);
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	max-width: 400px;
	width: 90vw;
}

.popover-content {
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 16px;
	overflow: hidden;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	max-height: 80vh;
	display: flex;
	flex-direction: column;
	position: relative;
}

.close-button {
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: var(--bg-secondary);
	color: var(--text);
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 0.5rem;
	transition: background 0.3s ease;
	z-index: 10;
}

.close-button:hover {
	background: var(--bg-tertiary);
}

.project-header {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem 0;
	position: relative;
	overflow: hidden;
	border-radius: 12px 12px 0 0;
	height: 100px;
}

.project-logo {
	position: relative;
	z-index: 2;
}

.project-icon-large {
	font-size: 3rem;
	font-weight: bold;
	color: white;
	text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.gradient-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(0deg, var(--bg-secondary) 0%, transparent 100%);
	z-index: 1;
}

.project-content-wrapper {
	padding: 2rem;
	text-align: center;
}

.project-title {
	margin: 0 0 0.5rem 0;
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text);
}

.project-description {
	margin: 0 0 1.5rem 0;
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.ton-qr-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	margin-bottom: 1.5rem;
}

.ton-qr-code {
	width: 200px;
	height: 200px;
	border: 2px solid var(--border);
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #0098ea, #0066cc);
	overflow: hidden;
}

.ton-qr-code img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.ton-address-info {
	width: 100%;
	text-align: center;
}

.ton-address-label {
	margin: 0 0 0.5rem 0;
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.ton-address-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: var(--bg-secondary);
	border-radius: 8px;
	padding: 0.75rem;
	border: 1px solid var(--border);
}

.ton-address {
	font-family: "Courier New", monospace;
	font-size: 0.8rem;
	color: var(--text);
	word-break: break-all;
	flex: 1;
}

.ton-copy-btn {
	background: var(--bg-tertiary);
	border: none;
	border-radius: 6px;
	padding: 0.5rem;
	cursor: pointer;
	transition: all 0.2s ease;
	color: var(--text);
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 32px;
	height: 32px;
}

.ton-copy-btn:hover {
	background: var(--bg-secondary);
	transform: scale(1.05);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
	[popover] {
		max-width: 95vw;
	}

	.project-content-wrapper {
		padding: 1.5rem;
	}

	.project-title {
		font-size: 1.25rem;
	}
}

@media (max-width: 480px) {
	.ton-popover {
		width: 95vw;
		margin: 1rem;
	}

	.popover-content {
		padding: 1rem;
	}

	.ton-qr-code {
		width: 100px;
		height: 100px;
	}

	.ton-address {
		font-size: 0.7rem;
	}
}

/* Современные CSS анимации для popover */
[popover] {
	transition:
		opacity 0.4s ease,
		transform 0.4s ease,
		overlay 0.4s ease allow-discrete,
		display 0.4s ease allow-discrete;
}

/* Анимация появления */
[popover]:popover-open {
	opacity: 1;
	transform: scale(1) translateY(0);
}

/* Начальное состояние */
@starting-style {
	[popover]:popover-open {
		opacity: 0;
		transform: scale(0.9) translateY(-20px);
	}
}

/* Анимация исчезновения */
[popover]:not(:popover-open) {
	opacity: 0;
	transform: scale(0.9) translateY(-20px);
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	[popover] {
		transition: none;
	}

	[popover]:popover-open,
	[popover]:not(:popover-open) {
		transform: none;
	}
}
</style>
