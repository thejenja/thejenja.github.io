<template>
	<section class="links" role="region" aria-labelledby="links-title">
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

		<div class="links-content">
			<div class="links-grid-container">
				<!-- Добавляем ref для управления высотой и класс для CSS transition высоты -->
				<div ref="gridContainer" class="links-grid">
					<transition
						:name="transitionName"
						mode="out-in"
						@before-leave="onBeforeLeave"
						@leave="onLeave"
						@enter="onEnter"
						@after-enter="onAfterEnter"
					>
						<div :key="activeTab" class="links-grid-container-inner">
							<div
								v-for="(link, index) in currentLinks"
								:key="`${activeTab}-${link.id}`"
								class="link-item"
								:style="getRowBasedAnimationStyle(index)"
							>
								<!-- Ссылка -->
								<a
									v-if="!link.popovertarget"
									:href="link.url"
									target="_blank"
									:rel="link.rel || 'noopener noreferrer'"
									class="link-button"
									:class="{
										favorite: activeTab === 'favorites',
										[link.label.toLowerCase()]: true,
									}"
									:style="{ background: link.color }"
								>
									<div class="icon-wrapper">
										<component
											:is="link.icon"
											v-if="link.iconType !== 'svg'"
											:size="36"
											:style="{ fill: 'white' }"
										/>
										<SvgIcon v-else :src="link.icon" :size="36" />
									</div>
									<span class="link-label">{{ link.label }}</span>
								</a>

								<!-- Кнопка Popover -->
								<button
									v-else
									:popovertarget="link.popovertarget"
									class="link-button"
									:class="{
										favorite: activeTab === 'favorites',
										[link.label.toLowerCase()]: true,
									}"
									:style="{ background: link.color }"
								>
									<div class="icon-wrapper">
										<component
											:is="link.icon"
											v-if="link.iconType !== 'svg'"
											:size="36"
											:style="{ fill: 'white' }"
										/>
										<SvgIcon v-else :src="link.icon" :size="36" />
									</div>
									<span class="link-label">{{ link.label }}</span>
								</button>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>

		<!-- Popover (без изменений) -->
		<div id="ton" popover class="ton-popover">
			<div class="popover-content">
				<button
					class="close-button"
					popovertarget="ton"
					popovertargetaction="hide"
				>
					<X />
				</button>
				<div class="project-header" style="background: #0098ea">
					<div class="project-logo">
						<div class="project-icon-large">
							<SvgIcon src="/icons/ton.svg" :size="36" />
						</div>
					</div>
					<div class="gradient-mask" />
				</div>
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
									class="ton-copy-btn"
									@click="
										copyToClipboard(
											'UQBTXoCxBrXdcDyeo14xbpEt7kgtShT-1GWeWmSuwkkG2lL-'
										)
									"
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
import { ref, computed, defineComponent, h } from "vue";
import {
	DribbbleIcon,
	GitHubIcon,
	CodePenIcon,
	XIcon,
	YouTubeIcon,
	VkIcon,
	MastodonIcon,
	MediumIcon,
	BehanceIcon,
	TwitchIcon,
	TikTokIcon,
	BlueskyIcon,
	ThreadsIcon,
} from "vue3-simple-icons";
import { Star, Copy, X, Link } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

// Компонент для отображения SVG иконок
const SvgIcon = defineComponent({
	name: "SvgIcon",
	props: {
		src: { type: String, required: true },
		size: { type: Number, default: 24 },
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
const gridContainer = ref(null);
const transitionName = ref("slide-next"); // Начальное направление
const { t } = useI18n();

const tabs = [
	{ id: "all", label: t("links.all"), color: "#8b5cf6" },
	{ id: "social", label: t("links.social"), color: "#3b82f6" },
	{ id: "code", label: t("links.code"), color: "#10b981" },
	{ id: "design", label: t("links.design"), color: "#f59e0b" },
	{ id: "donate", label: t("links.donate"), color: "#ef4444" },
	{ id: "alt", label: t("links.alt"), color: "#ec4899" },
];

// --- ЛОГИКА АНИМАЦИИ ВЫСОТЫ И СМЕНЫ ВКЛАДОК ---

// Установка активной вкладки с определением направления
const setActiveTab = (tabId) => {
	const oldIndex = tabs.findIndex((t) => t.id === activeTab.value);
	const newIndex = tabs.findIndex((t) => t.id === tabId);

	// Если индекс новой вкладки больше -> слайд справа налево (next)
	// Если меньше -> слайд слева направо (prev)
	transitionName.value = newIndex > oldIndex ? "slide-next" : "slide-prev";
	activeTab.value = tabId;
};

// 1. Перед уходом элемента фиксируем текущую высоту контейнера
const onBeforeLeave = (el) => {
	if (gridContainer.value) {
		gridContainer.value.style.height = `${gridContainer.value.offsetHeight}px`;
		// el.style.position = 'absolute'; // Опционально, для mode='in-out', но мы используем mode='out-in'
		// el.style.width = '100%';
	}
};

const onLeave = (el) => {
	// Здесь можно добавить дополнительную логику при необходимости
};

// 2. Когда новый элемент вставлен, вычисляем его высоту и анимируем контейнер
const onEnter = (el) => {
	if (gridContainer.value) {
		const container = gridContainer.value;

		// Сбрасываем высоту на auto, чтобы измерить новый контент
		const prevHeight = container.style.height;
		container.style.height = "auto";
		const targetHeight = getComputedStyle(container).height;

		// Возвращаем зафиксированную высоту для начала анимации
		container.style.height = prevHeight;

		// Форсируем перерисовку браузером (Repaint)
		// eslint-disable-next-line no-unused-expressions
		container.offsetHeight;

		// Анимируем к новой высоте
		requestAnimationFrame(() => {
			container.style.height = targetHeight;
		});
	}
};

// 3. После завершения анимации убираем жесткую высоту
const onAfterEnter = (el) => {
	if (gridContainer.value) {
		gridContainer.value.style.height = "auto";
	}
};

const getRowBasedAnimationStyle = (index) => {
	if (currentLinks.value.length <= 6) {
		return { "--animation-delay": `${index * 50}ms` };
	}
	return { "--animation-delay": "0ms" };
};

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
			id: 2,
			label: "VK",
			url: "https://vk.com/thejenja",
			icon: VkIcon,
			color: "#0d7eff",
		},
		{
			id: 3,
			label: "Twitch",
			url: "https://twitch.tv/thejenja",
			icon: TwitchIcon,
			color: "#9146ff",
		},
		{
			id: 4,
			label: "TikTok",
			url: "https://tiktok.com/@thejenja_",
			icon: TikTokIcon,
			color: "#000000",
		},
		{
			id: 5,
			label: "TenChat",
			url: "https://tenchat.ru/thejenja",
			icon: "/icons/tenchat.svg",
			iconType: "svg",
			color: "#fc3234",
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
			label: "DALink",
			url: "https://dalink.to/thejenja",
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
			id: 2,
			label: "Medium",
			url: "https://medium.com/@thejenja",
			icon: MediumIcon,
			color: "#000000",
		},
		{
			id: 3,
			label: "Bluesky",
			url: "https://bsky.app/profile/thejenja.bsky.social",
			icon: BlueskyIcon,
			color: "#1185fe",
		},
		{
			id: 4,
			label: "Threads",
			url: "https://www.threads.com/@thejenja_",
			icon: ThreadsIcon,
			color: "#0a0a0a",
		},
	],
};

