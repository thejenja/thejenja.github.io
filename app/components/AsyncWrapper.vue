<template>
	<div ref="elementRef" class="lazy-wrapper">
		<Transition name="lazy-fade" appear>
			<div v-if="isVisible" class="lazy-content">
				<slot />
			</div>
			<div v-else-if="showSkeleton" class="lazy-skeleton">
				<SkeletonLoader :variant="skeletonVariant" />
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAnimations } from "~/composables/useAnimations";

interface Props {
	threshold?: number;
	showSkeleton?: boolean;
	skeletonVariant?: "article" | "project" | "text" | "default";
}

const props = withDefaults(defineProps<Props>(), {
	threshold: 0.1,
	showSkeleton: true,
	skeletonVariant: "default",
});

const { registerScrollElement } = useAnimations({
	threshold: props.threshold,
});
const elementRef = ref<HTMLElement>();
const isVisible = ref(false);

onMounted(() => {
	if (!elementRef.value) return;

	const { shouldAnimate } = useAnimationPreferences();

	if (!shouldAnimate("basic")) {
		isVisible.value = true;
		return;
	}

	registerScrollElement(elementRef.value, "fade", 0);

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					isVisible.value = true;
					observer.disconnect();
				}
			});
		},
		{ threshold: props.threshold, rootMargin: "100px 0px" },
	);

	observer.observe(elementRef.value);

	onUnmounted(() => {
		observer.disconnect();
	});
});
</script>

<style scoped>
.lazy-wrapper {
	width: 100%;
}

.lazy-content,
.lazy-skeleton {
	width: 100%;
}

.lazy-fade-enter-active,
.lazy-fade-leave-active {
	transition: opacity 0.4s ease;
}

.lazy-fade-enter-from,
.lazy-fade-leave-to {
	opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
	.lazy-fade-enter-active,
	.lazy-fade-leave-active {
		transition: none;
	}
}
</style>
