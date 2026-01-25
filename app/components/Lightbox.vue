<template>
	<div v-if="isOpen" class="lightbox-overlay" @click="closeLightbox">
		<div class="lightbox-content" @click.stop>
			<button class="lightbox-close" @click="closeLightbox">
				<X :size="24" />
			</button>

			<div class="lightbox-image-container">
				<button
					class="lightbox-nav lightbox-prev"
					@click="prevImage"
					:disabled="currentIndex === 0"
				>
					<ChevronLeft :size="32" />
				</button>

				<img
					:src="currentImage.src"
					:alt="currentImage.alt || `image-${currentIndex}`"
					class="lightbox-image"
					@click.stop
					loading="lazy"
				/>

				<button
					class="lightbox-nav lightbox-next"
					@click="nextImage"
					:disabled="currentIndex === normalizedImages.length - 1"
				>
					<ChevronRight :size="32" />
				</button>
			</div>

			<div class="lightbox-info">
				<div class="lightbox-counter">
					{{ currentIndex + 1 }} / {{ normalizedImages.length }}
				</div>
				<div v-if="currentImage.alt" class="lightbox-alt">
					{{ currentImage.alt }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { X, ChevronLeft, ChevronRight } from "lucide-vue-next";

interface ImageItem {
	src: string;
	alt?: string;
}

const props = defineProps<{
	images: Array<string | ImageItem>;
	modelValue: boolean;
	startIndex?: number;
}>();

const emit = defineEmits(["update:modelValue", "close"]);

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

const normalizedImages = computed<ImageItem[]>(() => {
	return (props.images || []).map((it) => {
		if (typeof it === "string") return { src: it };
		return it as ImageItem;
	});
});

const currentIndex = ref(props.startIndex || 0);

const currentImage = computed(() => normalizedImages.value[currentIndex.value]);

const openLightbox = (index: number = 0) => {
	currentIndex.value = index;
	isOpen.value = true;
};

const closeLightbox = () => {
	isOpen.value = false;
	emit("close");
};

const nextImage = () => {
	if (currentIndex.value < normalizedImages.value.length - 1) {
		currentIndex.value++;
	}
};

const prevImage = () => {
	if (currentIndex.value > 0) {
		currentIndex.value--;
	}
};

// Обработка клавиатурных событий
const handleKeyDown = (e: KeyboardEvent) => {
	if (!isOpen.value) return;

	if (e.key === "Escape") {
		closeLightbox();
	} else if (e.key === "ArrowRight") {
		nextImage();
	} else if (e.key === "ArrowLeft") {
		prevImage();
	}
};

onMounted(() => {
	window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeyDown);
});

// Экспортируем методы для использования в родительском компоненте
defineExpose({
	openLightbox,
	closeLightbox,
	nextImage,
	prevImage,
});
</script>

<style scoped>
.lightbox-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.9);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	padding: 1rem;
}

.lightbox-content {
	position: relative;
	max-width: 90vw;
	max-height: 90vh;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.lightbox-close {
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: rgba(255, 255, 255, 0.2);
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 10;
	transition: background 0.3s ease;
}

.lightbox-close:hover {
	background: rgba(255, 255, 255, 0.3);
}

.lightbox-image-container {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.lightbox-image {
	max-width: 100%;
	max-height: 80vh;
	object-fit: contain;
	border-radius: 8px;
	box-shadow: 0 10px 30px rgba(0, 0, 0.5);
}

.lightbox-nav {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: rgba(255, 255, 255, 0.2);
	border: none;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 10;
	transition: background 0.3s ease;
}

.lightbox-nav:hover:not(:disabled) {
	background: rgba(255, 255, 255, 0.3);
}

.lightbox-nav:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.lightbox-prev {
	left: 1rem;
}

.lightbox-next {
	right: 1rem;
}

.lightbox-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 0 0;
	color: white;
	font-size: 0.9rem;
}

.lightbox-counter {
	font-weight: 600;
}

.lightbox-alt {
	opacity: 0.8;
	font-style: italic;
	text-align: right;
	max-width: 60%;
}

@media (max-width: 768px) {
	.lightbox-overlay {
		padding: 0.5rem;
	}

	.lightbox-nav {
		width: 40px;
		height: 40px;
	}

	.lightbox-info {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}

	.lightbox-alt {
		max-width: 100%;
		text-align: left;
	}
}
</style>