const allLinksWithAll = computed(() => {
	const all = [];
	let idCounter = 1;
	Object.keys(allLinks).forEach((category) => {
		allLinks[category].forEach((link) => {
			all.push({ ...link, id: idCounter++, category });
		});
	});
	return { all, ...allLinks };
});

const currentLinks = computed(() => {
	if (activeTab.value === "favorites") {
		return allLinksWithAll.value.all.filter((link) =>
			favoriteLinks.includes(link.label)
		);
	}
	return allLinksWithAll.value[activeTab.value] || [];
});

const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("copy");
		document.body.removeChild(textArea);
	}
};
</script>

<style scoped>
.tabs {
	display: flex;
	gap: 0.5rem;
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
	font-size: 1.05rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	border: 0;
}

.tab-button:hover {
	color: color-mix(in srgb, var(--tab-color), var(--text) 25%);
}

.tab-button:active {
	transform: scale(0.95);
}

.tab-button.active {
	background: color-mix(in srgb, var(--tab-color), var(--text) 25%);
	color: color-mix(in srgb, var(--tab-color), var(--bg) 65%);
}

/* === Контейнер для анимации высоты === */
.links-grid {
	position: relative;
	/* Добавляем плавность для изменения высоты */
	transition: height 0.3s ease;
	min-height: 64px;
	contain: layout style;
}

.links-grid-container-inner {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 1rem;
	align-items: start;
	justify-items: center;
	width: 100%;
}

@media (max-width: 768px) {
	.links-grid-container-inner {
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

/* === Стили кнопок ссылок === */
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
	transition-delay: var(--animation-delay, 0ms);
	border: none;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

/* Смена иконки на текст */
.icon-wrapper {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(1);
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	opacity: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.link-label {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -40%);
	opacity: 0;
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	font-weight: 600;
	font-size: 1.25rem;
	text-align: center;
	width: 100%;
	pointer-events: none;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.link-button:hover .icon-wrapper {
	opacity: 0;
	transform: translate(-50%, -50%) scale(0.5);
}

.link-button:hover .link-label {
	opacity: 1;
	transform: translate(-50%, -50%);
}

.link-button:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.link-button:active {
	transform: translateY(-1px);
}

.link-button[type="button"] {
	background: none;
	font-family: inherit;
	font-size: inherit;
}

/* === Анимации переходов Slide Next/Prev === */

/* Общие стили для переходов */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
	transition: all 0.3s ease;
}

/* Slide Next (справа налево) */
/* Старый уходит влево */
.slide-next-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}
/* Новый приходит справа */
.slide-next-enter-from {
	opacity: 0;
	transform: translateX(30px);
}

/* Slide Prev (слева направо) */
/* Старый уходит вправо */
.slide-prev-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
/* Новый приходит слева */
.slide-prev-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
	.link-button,
	.link-button::before,
	.icon-wrapper,
	.link-label,
	.links-grid {
		transition: none !important;
	}

	.slide-next-enter-active,
	.slide-next-leave-active,
	.slide-prev-enter-active,
	.slide-prev-leave-active {
		transition: opacity 0.3s ease;
		transform: none;
	}

	.slide-next-leave-to,
	.slide-next-enter-from,
	.slide-prev-leave-to,
	.slide-prev-enter-from {
		opacity: 0;
		transform: none;
	}
}

/* Popover стили */
[popover] {
	background: transparent;
	border: none;
	padding: 0;
	margin: auto;
	max-width: 500px;
	overflow: visible;
	transition:
		opacity 0.4s ease,
		transform 0.4s ease,
		overlay 0.4s ease allow-discrete,
		display 0.4s ease allow-discrete;
}

[popover]:popover-open {
	opacity: 1;
	transform: scale(1) translateY(0);
}
@starting-style {
	[popover]:popover-open {
		opacity: 0;
		transform: scale(0.9) translateY(-20px);
	}
}
[popover]:not(:popover-open) {
	opacity: 0;
	transform: scale(0.9) translateY(-20px);
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
</style>
