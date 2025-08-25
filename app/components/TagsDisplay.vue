<template>
	<div class="tags-display">
		<div class="tags-container">
			<TechTag
				v-for="(tag, index) in visibleTags"
				:key="`${tag.name}-${index}`"
				:tag="tag"
				:clickable="clickable"
				@click="handleTagClick"
			/>

			<button
				v-if="hasHiddenTags"
				class="show-more-btn"
				@click="toggleExpanded"
				:aria-expanded="isExpanded"
			>
				<span v-if="!isExpanded">
					{{ $t("tags.showMore", { count: hiddenTagsCount }) }}
				</span>
				<span v-else> {{ $t("tags.hide") }} </span>
				<ChevronDown :class="{ rotated: isExpanded }" size="16" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import TechTag from "./TechTag.vue";

interface Tag {
	name: string;
	color: string;
	icon?: string;
}

interface Props {
	tags: Tag[];
	maxVisible?: number;
	clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	maxVisible: 3,
	clickable: false,
});

const emit = defineEmits<{
	"tag-click": [tag: Tag];
}>();

const isExpanded = ref(false);

const visibleTags = computed(() => {
	if (isExpanded.value) {
		return props.tags;
	}
	return props.tags.slice(0, props.maxVisible);
});

const hasHiddenTags = computed(() => {
	return props.tags.length > props.maxVisible;
});

const hiddenTagsCount = computed(() => {
	return props.tags.length - props.maxVisible;
});

const toggleExpanded = () => {
	isExpanded.value = !isExpanded.value;
};

const handleTagClick = (tag: Tag) => {
	emit("tag-click", tag);
};
</script>

<style scoped>
.tags-display {
	width: 100%;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
}

.show-more-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.375rem 0.75rem;
	background: var(--bg-tertiary);
	border: 1px solid var(--border);
	border-radius: 9999px;
	color: var(--text-secondary);
	font-size: 0.75rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	user-select: none;
}

.show-more-btn:hover {
	background: var(--bg-quaternary);
	border-color: var(--text-tertiary);
	color: var(--text);
	transform: translateY(-1px);
}

.show-more-btn:active {
	transform: translateY(0);
}

.show-more-btn .rotated {
	transform: rotate(180deg);
}

/* Анимация для тегов */
.tags-container > * {
	animation: tag-slide-in 0.3s ease-out backwards;
}

.tags-container > *:nth-child(1) {
	animation-delay: 0ms;
}
.tags-container > *:nth-child(2) {
	animation-delay: 50ms;
}
.tags-container > *:nth-child(3) {
	animation-delay: 100ms;
}
.tags-container > *:nth-child(4) {
	animation-delay: 150ms;
}
.tags-container > *:nth-child(5) {
	animation-delay: 200ms;
}
.tags-container > *:nth-child(6) {
	animation-delay: 250ms;
}

@keyframes tag-slide-in {
	from {
		opacity: 0;
		transform: translateX(-10px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.tags-container > * {
		animation: none;
	}

	.show-more-btn:hover {
		transform: none;
	}
}
</style>
