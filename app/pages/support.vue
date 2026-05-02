<template>
	<main id="main-content" class="support-page">
		<section class="support-hero">
			<h1 class="support-title">
				{{ $t("support.title") }}
				<Icon name="mingcute:heart-fill" class="title-icon" :size="32" />
			</h1>
			<p class="support-subtitle">
				{{ $t("support.subtitle") }}
			</p>
		</section>

		<section class="support-content">
			<h2 class="sr-only">{{ $t("support.platforms") }}</h2>
			<div class="bento-layout">
				<div class="buttons-column">
					<a
						v-for="link in supportLinks"
						:key="link.label"
						:href="link.url"
						target="_blank"
						rel="noopener noreferrer"
						class="support-card"
						:style="{ '--card-color': link.color }"
					>
						<div class="card-icon">
							<SvgIcon
								v-if="link.iconType === 'svg'"
								:src="link.icon"
								:size="40"
							/>
							<Icon v-else :name="link.icon" :size="40" />
						</div>
						<span class="card-label">{{ link.label }}</span>
						<Icon name="mingcute:arrow-right-up-fill" class="card-arrow" :size="18" />
					</a>
				</div>

				<div class="qr-card">
					<div class="qr-code-wrapper">
						<img src="/images/qr-code.png" alt="TON QR Code" class="qr-image" />
					</div>
					<div class="qr-footer">
						<div class="qr-label">
							<Icon name="simple-icons:ton" :size="20" />
							<span>TON Space</span>
						</div>
						<button
							class="copy-address-btn"
							@click="copyToClipboard('UQBTXoCxBrXdcDyeo14xbpEt7kgtShT-1GWeWmSuwkkG2lL-')"
						>
							<Icon name="mingcute:copy-fill" :size="18" />
							<span>{{ $t("links.copyAddress") }}</span>
						</button>
					</div>
				</div>
			</div>
		</section>

		<Transition name="notification">
			<div v-if="copyNotification" class="copy-notification">
				<Icon name="mingcute:check-fill" :size="16" />
				{{ $t("links.copied") }}
			</div>
		</Transition>
	</main>
</template>

<script setup>
import { ref, h, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const SvgIcon = defineComponent({
	name: "SvgIcon",
	props: {
		src: { type: String, required: true },
		size: { type: Number, default: 24 },
	},
	setup(props) {
		return () =>
			h("span", {
				style: {
					display: "inline-block",
					width: `${props.size}px`,
					height: `${props.size}px`,
					backgroundColor: "currentColor",
					maskImage: `url(${props.src})`,
					maskSize: "contain",
					maskRepeat: "no-repeat",
					maskPosition: "center",
					WebkitMaskImage: `url(${props.src})`,
					WebkitMaskSize: "contain",
					WebkitMaskRepeat: "no-repeat",
					WebkitMaskPosition: "center",
				},
				role: "img",
			});
	},
});

const copyNotification = ref(false);

const supportLinks = [
	{
		label: t("support.platformsList.dalink"),
		url: "https://dalink.to/thejenja",
		icon: "/icons/da.svg",
		iconType: "svg",
		color: "#f57d07",
	},
	{
		label: t("support.platformsList.boosty"),
		url: "https://boosty.to/thejenja",
		icon: "simple-icons:boosty",
		color: "#F15F2C",
	},
	{
		label: t("support.platformsList.yoomoney"),
		url: "https://yoomoney.ru/to/410019209648036",
		icon: "/icons/yoomoney.svg",
		iconType: "svg",
		color: "#8b3ffd",
	},
];

const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text);
		showCopyNotification();
	} catch {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("copy");
		document.body.removeChild(textArea);
		showCopyNotification();
	}
};

const showCopyNotification = () => {
	copyNotification.value = true;
	setTimeout(() => {
		copyNotification.value = false;
	}, 2000);
};

useSeoMeta({
	title: computed(() => `${t('support.title')}`),
	description: computed(() => t('support.subtitle')),
});

useSchemaOrg([
	{
		'@type': 'WebPage',
		name: computed(() => t('support.title')),
		description: computed(() => t('support.subtitle')),
		isPartOf: { '@type': 'WebSite', name: 'thejenja', url: 'https://thejenja.github.io' },
	},
	{
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thejenja.github.io' },
			{ '@type': 'ListItem', position: 2, name: computed(() => t('support.title')), item: computed(() => `https://thejenja.github.io/${locale.value === 'ru' ? 'ru/' : ''}support`) },
		],
	},
]);
</script>

<style scoped>
section{
	all: unset;
	margin: 0 2rem;
}

.support-page {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	max-width: 1200px;
	margin: 0 auto;
}

.support-hero {
	text-align: center;
	margin-bottom: 3rem;
}

.support-title {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	font-size: clamp(2rem, 4vw, 3rem);
	margin: 0 0 1rem 0;
}

.title-icon {
	color: #ef4444;
}

.support-subtitle {
	font-size: 1.1rem;
	color: var(--text-secondary);
	max-width: 600px;
	margin: 0 auto;
	line-height: 1.6;
}

.bento-layout {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

@media (max-width: 768px) {
	.support-page {
		padding: 6rem 1rem 2rem;
	}

	.bento-layout {
		grid-template-columns: 1fr;
	}
}

.buttons-column {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-height: 0;
}

.support-card {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.25rem 1.5rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	color: var(--text-secondary);
	border-radius: 16px;
	corner-shape: superellipse(1.5);
	text-decoration: none;
	transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	flex: 1;
}

.support-card:hover {
	background: var(--card-color) !important;
	color: white;
	transform: translateY(-4px);
	box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.card-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	flex-shrink: 0;
}

.card-label {
	font-weight: 600;
	font-size: 1.1rem;
}

.card-arrow {
	transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	color: var(--text-secondary);
	margin-left: auto;
}

.support-card:hover .card-arrow {
	color: white;
	transform: translateX(4px) rotate(45deg);
}

.qr-card {
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 16px;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	min-height: 0;
	overflow: hidden;
}

.qr-code-wrapper {
	width: 100%;
	height: 200px;
	border-radius: 12px;
	overflow: hidden;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
}

.qr-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	gap: 1rem;
}

.qr-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--text);
	font-weight: 600;
	font-size: 1rem;
}

.qr-image {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
}

.copy-address-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.25rem;
	background: var(--bg-tertiary);
	border: 1px solid var(--border);
	border-radius: 12px;
	color: var(--text);
	font-size: 0.9rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	font: inherit;
}

.copy-address-btn:hover {
	background: var(--bg);
	transform: scale(1.02);
}

.copy-notification {
	position: fixed;
	bottom: 2rem;
	left: 50%;
	transform: translateX(-50%);
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	color: var(--text);
	padding: 0.75rem 1.25rem;
	border-radius: 12px;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.9rem;
	font-weight: 500;
	box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
	z-index: 1000;
}

.notification-enter-active,
.notification-leave-active {
	transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.notification-enter-from,
.notification-leave-to {
	opacity: 0;
	transform: translateX(-50%) translateY(20px);
}
</style>
