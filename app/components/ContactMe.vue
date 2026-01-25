<template>
	<section class="contact-card" role="region" aria-labelledby="contact-title">
		<div class="contact-glow" />

		<div class="contact-content">
			<div class="contact-header">
				<h2 id="contact-title" class="title">
					{{ $t("contact.title") }}
					<Mail class="title-icon" :size="24" />
				</h2>

				<div class="status-badge">
					<span class="status-dot"></span>
					<span class="status-text">{{ $t("contact.status") }}</span>
				</div>
			</div>

			<p class="description">
				{{ $t("contact.description") }}
			</p>

			<div class="actions-grid">
				<a
					href="https://t.me/thejenja"
					target="_blank"
					rel="noopener noreferrer"
					class="main-btn telegram"
				>
					<div class="btn-content">
						<SvgIcon src="/icons/telegram-logo.svg" :size="28" />
						<div class="btn-text">
							<span class="label">{{ $t("contact.telegram.label") }}</span>
							<span class="sub-label">{{
								$t("contact.telegram.subLabel")
							}}</span>
						</div>
					</div>
					<ArrowUpRight class="arrow-icon" :size="20" />
				</a>

				<div class="email-wrapper">
					<a href="mailto:thejenjagamertjg@gmail.com" class="main-btn email">
						<div class="btn-content">
							<AtSign :size="28" />
							<div class="btn-text">
								<span class="label">{{ $t("contact.email.label") }}</span>
								<span class="sub-label">{{
									$t("contact.email.subLabel")
								}}</span>
							</div>
						</div>
					</a>
					<button
						class="copy-btn"
						@click="copyEmail"
						:class="{ copied: isCopied }"
						:aria-label="$t('contact.copyEmail')"
					>
						<Check v-if="isCopied" :size="20" />
						<Copy v-else :size="20" />
					</button>
				</div>
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
					<component v-else :is="social.icon" :size="20" />
				</a>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, h, defineComponent } from "vue";
import { Mail, AtSign, ArrowUpRight, Copy, Check } from "lucide-vue-next";
import { GitHubIcon, XIcon } from "vue3-simple-icons";

// === ИСПРАВЛЕННЫЙ КОМПОНЕНТ SVG ===
// Вместо img используем div с mask-image.
// Это позволяет управлять цветом через css свойство color (currentColor)
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
					backgroundColor: "currentColor", // Ключевой момент: берет цвет текста родителя
					maskImage: `url(${props.src})`,
					maskSize: "contain",
					maskRepeat: "no-repeat",
					maskPosition: "center",
					// Webkit префиксы для Safari/Chrome
					WebkitMaskImage: `url(${props.src})`,
					WebkitMaskSize: "contain",
					WebkitMaskRepeat: "no-repeat",
					WebkitMaskPosition: "center",
				},
				// Добавляем role="img" для семантики, так как это больше не тег img
				role: "img",
			});
	},
});

const isCopied = ref(false);
const email = "thejenjagamertjg@gmail.com";

const socialLinks = [
	{
		name: "GitHub",
		url: "https://github.com/thejenja",
		icon: GitHubIcon,
		color: "#ffffff",
	},
	{
		name: "LinkedIn",
		url: "https://www.linkedin.com/in/thejenja/",
		icon: "/icons/linkedin.svg",
		iconType: "svg",
		color: "#0077b5", // Оригинальный цвет LinkedIn
	},
	{
		name: "X (Twitter)",
		url: "https://x.com/thejenja",
		icon: XIcon,
		color: "#ffffff",
	},
];

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

.description {
	margin: 0;
	color: var(--text-secondary);
	line-height: 1.6;
	max-width: 90%;
}

.actions-grid {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	gap: 1rem;
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
}

.btn-content {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.btn-text {
	display: flex;
	flex-direction: column;
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

.main-btn.telegram {
	background: linear-gradient(135deg, #0088cc 0%, #0077aa 100%);
	color: white;
}
.main-btn.telegram:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px -6px rgba(0, 136, 204, 0.5);
}

.email-wrapper {
	display: flex;
	gap: 0.5rem;
}

.main-btn.email {
	flex-grow: 1;
	background: var(--bg-tertiary);
	color: var(--text);
}
.main-btn.email:hover {
	background: var(--bg);
	border-color: var(--border);
}

.copy-btn {
	width: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-tertiary);
	border-radius: 16px;
	cursor: pointer;
	color: var(--text-secondary);
	transition: all 0.2s;
	border: 1px solid transparent;
}

.copy-btn:hover {
	background: var(--bg);
	border-color: var(--border);
	color: var(--text);
}

.copy-btn.copied {
	background: #22c55e;
	color: white;
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
</style>
