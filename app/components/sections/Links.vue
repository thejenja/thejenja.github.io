<template>
	<section class="links" role="region" aria-labelledby="links-title">
		<h2>
			{{ $t("links.title") }}
			<Icon name="mingcute:link-fill" />
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
				<Icon v-if="tab.icon" :name="tab.icon" :size="16" />
				{{ tab.label }}
			</button>
		</div>

		<div class="links-content">
			<div class="links-grid-container">
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
									:style="{ background: link.background || link.color }"
								>
									<div class="icon-wrapper">
										<Icon
											v-if="link.iconType !== 'svg'"
											:name="link.icon"
											:size="36"
											:style="{ fill: 'white' }"
										/>
										<SvgIcon v-else :src="link.icon" :size="36" />
									</div>
									<span class="link-label">{{ link.label }}</span>
								</a>

								<button
									v-else
									:popovertarget="link.popovertarget"
									class="link-button"
									:class="{
										favorite: activeTab === 'favorites',
										[link.label.toLowerCase()]: true,
									}"
									:style="{ background: link.background || link.color }"
								>
									<div class="icon-wrapper">
										<Icon
											v-if="link.iconType !== 'svg'"
											:name="link.icon"
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
	</section>
</template>

<script setup>
import { ref, computed, defineComponent, h } from "vue";
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
	{
		id: "all",
		label: t("links.all"),
		icon: "mingcute:grid-fill",
		color: "#8b5cf6",
	},
	{
		id: "code",
		label: t("links.code"),
		icon: "mingcute:code-fill",
		color: "#10b981",
	},
	{
		id: "design",
		label: t("links.design"),
		icon: "mingcute:palette-fill",
		color: "#f59e0b",
	},
	{
		id: "alt",
		label: t("links.alt"),
		icon: "mingcute:share-2-fill",
		color: "#ec4899",
	},
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
const onBeforeLeave = () => {
	if (gridContainer.value) {
		gridContainer.value.style.height = `${gridContainer.value.offsetHeight}px`;
	}
};

// 2. Когда новый элемент вставлен, вычисляем его высоту и анимируем контейнер
const onEnter = () => {
	if (gridContainer.value) {
		const container = gridContainer.value;

		// Сбрасываем высоту на auto, чтобы измерить новый контент
		const prevHeight = container.style.height;
		container.style.height = "auto";
		const targetHeight = getComputedStyle(container).height;

		// Возвращаем зафиксированную высоту для начала анимации
		container.style.height = prevHeight;

		// Форсируем перерисовку браузером (Repaint)
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		container.offsetHeight;

		// Анимируем к новой высоте
		requestAnimationFrame(() => {
			container.style.height = targetHeight;
		});
	}
};

// 3. После завершения анимации убираем жесткую высоту
const onAfterEnter = () => {
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
	code: [
		{
			id: 1,
			label: "GitHub",
			url: "https://github.com/thejenja",
			icon: "simple-icons:github",
			color: "#000",
		},
		{
			id: 2,
			label: "CodePen",
			url: "https://codepen.io/thejenja",
			icon: "mingcute:codepen-line",
			color: "#000",
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
			icon: "simple-icons:behance",
			color: "#1769ff",
		},
		{
			id: 2,
			label: "Dribbble",
			url: "https://dribbble.com/thejenja",
			icon: "simple-icons:dribbble",
			color: "#ea4c89",
		},
		{
			id: 3,
			label: "Figma",
			url: "https://www.figma.com/@thejenja",
			icon: "logos:figma",
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
	alt: [
		{
			id: 1,
			label: "Mastodon",
			url: "https://mastodon.ml/@thejenja",
			icon: "simple-icons:mastodon",
			color: "#6364ff",
			background: "linear-gradient(#6364ff 0%, #563ACC 100%)",
			rel: "me",
		},
		{
			id: 3,
			label: "Bluesky",
			url: "https://bsky.app/profile/thejenja.bsky.social",
			icon: "simple-icons:bluesky",
			color: "#1185fe",
		},
		{
			id: 4,
			label: "Threads",
			url: "https://www.threads.com/@thejenja_",
			icon: "simple-icons:threads",
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
			favoriteLinks.includes(link.label),
		);
	}
	return allLinksWithAll.value[activeTab.value] || [];
});
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
	border-radius: 16px;
	corner-shape: superellipse(1.5);
	font-size: 1.05rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.6s linear(0, 0.029 1.3%, 0.119 2.8%, 0.659 8.7%, 0.871 11.6%, 1.009 14.6%, 1.052 16.2%, 1.078 17.9%, 1.088 19.7%, 1.085 21.7%, 1.014 31.4%, 0.993 38%, 1.001 57.6%, 1);
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

.links-grid {
	position: relative;
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

.link-button {
	width: 100%;
	height: 72px;
	border-radius: 16px;
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

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
	transition: all 0.3s ease;
}

.slide-next-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}

.slide-next-enter-from {
	opacity: 0;
	transform: translateX(30px);
}

.slide-prev-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.slide-prev-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

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
</style>
