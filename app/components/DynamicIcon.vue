<template>
	<component
		:is="iconComponent"
		v-if="iconComponent && props.icon"
		:size="size"
		:class="iconClass"
		v-bind="$attrs"
	/>
	<img
		v-else-if="isSvgIcon && props.icon"
		:src="svgSrc"
		:width="size"
		:height="size"
		:alt="fallbackText"
		class="svg-icon"
	/>
	<div
		v-else-if="!props.icon"
		class="icon-placeholder"
		:style="{ width: size + 'px', height: size + 'px' }"
	>
		<span class="icon-fallback">{{ fallbackText }}</span>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type Component, computed, markRaw } from "vue";

interface Props {
	icon: string; // 'simple-icons:icon-name', 'lucide:icon-name', '/path/to/icon.svg', или просто 'icon-name'
	size?: number | string;
	fallbackText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	icon: "",
	size: 16,
	fallbackText: "?",
});

const iconComponent = ref<Component | null>(null);
const iconClass = ref<string>("");
const svgSrc = ref<string>("");

// Определяем тип иконки
const iconType = computed(() => {
	if (!props.icon || typeof props.icon !== "string") return "none";
	if (props.icon.startsWith("simple-icons:")) return "simple-icons";
	if (props.icon.startsWith("lucide:")) return "lucide";
	if (props.icon.startsWith("/") || props.icon.endsWith(".svg")) return "svg";
	return "auto"; // Автоматическое определение
});

// Проверяем, является ли это SVG иконкой
const isSvgIcon = computed(() => iconType.value === "svg" && !!props.icon);

// Загружаем иконку
const loadIcon = async () => {
	if (!props.icon) {
		iconComponent.value = null;
		return;
	}

	try {
		switch (iconType.value) {
			case "none":
				iconComponent.value = null;
				break;
			case "simple-icons":
				await loadSimpleIcon();
				break;
			case "lucide":
				await loadLucideIcon();
				break;
			case "svg":
				loadSvgIcon();
				break;
			case "auto":
				await loadAutoIcon();
				break;
		}
	} catch {
		// console.warn(`Ошибка загрузки иконки: ${props.icon}`, error);
		iconComponent.value = null;
	}
};

// Загрузка Simple Icons
const loadSimpleIcon = async () => {
	if (!props.icon) return;

	const iconName = props.icon.replace("simple-icons:", "");
	if (!iconName) return;

	const iconModule = await import("vue3-simple-icons");

	// Пробуем найти иконку по точному названию с суффиксом Icon
	const componentName = `${iconName}Icon`;
	const IconComponent = iconModule[componentName as keyof typeof iconModule];

	if (IconComponent) {
		iconComponent.value = markRaw(IconComponent);
		iconClass.value = "simple-icon";
	} else {
		// console.warn(`Simple Icon не найдена: ${componentName}`);
		iconComponent.value = null;
	}
};

// Загрузка Lucide Icons
const loadLucideIcon = async () => {
	if (!props.icon) return;

	const iconName = props.icon.replace("lucide:", "");
	if (!iconName) return;

	const iconModule = await import("lucide-vue-next");

	// Преобразуем название в PascalCase (например: "check-circle" -> "CheckCircle")
	const componentName = iconName
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");

	const IconComponent = iconModule[componentName as keyof typeof iconModule];

	if (IconComponent) {
		iconComponent.value = markRaw(IconComponent);
		iconClass.value = "lucide-icon";
	} else {
		// console.warn(`Lucide Icon не найдена: ${componentName}`);
		iconComponent.value = null;
	}
};

// Загрузка SVG иконки
const loadSvgIcon = () => {
	if (!props.icon) {
		svgSrc.value = "";
		iconComponent.value = null;
		return;
	}
	svgSrc.value = props.icon;
	iconComponent.value = null;
};

// Автоматическое определение типа иконки
const loadAutoIcon = async () => {
	if (!props.icon) return;

	// Сначала пробуем как Lucide иконку
	try {
		await loadLucideIcon();
		if (iconComponent.value) return;
	} catch {
		// Игнорируем ошибку и пробуем дальше
	}

	// Затем пробуем как Simple Icon
	try {
		await loadSimpleIcon();
		if (iconComponent.value) return;
	} catch {
		// Игнорируем ошибку и пробуем дальше
	}

	// Если ничего не найдено, устанавливаем null
	iconComponent.value = null;
};

// Загружаем иконку при монтировании и при изменении пропа
onMounted(() => {
	loadIcon();
});

watch(
	() => props.icon,
	(newIcon) => {
		iconComponent.value = null;
		svgSrc.value = "";
		if (newIcon) {
			loadIcon();
		}
	}
);
</script>

<style scoped>
.icon-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-tertiary);
	border-radius: 4px;
	color: var(--text-secondary);
	font-size: 0.75rem;
	font-weight: 600;
}

.icon-fallback {
	line-height: 1;
}

.simple-icon {
	color: currentColor;
}

.lucide-icon {
	color: currentColor;
}

.svg-icon {
	display: block;
}
</style>
