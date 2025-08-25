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
}

const props = withDefaults(defineProps<Props>(), {
	animationType: "slide-up",
	delay: 0,
	duration: 600,
	threshold: 0.1,
});

const sectionRef = ref<HTMLElement>();
const isVisible = ref(false);

onMounted(() => {
	if (!sectionRef.value) return;

	const { shouldAnimate } = useAnimationPreferences();

	if (!shouldAnimate("basic")) {
		isVisible.value = true;
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						isVisible.value = true;
					}, props.delay);
				}
			});
		},
		{
			threshold: props.threshold,
			rootMargin: "0px 0px -50px 0px",
		}
	);

	observer.observe(sectionRef.value);

	onUnmounted(() => {
		observer.disconnect();
	});
});
</script>

<style scoped>
.animated-section {
	transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
	will-change: transform, opacity;
}

/* Fade анимация */
.animated-section--fade {
	opacity: 0;
}

.animated-section--fade.animated-section--visible {
	opacity: 1;
}

/* Slide up анимация */
.animated-section--slide-up {
	opacity: 0;
	transform: translateY(40px) scale(0.95);
}

.animated-section--slide-up.animated-section--visible {
	opacity: 1;
	transform: translateY(0) scale(1);
}

/* Slide left анимация */
.animated-section--slide-left {
	opacity: 0;
	transform: translateX(-30px);
}

.animated-section--slide-left.animated-section--visible {
	opacity: 1;
	transform: translateX(0);
}

/* Slide right анимация */
.animated-section--slide-right {
	opacity: 0;
	transform: translateX(30px);
}

.animated-section--slide-right.animated-section--visible {
	opacity: 1;
	transform: translateX(0);
}

/* Scale анимация */
.animated-section--scale {
	opacity: 0;
	transform: scale(0.8) rotateY(10deg);
}

.animated-section--scale.animated-section--visible {
	opacity: 1;
	transform: scale(1) rotateY(0deg);
}

/* Rotate анимация */
.animated-section--rotate {
	opacity: 0;
	transform: rotate(-5deg) scale(0.95);
}

.animated-section--rotate.animated-section--visible {
	opacity: 1;
	transform: rotate(0deg) scale(1);
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.animated-section {
		transition: none;
		opacity: 1 !important;
		transform: none !important;
	}
}
</style>
