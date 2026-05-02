<template>
	<section class="contact-card" role="region" aria-labelledby="contact-title">
		<div class="contact-glow" />

		<div class="contact-content">
			<div class="contact-header">
				<h2 id="contact-title" class="title">
					{{ $t("contact.title") }}
					<Icon name="mingcute:mail-fill" class="title-icon" :size="24" />
				</h2>

				<div class="status-badge">
					<span class="status-dot" />
					<span class="status-text">{{ $t("contact.status") }}</span>
				</div>
			</div>

			<div class="actions-grid">
				<a
					href="https://t.me/thejenja"
					target="_blank"
					rel="noopener noreferrer"
					class="main-btn telegram"
					@mouseenter="isTelegramHovered = true"
					@mouseleave="isTelegramHovered = false"
				>
					<div class="btn-content">
						<Icon name="mingcute:telegram-fill" :size="28" />
						<div class="btn-text slide-text-container">
							<span class="label">{{ $t("contact.telegram.label") }}</span>
							<div class="slide-text-wrapper">
								<span
									class="sub-label slide-text"
									:class="{ 'slide-out': isTelegramHovered }"
									>{{ $t("contact.telegram.subLabel") }}</span
								>
								<span
									class="sub-label slide-text copied-text"
									:class="{ 'slide-in': isTelegramHovered }"
									>@thejenja</span
								>
							</div>
						</div>
					</div>
					<Icon
						name="mingcute:arrow-right-up-fill"
						class="arrow-icon"
						:size="20"
					/>
				</a>

				<button
					ref="emailBtnRef"
					class="main-btn email"
					:aria-label="$t('contact.email.label')"
					@click="copyEmail"
				>
					<div class="btn-content">
						<Icon name="mingcute:at-line" :size="28" />
						<div class="btn-text slide-text-container">
							<span class="label">{{ $t("contact.email.label") }}</span>
							<div class="slide-text-wrapper">
								<span
									class="sub-label slide-text"
									:class="{ 'slide-out': isCopied }"
									>{{ $t("contact.email.subLabel") }}</span
								>
								<span
									class="sub-label slide-text copied-text"
									:class="{ 'slide-in': isCopied }"
									>{{ $t("contact.copied") }}</span
								>
							</div>
						</div>
					</div>
					<div class="icon-container">
						<span
							class="copy-icon slide-text"
							:class="{ 'slide-out': isCopied }"
						>
							<Icon name="mingcute:copy-2-fill" :size="20" />
						</span>
						<span
							class="copy-icon slide-text copied-text"
							:class="{ 'slide-in': isCopied }"
						>
							<Icon name="mingcute:check-2-fill" :size="20" />
						</span>
					</div>
				</button>

				<NuxtLinkLocale to="/about#links" class="main-btn socials">
					<div class="btn-content">
						<Icon name="mingcute:share-2-fill" :size="28" />
						<div class="btn-text">
							<span class="label">{{ $t("contact.socials") }}</span>
							<span class="sub-label">{{ $t("contact.socialsSubLabel") }}</span>
						</div>
					</div>
					<Icon
						name="mingcute:arrow-right-up-fill"
						class="arrow-icon"
						:size="20"
					/>
				</NuxtLinkLocale>
			</div>

			<div class="socials-row">
				<a
					v-for="social in socialLinks"
					:key="social.name"
					:href="social.url"
					target="_blank"
					rel="noopener noreferrer"
					class="social-mini-btn"
					:aria-label="social.name"
					:style="{ '--hover-color': social.color }"
				>
					<SvgIcon
						v-if="social.iconType === 'svg'"
						:src="social.icon"
						:size="20"
					/>
					<Icon v-else :name="social.icon" :size="20" />
				</a>
				<!-- Source code -->
				<a
					href="https://github.com/thejenja/thejenja.github.io"
					target="_blank"
					rel="noopener noreferrer"
					class="social-mini-btn source-btn"
					style="margin-left: auto"
					aria-label="Source code"
				>
					<Icon name="mingcute:code-fill" :size="20" />
				</a>

				<!-- Resume download -->
				<a
					:href="resumeUrl"
					class="social-mini-btn resume-btn"
					:aria-label="$t('resume.download') || 'Download resume'"
					download
					title="Download resume (PDF)"
				>
					<Icon name="mingcute:file-code-fill" :size="20" />
				</a>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, h, defineComponent } from "vue";

