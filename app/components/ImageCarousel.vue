<template>
	<div class="carousel">
		<div ref="trackEl" class="track">
			<div
				v-for="(img, idx) in normalizedImages"
				:key="idx"
				class="slide"
				@click="openLightbox(idx)"
			>
			  <img
			    :src="img.src"
			    :alt="img.alt || `image-${idx}`"
			    loading="lazy"
			    width="400"
			    height="320"
			  />
			</div>
		</div>
		<div v-if="normalizedImages.length > 1" class="dots">
			<button
				v-for="(_, i) in normalizedImages"
				:key="i"
				class="dot"
				:class="{ active: i === current }"
				@click="scrollTo(i)"
			/>
		</div>

		<Lightbox
			v-model="lightboxOpen"
			:images="images"
			:start-index="lightboxIndex"
			@close="lightboxOpen = false"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import Lightbox from "./Lightbox.vue";

interface ImageItem {
	src: string;
	alt?: string;
}

const props = defineProps<{ images: Array<string | ImageItem> }>();

const normalizedImages = computed<ImageItem[]>(() => {
	return (props.images || []).map((it) => {
		if (typeof it === "string") return { src: it };
		return it as ImageItem;
	});
});

const trackEl = ref<HTMLDivElement | null>(null);
const current = ref(0);

const updateCurrent = () => {
	const el = trackEl.value;
	if (!el) return;
	const idx = Math.round(el.scrollLeft / el.clientWidth);
	current.value = Math.min(Math.max(idx, 0), normalizedImages.value.length - 1);
};

const scrollTo = (index: number) => {
	const el = trackEl.value;
	if (!el) return;
	el.scrollTo({ left: el.clientWidth * index, behavior: "smooth" });
};

// Добавляем состояния и методы для Lightbox
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index: number) => {
	lightboxIndex.value = index;
	lightboxOpen.value = true;
};

onMounted(() => {
	const el = trackEl.value;
	if (!el) return;
	el.addEventListener("scroll", updateCurrent, { passive: true });
	window.addEventListener("resize", updateCurrent);
});

onUnmounted(() => {
	const el = trackEl.value;
	if (el) el.removeEventListener("scroll", updateCurrent as any);
	window.removeEventListener("resize", updateCurrent);
});
</script>

<style scoped>
.carousel {
	position: relative;
}

.track {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	border-radius: 10px;
	border: 1px solid var(--border);
	background: var(--bg-tertiary);
	cursor: pointer;
}

.slide {
	position: relative;
	scroll-snap-align: start;
}

.slide img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transition: transform 0.3s ease;
}

.slide:hover img {
	transform: scale(1.02);
}

.dots {
	display: flex;
	gap: 0.25rem;
	justify-content: center;
	margin-top: 0.5rem;
}

.dot {
	width: 8px;
	height: 8px;
	border-radius: 9999px;
	background: var(--border);
	border: none;
	cursor: pointer;
}

.dot.active {
	background: var(--accent);
}
</style>
