<template>
	<div
		class="safe-image"
		:style="{ width: width + 'px', height: height + 'px' }"
	>
		<img
			v-if="imageLoaded && src"
			:src="src"
			:alt="alt"
			:width="width"
			:height="height"
			:class="imageClass"
			@load="onImageLoad"
			@error="onImageError"
		/>
		<ImagePlaceholder
			v-else
			:variant="placeholderVariant"
			:width="width"
			:height="height"
			:text="placeholderText || $t('common.image')"
			:loading="loading"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ImagePlaceholder from "./ImagePlaceholder.vue";

interface Props {
	src?: string;
	alt?: string;
	width?: number;
	height?: number;
	placeholderVariant?: "default" | "project" | "logo" | "gallery" | "error";
	placeholderText?: string;
	imageClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
	width: 200,
	height: 200,
	placeholderVariant: "default",
	placeholderText: "",
	imageClass: "",
});

const imageLoaded = ref(false);
const loading = ref(true);
const hasError = ref(false);

const onImageLoad = () => {
	imageLoaded.value = true;
	loading.value = false;
	hasError.value = false;
};

const onImageError = () => {
	imageLoaded.value = false;
	loading.value = false;
	hasError.value = true;
};

onMounted(() => {
	if (!props.src) {
		loading.value = false;
		hasError.value = true;
	}
});
</script>

<style scoped>
.safe-image {
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.safe-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: inherit;
}
</style>
