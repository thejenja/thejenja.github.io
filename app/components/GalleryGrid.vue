<template>
	<div class="gallery-grid">
		<div v-for="(img, idx) in normalizedImages" :key="idx" class="gallery-item">
			<img
				:src="img.src"
				:alt="img.alt || `image-${idx}`"
				loading="lazy"
				width="140"
				height="140"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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
</style>
