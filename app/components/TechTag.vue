<template>
	<div
		class="tech-tag"
		:class="[
			`tech-tag--${tag.color || 'gray'}`,
			{ 'tech-tag--clickable': clickable },
		]"
		:style="{ '--tag-color': tag.color }"
		@click="handleClick"
	>
		<div class="tech-tag__icon" v-if="tag.icon">
			<DynamicIcon :icon="tag.icon" size="24" />
		</div>
		<span class="tech-tag__name">{{ tag.name }}</span>
	</div>
</template>

<script setup lang="ts">
import DynamicIcon from "./DynamicIcon.vue";
import { useTagIcons } from "~/composables/useTagIcons";

interface Props {
	tagSlug: string;
	clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	clickable: false,
});

const { getFallbackTag } = useTagIcons();

// Получаем тег по slug
const tag = computed(() => getFallbackTag(props.tagSlug));

const emit = defineEmits<{
	click: [tag: any];
}>();

const handleClick = () => {
	if (props.clickable) {
		emit("click", tag.value);
	}
};
</script>

<style scoped>
.tech-tag {
	display: inline-flex;
	align-items: center;
	padding: 0.5rem;
	border-radius: 1rem;
	corner-shape: superellipse(1.5);
	font-size: 1rem;
	font-weight: 700;
	transition: all 0.2s ease;
	cursor: default;
	user-select: none;
	background: var(--tag-color, #6b7280);
	color: white;
}

.tech-tag--clickable {
	cursor: pointer;
}

.tech-tag--clickable:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tech-tag__icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.tech-tag__name {
	width: 0;
	overflow: hidden;
	line-height: 1;
	white-space: nowrap;
	transition: all 0.3s ease-in-out;
}

.tech-tag:hover .tech-tag__name {
	overflow: visible;
	width: auto;
	margin-left: 0.375rem;
}

/* Убираем старые цветовые схемы, теперь используем CSS переменные */
.tech-tag__icon svg {
	color: currentColor;
}

/* Темная тема */
:global(.dark) .tech-tag {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:global(.dark) .tech-tag--clickable:hover {
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

/* Анимация появления */
.tech-tag {
	animation: tag-appear 0.3s ease-out;
}

@keyframes tag-appear {
	from {
		opacity: 0;
		transform: scale(0.8) translateY(4px);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.tech-tag {
		animation: none;
		transition: none;
	}

	.tech-tag--clickable:hover {
		transform: none;
		box-shadow: none;
	}
}
</style>