const SvgIcon = defineComponent({
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

const isCopied = ref(false);
const isTelegramHovered = ref(false);
const email = "thejenjagamertjg@gmail.com";
const emailBtnRef = ref<HTMLElement | null>(null);

const socialLinks = [
	{
		name: "GitHub",
		url: "https://github.com/thejenja",
		icon: "simple-icons:github",
		color: "#fff",
	},
	{
		name: "LinkedIn",
		url: "https://www.linkedin.com/in/thejenja/",
		icon: "/icons/linkedin.svg",
		iconType: "svg",
		color: "#0077b5",
	},
	{
		name: "X (Twitter)",
		url: "https://x.com/thejenja",
		icon: "simple-icons:x",
		color: "#fff",
	},
];

const resumeUrl = "/resume.pdf";

const copyEmail = async () => {
	try {
		await navigator.clipboard.writeText(email);
		isCopied.value = true;
		setTimeout(() => (isCopied.value = false), 2000);
	} catch (e) {
		console.error(e);
	}
};
</script>

<style scoped>
.contact-card {
	position: relative;
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: 24px;
	padding: 2rem;
	overflow: hidden;
}

.contact-glow {
	position: absolute;
	top: -100px;
	right: -100px;
	width: 300px;
	height: 300px;
	background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
	opacity: 0.1;
	filter: blur(80px);
	pointer-events: none;
}

.contact-content {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.contact-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
}

.title {
	margin: 0;
	display: flex;
	align-items: center;
	gap: 1rem;
	font-size: 1.75rem;
}

.title-icon {
	color: var(--text-secondary);
}

.status-badge {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.35rem 1rem;
	background: rgba(34, 197, 94, 0.1);
	border: 1px solid rgba(34, 197, 94, 0.2);
	border-radius: 99px;
	font-size: 0.875rem;
	color: #22c55e;
	font-weight: 500;
}

.status-dot {
	width: 8px;
	height: 8px;
	background: currentColor;
	border-radius: 50%;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
	}
	70% {
		box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
	}
}

.actions-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 1rem;
}

@media (max-width: 900px) {
	.actions-grid {
		grid-template-columns: 1fr 1fr;
	}
}

@media (max-width: 640px) {
	.actions-grid {
		grid-template-columns: 1fr;
	}
}

.main-btn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.25rem;
	border-radius: 16px;
	text-decoration: none;
	transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	border: 1px solid transparent;
	cursor: pointer;
}

.btn-content {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.btn-text {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	line-height: 1.2;
}

.label {
	font-weight: 700;
	font-size: 1.1rem;
}

.sub-label {
	font-size: 0.8rem;
	opacity: 0.8;
	font-weight: 500;
}

.slide-text-container {
	overflow: hidden;
	position: relative;
}

.slide-text-wrapper {
	position: relative;
	height: 1.2em;
	overflow: hidden;
}

.slide-text {
	display: block;
	transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-text.slide-out {
	transform: translateY(-100%);
	opacity: 0;
	filter: blur(4px);
}

.copied-text {
	position: absolute;
	top: 0;
	left: 0;
	transform: translateY(100%);
	opacity: 0;
	filter: blur(4px);
}

.copied-text.slide-in {
	transform: translateY(0);
	opacity: 1;
	filter: blur(0);
}

.main-btn {
	background: var(--bg-tertiary);
	color: var(--text-secondary);
}
.main-btn:hover {
	background: var(--bg);
	color: var(--text);
	border-color: var(--border);
}

.main-btn.telegram {
	background: #26a5e4;
	color: white;
}
.main-btn.telegram:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px -6px rgba(0, 136, 204, 0.5);
}

.icon-container {
	display: inline-block;
	width: 20px;
	height: 20px;
	overflow: hidden;
	position: relative;
}

.icon-inner {
	display: inline-block;
	width: 100%;
	height: 100%;
}

.copy-icon {
	display: block;
	color: var(--text-secondary);
	transition:
		color 0.2s,
		filter 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.main-btn.email.copied .copy-icon {
	color: #22c55e;
}

/* Icon slide animation - same as text */
.copy-icon.slide-out {
	transform: translateY(-100%);
	opacity: 0;
	filter: blur(4px);
}

.copy-icon.copied-text {
	position: absolute;
	top: 0;
	left: 0;
	transform: translateY(100%);
	opacity: 0;
	filter: blur(4px);
}

.copy-icon.copied-text.slide-in {
	transform: translateY(0);
	opacity: 1;
	filter: blur(0);
}
.icon-slide-leave-to {
	transform: translateY(-100%);
	opacity: 0;
}
.icon-slide-leave-to .copy-icon {
	filter: blur(8px);
}
.icon-slide-enter-from {
	transform: translateY(100%);
	opacity: 0;
}
.icon-slide-enter-from .copy-icon {
	filter: blur(8px);
}

.arrow-icon {
	transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.main-btn:hover .arrow-icon {
	transform: rotate(45deg);
}

.socials-row {
	display: flex;
	gap: 0.75rem;
	padding-top: 0.5rem;
	border-top: 1px solid var(--border);
}

.social-mini-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: 12px;
	color: var(--text-secondary);
	transition: all 0.3s ease;
	border: 1px solid transparent;
}

.social-mini-btn:hover {
	background: var(--bg-tertiary);
	color: color-mix(in srgb, var(--hover-color), var(--text) 20%);
	transform: translateY(-2px);
}

.social-mini-btn.resume-btn {
	--hover-color: #ef4444;
	position: relative;
}

.social-mini-btn.resume-btn::after {
	content: "PDF";
	position: absolute;
	bottom: -4px;
	right: -4px;
	background: var(--accent, #ef4444);
	color: white;
	font-size: 8px;
	font-weight: 700;
	padding: 1px 4px;
	border-radius: 4px;
	opacity: 0;
	transform: scale(0.8);
	transition: all 0.2s ease;
}

.social-mini-btn.resume-btn:hover::after {
	opacity: 1;
	transform: scale(1);
}
</style>
