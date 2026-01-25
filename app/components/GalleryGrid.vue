<template>
	<div class="gallery-grid">
		<div
			v-for="(img, idx) in normalizedImages"
			:key="idx"
			class="gallery-item"
			@click="openLightbox(idx)"
		>
			<img
				:src="img.src"
				:alt="img.alt || `image-${idx}`"
				loading="lazy"
				width="140"
				height="140"
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
import { computed, ref } from "vue";
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

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index: number) => {
	lightboxIndex.value = index;
	lightboxOpen.value = true;
};
</script>

<style scoped>
.gallery-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 0.5rem;
}

.gallery-item {
	position: relative;
	overflow: hidden;
	border-radius: 8px;
	background: var(--bg-tertiary);
	border: 1px solid var(--border);
	cursor: pointer;
}

.gallery-item img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transition: transform 0.3s ease;
}

.gallery-item:hover img {
	transform: scale(1.03);
}

.gallery-item::after {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border-radius: 8px;
	opacity: 0;
	transition: opacity 0.3s ease;
	background: rgba(255, 255, 255, 0.1);
}

.gallery-item:hover::after {
	opacity: 1;
}
</style>
