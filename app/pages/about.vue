<template>
	<div class="about-page">
		<AnimatedSection animation-type="fade" :delay="0">
			<div class="about-links-stack" ref="stackRef" :class="{ expanded: isAboutExpanded }">
				<div class="about-layer">
					<AboutMe />
				</div>
				<div class="links-layer" ref="linksRef">
					<Links />
				</div>
			</div>
		</AnimatedSection>
	</div>
</template>

<script setup>
import AboutMe from "~/components/sections/AboutMe.vue";
import Links from "~/components/sections/Links.vue";
import { ref, onMounted, watch, nextTick } from "vue";
import { useState } from "#app";
import { useSEO } from "~/composables/useSEO";

const isAboutExpanded = useState("aboutExpanded", () => false);
const stackRef = ref(null);
let cachedTotalHeight = 0;

// SEO для страницы "Обо мне"
const seo = useSEO();
useHead(() => ({
	...seo.getPageSEO(),
	title: seo.getPageTitle("about.title"),
	meta: [
		...seo.getPageSEO().meta,
		{
			name: "description",
			content: seo.getPageDescription("about.intro"),
		},
	],
}));

// OG Image для страницы "Обо мне"
defineOgImage("HomeTemplate");

const updateStackHeight = async (expanded) => {
	await nextTick();
	if (!stackRef.value) return;

	if (expanded) {
		stackRef.value.style.height = `${cachedTotalHeight}px`;
	} else {
		stackRef.value.style.height = "auto";
	}
};

watch(isAboutExpanded, updateStackHeight);

onMounted(() => {
	if (stackRef.value) {
		cachedTotalHeight = stackRef.value.offsetHeight;
		stackRef.value.style.height = "auto";
	}
});
</script>

<style scoped>
.about-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.about-page > * {
	will-change: transform, opacity;
}
.about-links-stack {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	position: relative;
}

.about-layer {
	position: relative;
	z-index: 2;
	transition: opacity 0.3s ease;
}

.about-links-stack.expanded .about-layer {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10;
	display: flex;
	flex-direction: column;
}

.links-layer {
	position: relative;
	z-index: 1;
}
</style>
