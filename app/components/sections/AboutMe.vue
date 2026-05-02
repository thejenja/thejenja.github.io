<template>
	<section
		class="about-me"
		:class="{ expanded: isExpanded }"
		role="region"
		aria-labelledby="about-title"
	>
		<h2 id="about-title">
			{{ $t("about.title") }}
			<Icon name="mingcute:user-3-fill" class="icon" />
		</h2>

		<div ref="contentRoot" class="about-content">
			<div class="text-container">
				<!-- eslint-disable-next-line vue/no-v-html -->
				<p class="text-paragraph intro" v-html="introHtml" />
			</div>

			<transition name="expand" appear>
				<div v-if="isExpanded" class="expanded-content">
					<div v-for="(html, index) in hiddenHtmlParts" :key="index">
						<!-- eslint-disable-next-line vue/no-v-html -->
						<p v-if="html" class="text-paragraph" v-html="html" />
					</div>
					<div class="tech-tags">
						<TechTag
							v-for="tech in techStack"
							:key="tech"
							:tag-slug="tech"
							:expanded="true"
						/>
					</div>

					<div class="setup-tiles">
						<div
							v-for="(item, index) in setup"
							:key="'setup-' + index"
							class="setup-tile"
						>
							<div class="tile-icon-wrapper">
								<Icon v-if="item.icon" :name="item.icon" class="tile-icon" />
							</div>
							<div class="tile-content">
								<span class="tile-label">{{ item.category }}</span>
								<span class="tile-value">{{ item.tools }}</span>
							</div>
						</div>
					</div>
				</div>
			</transition>
		</div>

		<button
			class="expand-button"
			:aria-expanded="isExpanded"
			:aria-label="isExpanded ? $t('about.collapse') : $t('about.expand')"
			@click="toggleExpanded"
		>
			<span class="icon-wrapper" :class="{ rotated: isExpanded }">
				<Icon
					name="mingcute:down-fill"
					size="24"
				/>
			</span>
		</button>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useState } from "#app";
import TechTag from "~/components/TechTag.vue";

const { t, locale } = useI18n();

const isAboutExpanded = useState("aboutExpanded", () => false);
const isExpanded = computed({
	get: () => isAboutExpanded.value,
	set: (value) => {
		isAboutExpanded.value = value;
	},
});

const contentRoot = ref(null);

// Локальная функция парсинга markdown (из бывшего useMarkParser)
const parseMarkdown = (text: string): string => {
	if (!text || typeof text !== "string") return text;
	return text.replace(/\*\*(.+?)\*\*/g, "<mark>$1</mark>");
};

const introHtml = computed(() => parseMarkdown(t("about.intro")));

const hiddenHtmlParts = computed(() => {
	const parts = [
		t("about.approach"),
		t("about.interests"),
		t("about.conclusion"),
	];
	return parts.map((text) => (text ? parseMarkdown(text) : ""));
});

const techStack = [
	"vue",
	"nuxt",
	"javascript",
	"typescript",
	"nodejs",
	"express",
	"figma",
	"photoshop",
	"illustrator",
	"git",
	"github",
	"vercel",
];

const setup = [
	{ category: "Editor", tools: "VS Code", icon: "mingcute:code-fill" },
	{
		category: "Terminal",
		tools: "Windows Terminal, PowerShell",
		icon: "mingcute:terminal-fill",
	},
	{ category: "Browser", tools: "Google Chrome", icon: "mingcute:chrome-fill" },
	{
		category: "Laptop",
		tools: "Chuwi Corebook X 14",
		icon: "mingcute:monitor-fill",
	},
];

const toggleExpanded = () => {
	isExpanded.value = !isExpanded.value;
};

// Анимируем новые mark элементы после расширения
const animateMarks = () => {
	if (typeof document === "undefined") return;
	const marks = document.querySelectorAll("mark");
	marks.forEach((el, i) => {
		if (!el.classList.contains("animate")) {
			setTimeout(() => {
				el.classList.add("animate");
			}, i * 100);
		}
	});
};

watch(locale, () => {
	nextTick(() => {
		animateMarks();
	});
});

watch(isExpanded, (val) => {
	if (val) {
		nextTick(() => {
			animateMarks();
		});
	}
});

onBeforeUnmount(() => {
	isAboutExpanded.value = false;
});
</script>

<style scoped>
.about-me {
	position: relative;
	border-radius: 16px;
	transition: none;
	overflow: hidden;
}

.about-me.expanded {
	z-index: 10;
	flex: 1;
	display: flex;
	flex-direction: column;
	border-radius: 16px;
	min-height: 0;
	overflow: visible;
}

.about-content {
	position: relative;
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
}

.about-me h2 {
	display: flex;
	align-items: center;
	gap: 10px;
}

.text-paragraph {
	margin-bottom: 1rem;
	line-height: 1.6;
	color: var(--text);
	font-size: 1.1rem;
}

.expand-button {
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-tertiary);
	border: 1px solid var(--border-color, transparent);
	border-radius: 12px;
	width: 44px;
	height: 44px;
	cursor: pointer;
	transition: all 0.2s ease;
	color: var(--text);
	z-index: 10;
	position: absolute;
	right: 16px;
	bottom: 16px;
}

.expand-button:hover {
	background: var(--bg-secondary);
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expand-button:active {
	transform: scale(0.95);
}

.icon-wrapper {
	display: inline-flex;
	transition: transform 0.2s ease;
}

.icon-wrapper.rotated {
	transform: rotate(180deg);
}

.expand-enter-active {
	transition: max-height 0.3s ease, opacity 0.3s ease;
	max-height: 2000px;
	overflow: hidden;
}

.expand-leave-active {
	transition: max-height 0.3s ease, opacity 0.3s ease;
	max-height: 0;
	overflow: hidden;
}

.expand-enter-from {
	opacity: 0;
	max-height: 0;
}

.expand-leave-to {
	opacity: 0;
	max-height: 0;
}

.tech-section {
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px solid var(--border, rgba(255, 255, 255, 0.1));
}

.tech-section-title {
	font-size: 1rem;
	font-weight: 600;
	margin: 0 0 1rem;
	color: var(--text-secondary);
}

.tech-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.setup-section {
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px solid var(--border, rgba(255, 255, 255, 0.1));
}

.setup-tiles {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-top: 1rem;
}

.setup-tile {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem;
	background: var(--bg-tertiary);
	color: var(--text);
	border-radius: 12px;
	border: 1px solid transparent;
	cursor: default;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	width: 100%;
	height: 100%;
	min-height: 100px;
}

.setup-tile:hover {
	background: var(--bg-secondary);
	border-color: var(--bg-tertiary);
	transform: translateY(-2px);
}

.tile-icon-wrapper {
	display: flex;
	align-items: center;
}

.tile-icon {
	width: 1.5rem;
	height: 1.5rem;
}

.tile-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
}

.tile-label {
	font-size: 0.9rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.tile-value {
	font-size: 0.95rem;
	color: var(--text-secondary);
}

@media (prefers-reduced-motion: reduce) {
	.expand-button svg {
		transition: none !important;
	}
}
</style>
