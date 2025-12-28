<template>
	<div
		class="tech-tag"
		:class="[
		`tech-tag--${tag.color || 'gray'}`,
			{
				'tech-tag--clickable': clickable,
				'tech-tag--expanded': expanded,
				'is-light-bg': isLightBackground, // Класс-маркер для CSS
			},
		]"
		:style="{ '--tag-color': tag.color }"
		@click="handleClick"
	>
		<div class="tech-tag__icon" v-if="tag.icon">
			<DynamicIcon :icon="tag.icon" size="20" />
		</div>

		<div class="tech-tag__content-wrapper">
			<span class="tech-tag__name">{{ tag.name }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DynamicIcon from "./DynamicIcon.vue";
import { useTagIcons } from "~/composables/useTagIcons";

interface Props {
	tagSlug: string;
	clickable?: boolean;
	expanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	clickable: false,
	expanded: false,
});

const { getFallbackTag } = useTagIcons();
const tag = computed(() => getFallbackTag(props.tagSlug));

const emit = defineEmits<{
	click: [tag: any];
}>();

const handleClick = () => {
	if (props.clickable) emit("click", tag.value);
};

// Вычисляем, является ли фон светлым
const isLightBackground = computed(() => {
	const color = tag.value.color;
	if (!color || !color.startsWith("#")) return false; // По дефолту считаем темным

	// Убираем #
	const hex = color.replace("#", "");
	const fullHex =
		hex.length === 3
			? hex
					.split("")
					.map((c) => c + c)
					.join("")
			: hex;

	const r = parseInt(fullHex.substr(0, 2), 16);
	const g = parseInt(fullHex.substr(2, 2), 16);
	const b = parseInt(fullHex.substr(4, 2), 16);

	// Формула яркости (YIQ)
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;

	// Если яркость > 140, значит фон светлый (нужен темный текст)
	return yiq >= 140;
});
</script>

<style scoped>
.tech-tag {
	display: inline-flex;
	align-items: center;
	padding: 0.4rem 0.6rem;
	border-radius: 12px;
	font-size: 0.95rem;
	font-weight: 600;
	cursor: default;
	user-select: none;

	/* Основной цвет фона */
	background: var(--tag-color, #6b7280);

	/* 
	   ПО УМОЛЧАНИЮ (для темных фонов):
	   Смешиваем 90% белого и 10% цвета тега.
	   Текст будет белым, но с легким оттенком фона (гармонично).
	*/
	color: color-mix(in srgb, white 90%, var(--tag-color));

	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;
}

/* 
   ДЛЯ СВЕТЛЫХ ФОНОВ (когда JS вернул true):
   Смешиваем 85% черного и 15% цвета тега.
   Текст будет темно-темно цветным, а не глухим черным.
*/
.tech-tag.is-light-bg {
	color: color-mix(in srgb, black 80%, var(--tag-color));
	/* Можно добавить тонкую обводку, если фон слишком белый */
	border: 1px solid color-mix(in srgb, black 5%, transparent);
}

.tech-tag--clickable {
	cursor: pointer;
}

.tech-tag--clickable:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.tech-tag__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0; /* Чтобы иконку не плющило */
	z-index: 1;
}

/* --- МАГИЯ GRID АНИМАЦИИ --- */

.tech-tag__content-wrapper {
	display: grid;
	grid-template-columns: 0fr; /* По умолчанию ширина контента 0 */
	transition: grid-template-columns 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Пружинистый эффект */
}

.tech-tag:hover .tech-tag__content-wrapper {
	grid-template-columns: 1fr; /* При наведении раскрываем */
}

.tech-tag--expanded .tech-tag__content-wrapper {
	grid-template-columns: 1fr; /* Всегда раскрыт */
}

.tech-tag__name {
	overflow: hidden;
	white-space: nowrap;
	opacity: 0;
	transform: translateX(-10px);
	transition:
		opacity 0.3s ease,
		transform 0.3s ease,
		margin-left 0.3s ease;
	min-height: 0; /* Фикс для Grid */
}

/* Синхронизируем появление текста с раскрытием грида */
.tech-tag:hover .tech-tag__name {
	opacity: 1;
	transform: translateX(0);
	margin-left: 0.5rem; /* Отступ появляется только при наведении */
}

.tech-tag--expanded .tech-tag__name {
	opacity: 1;
	transform: translateX(0);
	margin-left: 0.5rem; /* Отступ всегда есть в раскрытом состоянии */
}

/* Начальная анимация появления самого тега при загрузке страницы */
.tech-tag {
	animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
}

@keyframes pop-in {
	from {
		opacity: 0;
		transform: scale(0.5);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

@media (prefers-reduced-motion: reduce) {
	.tech-tag,
	.tech-tag__content-wrapper,
	.tech-tag__name {
		transition: none;
		animation: none;
	}
}
</style>
