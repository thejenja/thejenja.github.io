<template>
	<div
		ref="sectionRef"
		class="animated-section"
		:class="[
			`animated-section--${animationType}`,
			{ 'animated-section--visible': isVisible },
		]"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
	animationType?:
		| "fade"
		| "slide-up"
		| "slide-left"
		| "slide-right"
		| "scale"
		| "rotate";
	delay?: number;
	duration?: number;
	threshold?: number;
	once?: boolean; // Добавил проп: если true, анимация сработает только один раз
}

const props = withDefaults(defineProps<Props>(), {
	animationType: "slide-up",
	delay: 0,
	duration: 600,
	threshold: 0.1,
	once: true,
});

const sectionRef = ref<HTMLElement>();
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

// Обработчик события resize, который будем использовать как при добавлении, так и при удалении
const handleResize = () => {
	if (observer) {
		observer.disconnect();
		createObserver();
	}
};

// Функция для создания Intersection Observer
const createObserver = () => {
	if (!sectionRef.value) return;

	// Адаптивный rootMargin для мобильных и десктопа
	const isMobile = window.innerWidth < 768;
	// Уменьшаем отступы для более раннего срабатывания анимации
	const rootMargin = isMobile ? "0px 0px -100px 0px" : "0px 0px -150px 0px";

	observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						isVisible.value = true;
						// Если нужно анимировать только один раз (экономит ресурсы)
						if (props.once && sectionRef.value && observer) {
							observer.unobserve(sectionRef.value);
						}
					}, props.delay);
				}
				// Опционально: скрывать обратно, если ушли с экрана (если once: false)
				else if (!props.once) {
					isVisible.value = false;
				}
			});
		},
		{
			threshold: props.threshold,
			rootMargin, // Используем вычисленный отступ
		},
	);

	observer.observe(sectionRef.value);
};

onMounted(() => {
	// Проверяем предпочтения пользователя по уменьшению движения
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	if (prefersReducedMotion) {
		isVisible.value = true;
		return;
	}

	createObserver();

	// Добавляем обработчик изменения размера окна для пересоздания observer при смене ориентации
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	if (observer) observer.disconnect();
	// Удаляем обработчик resize при размонтировании компонента
	window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.animated-section {
	transition:
		opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
		transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);

	will-change: opacity, transform;

	position: relative;
	z-index: 1;
}

.animated-section--fade {
	opacity: 0;
}
.animated-section--fade.animated-section--visible {
	opacity: 1;
}

.animated-section--slide-up {
	opacity: 0;
	transform: translateY(40px) scale(0.96);
}
.animated-section--slide-up.animated-section--visible {
	opacity: 1;
	transform: translateY(0) scale(1);
}

.animated-section--slide-left {
	opacity: 0;
	transform: translateX(-30px);
}
.animated-section--slide-right {
	opacity: 0;
	transform: translateX(30px);
}

.animated-section--slide-left.animated-section--visible,
.animated-section--slide-right.animated-section--visible {
	opacity: 1;
	transform: translateX(0);
}

.animated-section--scale {
	opacity: 0;
	transform: scale(0.9);
}
.animated-section--scale.animated-section--visible {
	opacity: 1;
	transform: scale(1);
}

.animated-section--rotate {
	opacity: 0;
	transform: rotate(-3deg) scale(0.95);
}
.animated-section--rotate.animated-section--visible {
	opacity: 1;
	transform: rotate(0deg) scale(1);
}

@media (max-width: 768px) {
	.animated-section {
		transition-duration: 0.5s;
	}

	.animated-section--slide-up {
		transform: translateY(20px);
	}

	.animated-section--slide-left {
		transform: translateX(-15px);
	}

	.animated-section--slide-right {
		transform: translateX(15px);
	}

	.animated-section--slide-up.animated-section--visible,
	.animated-section--slide-left.animated-section--visible,
	.animated-section--slide-right.animated-section--visible {
		transform: translate(0) scale(1);
	}
}

@media (prefers-reduced-motion: reduce) {
	.animated-section {
		transition: none !important;
		opacity: 1 !important;
		transform: none !important;
		animation: none !important;
		will-change: auto;
	}
}
</style>
