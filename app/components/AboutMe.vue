<template>
	<section class="about-me" role="region" aria-labelledby="about-title">
		<h2 id="about-title">
			{{ $t("about.title") }}
			<FileUser class="icon" />
		</h2>

		<div ref="contentRoot" class="about-content">
			<!-- Текстовый контейнер -->
			<div class="text-container" :class="{ expanded: isExpanded }">
				<!-- Вводная часть (всегда видна) -->
				<p
					class="text-paragraph intro"
					v-html="parseMarkdown($t('about.intro'))"
				/>

				<!-- Скрытая часть с анимацией высоты -->
				<transition
					name="expand"
					@enter="onEnter"
					@after-enter="onAfterEnter"
					@leave="onLeave"
				>
					<div v-if="isExpanded" class="hidden-wrapper">
						<div class="hidden-content-inner">
							<p
								class="text-paragraph"
								v-html="parseMarkdown($t('about.approach'))"
							/>
							<p
								class="text-paragraph"
								v-html="parseMarkdown($t('about.interests'))"
							/>
							<p
								class="text-paragraph"
								v-html="parseMarkdown($t('about.conclusion'))"
							/>
						</div>
					</div>
				</transition>

				<!-- Градиент-маска -->
				<div class="fade-overlay" :class="{ visible: !isExpanded }"></div>
			</div>

			<!-- Кнопка (Квадратная, справа внизу) -->
			<button
				class="expand-button"
				:aria-expanded="isExpanded"
				:aria-label="isExpanded ? $t('about.collapse') : $t('about.expand')"
				@click="toggleExpanded"
			>
				<ChevronDown :class="{ rotated: isExpanded }" />
			</button>
		</div>
	</section>
</template>

<script setup>
import { ChevronDown, FileUser } from "lucide-vue-next";
import { ref, onMounted, nextTick, watch } from "vue";
import { useI18n } from "vue-i18n";
// Импорты твоих композаблов
import { useMarkAnimation } from "~/composables/useMarkAnimation";
import { useMarkParser } from "~/composables/useMarkParser";

const { locale } = useI18n();
const { animateMarks } = useMarkAnimation();
const { parseMarkdown } = useMarkParser();

const isExpanded = ref(false);
const contentRoot = ref(null);

const runAnimation = () => {
	nextTick(() => {
		if (contentRoot.value) {
			animateMarks(contentRoot.value);
		}
	});
};

const toggleExpanded = () => {
	isExpanded.value = !isExpanded.value;
};

// === Анимация высоты (Accordion effect) ===
const onEnter = (el) => {
	el.style.height = "0";
	// Форсируем перерисовку
	// eslint-disable-next-line no-unused-expressions
	el.offsetHeight;
	el.style.height = el.scrollHeight + "px";
};

const onAfterEnter = (el) => {
	el.style.height = "auto";
	// Запускаем анимацию маркеров после того, как блок полностью открылся
	runAnimation();
};

const onLeave = (el) => {
	el.style.height = el.scrollHeight + "px";
	// Форсируем перерисовку
	// eslint-disable-next-line no-unused-expressions
	el.offsetHeight;
	el.style.height = "0";
};

// Hooks
onMounted(() => {
	runAnimation();
});

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

.text-container {
	position: relative;
}

.text-paragraph {
	margin-bottom: 1rem;
	line-height: 1.6;
	color: var(--text);
	font-size: 1.1rem;
}

/* === Стили для анимации Expand === */
.hidden-wrapper {
	overflow: hidden;
	/* transition должен совпадать с длительностью в JS логике, но здесь управляется классом */
}

.expand-enter-active,
.expand-leave-active {
	transition:
		height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
		opacity 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
	opacity: 0;
	/* height: 0 устанавливается через JS */
}

.expand-enter-to,
.expand-leave-from {
	opacity: 1;
}

/* === Маска-градиент === */
.fade-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		to bottom,
		transparent 0%,
		var(--bg-secondary) 90%
	);
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s ease;
	z-index: 1;
}

.fade-overlay.visible {
	opacity: 1;
}

/* === Кнопка (Квадратная, справа внизу) === */
.expand-button {
	position: absolute;
	bottom: 0;
	right: 0;
	background: var(--bg-tertiary);
	border: 1px solid var(--border-color, transparent);
	border-radius: 12px; /* Квадрат со скруглением */
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

/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
	.expand-enter-active,
	.expand-leave-active,
	.expand-button,
	.expand-button svg {
		transition: none !important;
	}
}
</style>
