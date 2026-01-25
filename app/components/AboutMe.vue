<template>
	<section class="about-me" role="region" aria-labelledby="about-title">
		<h2 id="about-title">
			{{ $t("about.title") }}
			<FileUser class="icon" />
		</h2>

		<div ref="contentRoot" class="about-content">
			<div class="text-container">
				<p class="text-paragraph intro" v-html="introHtml" />
			</div>

			<div
				class="expand-wrapper"
				:class="{ open: isExpanded }"
				role="region"
				:aria-hidden="!isExpanded"
			>
				<div class="expand-inner">
					<div v-for="(html, index) in hiddenHtmlParts" :key="index">
						<p v-if="html" class="text-paragraph" v-html="html" />
					</div>
				</div>
			</div>

			<template v-if="hasHiddenContent">
				<div
					class="fade-overlay"
					:class="{ visible: !isExpanded }"
					aria-hidden="true"
				></div>

				<button
					class="expand-button"
					:aria-expanded="isExpanded"
					:aria-label="isExpanded ? $t('about.collapse') : $t('about.expand')"
					@click="toggleExpanded"
				>
					<ChevronDown :class="{ rotated: isExpanded }" />
				</button>
			</template>
		</div>
	</section>
</template>

<script setup>
import { ChevronDown, FileUser } from "lucide-vue-next";
import { ref, computed, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
// Убедись, что пути к composables верные
import { useMarkAnimation } from "~/composables/useMarkAnimation";
import { useMarkParser } from "~/composables/useMarkParser";

const { t, locale } = useI18n();
const { animateMarks } = useMarkAnimation();
const { parseMarkdown } = useMarkParser();

const isExpanded = ref(false);
const contentRoot = ref(null);

// --- Реактивный контент (Решает проблему смешивания языков) ---
const introHtml = computed(() => parseMarkdown(t("about.intro")));

const hiddenHtmlParts = computed(() => {
	// Собираем массив скрытых частей.
	// Если перевод отсутствует или пуст, он не попадет в рендер
	const parts = [
		t("about.approach"),
		t("about.interests"),
		t("about.conclusion"),
	];
	return parts.map((text) => (text ? parseMarkdown(text) : ""));
});

// Проверяем, есть ли действительно контент для скрытия (удаляем теги и пробелы для проверки)
const hasHiddenContent = computed(() => {
	return hiddenHtmlParts.value.some((html) => {
		const textContent = html.replace(/<[^>]*>/g, "").trim();
		return textContent.length > 0;
	});
});

// --- Логика ---

const runAnimation = () => {
	nextTick(() => {
		if (contentRoot.value) {
			animateMarks(contentRoot.value);
		}
	});
};

const toggleExpanded = () => {
	isExpanded.value = !isExpanded.value;

	// Запускаем анимацию маркеров, когда открываем
	if (isExpanded.value) {
		// Небольшая задержка, чтобы grid успел начать анимацию открытия
		setTimeout(() => runAnimation(), 150);
	}
};

// При смене языка обновляем анимацию маркеров (для уже видимой части)
watch(locale, () => {
	runAnimation();
});
</script>

<style scoped>
.about-me {
	position: relative;
}

.about-me h2 {
	display: flex;
	align-items: center;
	gap: 10px;
}

.about-content {
	position: relative;
}

.text-paragraph {
	margin-bottom: 1rem;
	line-height: 1.6;
	color: var(--text);
	font-size: 1.1rem;
}

.text-paragraph:last-child {
	margin-bottom: 0;
}

.expand-wrapper {
	display: grid;
	grid-template-rows: 0fr;
	opacity: 0;
	transition:
		grid-template-rows 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
		opacity 0.4s ease;

	visibility: hidden;
}

.expand-wrapper.open {
	grid-template-rows: 1fr;
	opacity: 1;
	visibility: visible;
}

.expand-inner {
	min-height: 0;
	overflow: hidden;
}

.fade-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 80px;
	background: linear-gradient(
		to bottom,
		transparent 0%,
		var(--bg-secondary) 100%
	);
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s ease;
	z-index: 1;
}

.fade-overlay.visible {
	opacity: 1;
}

.expand-button {
	position: absolute;
	bottom: -10px;
	right: 0;
	background: var(--bg-tertiary);
	border: 1px solid var(--border-color, transparent);
	border-radius: 12px;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	color: var(--text);
	z-index: 10;
}

.expand-button:hover {
	background: var(--bg-secondary);
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expand-button:active {
	transform: scale(0.95);
}

.expand-button svg {
	transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.expand-button svg.rotated {
	transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
	.expand-wrapper,
	.expand-button svg {
		transition: none !important;
	}
}
</style>
