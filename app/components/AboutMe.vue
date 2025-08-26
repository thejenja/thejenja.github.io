<template>
	<section class="about-me">
		<h2>
			{{ $t("about.title") }}
			<FileUser />
		</h2>

		<div class="about-content" ref="contentRoot">
			<div class="text-preview" :class="{ expanded: isExpanded }">
				<p class="preview-text" v-html="parseMarkdown($t('about.intro'))"></p>
				<p
					v-if="isExpanded"
					class="full-text"
					v-html="parseMarkdown($t('about.approach'))"
				></p>
				<p
					v-if="isExpanded"
					class="full-text"
					v-html="parseMarkdown($t('about.interests'))"
				></p>
				<p
					v-if="isExpanded"
					class="full-text"
					v-html="parseMarkdown($t('about.conclusion'))"
				></p>
			</div>

			<button
				class="expand-button"
				@click="toggleExpanded"
				:aria-expanded="isExpanded"
				:aria-label="isExpanded ? $t('about.collapse') : $t('about.expand')"
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
import { useMarkAnimation } from "~/composables/useMarkAnimation";
import { useMarkParser } from "~/composables/useMarkParser";

const isExpanded = ref(false);
const contentRoot = ref(null);
const { animateMarks } = useMarkAnimation();
const { parseMarkdown } = useMarkParser();

const { locale } = useI18n();

const toggleExpanded = () => {
	isExpanded.value = !isExpanded.value;
	nextTick(() => {
		animateMarks(contentRoot.value);
	});
};

onMounted(() => {
	nextTick(() => animateMarks(contentRoot.value));
});

watch(locale, () => {
	nextTick(() => animateMarks(contentRoot.value));
});

watch(isExpanded, () => {
	nextTick(() => animateMarks(contentRoot.value));
});
</script>

<style scoped>
.about-content {
	position: relative;
	transition: all 0.3s ease;
}

.text-preview {
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;
}

.preview-text {
	margin: 0;
	line-height: 1.6;
	color: var(--text);
	font-size: 1.1rem;
}

.full-text {
	margin: 1rem 0 0 0;
	line-height: 1.6;
	color: var(--text);
	font-size: 1.1rem;
	animation: fadeIn 0.3s ease;
}

.expand-button {
	position: absolute;
	bottom: -12px;
	right: -12px;
	background: var(--bg-tertiary);
	border: none;
	border-radius: 8px;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	color: var(--text);
}

.expand-button:hover {
	background: var(--bg-secondary);
	transform: scale(1.05);
}

.expand-button:active {
	transform: scale(0.95);
}

.expand-button svg {
	transition: transform 0.3s ease;
}

.expand-button svg.rotated {
	transform: rotate(180deg);
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Маска для текста */
.text-preview:not(.expanded)::after {
	content: "";
	position: absolute;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(transparent, var(--bg-secondary));
	pointer-events: none;
}
</style>
