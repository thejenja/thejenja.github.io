<template>
	<div
		class="og-image"
		:style="backgroundStyle"
		style="width: 100%; height: 100%"
	>
		<div class="header">
			<div class="logo-placeholder" style="margin: auto">
				<img
					v-if="computedProjectIcon"
					:src="computedProjectIcon"
					:alt="`${title} icon`"
					class="project-icon"
					width="200"
					height="200"
				>
				<span v-else>{{ displayIcon }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	title?: string;
	description?: string;
	type?: string;
	stage?: string;
	technologies?: string[];
	backgroundColor?: string;
	icon?: string;
	projectIcon?: string;
	projectSlug?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Project Details",
	description: "Project details page",
	type: "web-app",
	stage: "completed",
	technologies: () => ["nuxt", "vue"],
	backgroundColor: "#4b5563",
	icon: "💻",
	projectIcon: undefined,
	projectSlug: undefined,
});

const displayIcon = computed(() => {
	// Используем иконку из props, если она есть, иначе генерируем на основе заголовка
	if (props.icon && props.icon !== "💻") {
		return props.icon;
	}

	// Получаем первую букву имени из заголовка
	const name = props.title?.split(" ")[0] || "P"; // P for Project
	return name.charAt(0).toUpperCase();
});

// Вычисляемый путь к логотипу проекта, если projectIcon не предоставлен
const computedProjectIcon = computed(() => {
	if (props.projectIcon) {
		return props.projectIcon;
	}

	if (props.projectSlug) {
		return `/projects/${props.projectSlug}/logo.svg`;
	}

	return undefined;
});

const backgroundStyle = computed(() => {
	// Возвращаем стиль фона с градиентом и основным цветом
	// Проверяем, что backgroundColor действителен
	const bgColor =
		props.backgroundColor &&
		props.backgroundColor.startsWith("#") &&
		props.backgroundColor.length === 7
			? props.backgroundColor
			: "#4b5563";

	return {
		background: `
			radial-gradient(100% 100% at 10% 100%, ${bgColor}33 0%, transparent 100%),
			radial-gradient(111.8% 111.8% at 0% 0%, ${adjustColor(bgColor, 20)}33 0%, transparent 100%),
			linear-gradient(${bgColor})
		`,
	};
});

// Функция для изменения яркости цвета
const adjustColor = (color: string, amount: number) => {
	// Проверяем, что цвет начинается с # и имеет 7 символов (включая #)
	if (!color || !color.startsWith("#") || color.length !== 7) {
		// Возвращаем серый цвет по умолчанию если цвет недействителен
		return "#6b7280";
	}

	// Преобразуем цвет в RGB
	let r = parseInt(color.substring(1, 3), 16);
	let g = parseInt(color.substring(3, 5), 16);
	let b = parseInt(color.substring(5, 7), 16);

	// Проверяем, что значения цветов валидны
	if (isNaN(r) || isNaN(g) || isNaN(b)) {
		return "#6b7280"; // возвращаем серый цвет по умолчанию
	}

	// Изменяем яркость
	r = Math.min(255, Math.max(0, r + amount));
	g = Math.min(255, Math.max(0, g + amount));
	b = Math.min(255, Math.max(0, b + amount));

	// Возвращаем в формате HEX
	return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
</script>

<style scoped>
.og-image {
	width: 100%;
	height: 100%;
	color: #f1f1f1;
	padding: 60px;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	justify-content: space-between;
	letter-spacing: -0.25em;
}

.header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 20px;
	flex: 1;
}
</style>
