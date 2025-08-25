<template>
	<div>
		<!-- Слои Progressive Blur сверху -->
		<div class="gradient-blur top">
			<div></div>
			<div></div>
			<div></div>
		</div>

		<!-- Слои Progressive Blur снизу -->
		<div class="gradient-blur bottom">
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>

<script setup>
// Никакой логики не нужно — всё на CSS
</script>

<style scoped>
.gradient-blur {
	position: fixed;
	left: 0;
	right: 0;
	height: 100px;
	pointer-events: none;
	z-index: 1;
}

.gradient-blur > div,
.gradient-blur::before,
.gradient-blur::after {
	position: absolute;
	inset: 0;
}

.gradient-blur::before,
.gradient-blur > div,
.gradient-blur::after {
	opacity: 0;
	animation: fadeIn linear both;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/* Верхняя маска */
.gradient-blur.top {
	top: 0;
}
.gradient-blur.top::before,
.gradient-blur.top > div,
.gradient-blur.top::after {
	mask-composite: intersect;
	-webkit-mask-composite: destination-in;
}

.gradient-blur.top::before {
	content: "";
	z-index: 1;
	backdrop-filter: blur(0.5px);
	mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 20%);
}
.gradient-blur.top > div:nth-of-type(1) {
	z-index: 2;
	backdrop-filter: blur(2px);
	mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 40%);
}
.gradient-blur.top > div:nth-of-type(2) {
	z-index: 3;
	backdrop-filter: blur(4px);
	mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 60%);
}
.gradient-blur.top > div:nth-of-type(3) {
	z-index: 4;
	backdrop-filter: blur(8px);
	mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 80%);
}
.gradient-blur.top::after {
	content: "";
	z-index: 5;
	backdrop-filter: blur(16px);
	mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

/* Нижняя маска */
.gradient-blur.bottom {
	bottom: 0;
}
.gradient-blur.bottom::before,
.gradient-blur.bottom > div,
.gradient-blur.bottom::after {
	mask-composite: intersect;
	-webkit-mask-composite: destination-in;
}

.gradient-blur.bottom::before {
	content: "";
	z-index: 1;
	backdrop-filter: blur(0.5px);
	mask: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 20%);
}
.gradient-blur.bottom > div:nth-of-type(1) {
	z-index: 2;
	backdrop-filter: blur(2px);
	mask: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 40%);
}
.gradient-blur.bottom > div:nth-of-type(2) {
	z-index: 3;
	backdrop-filter: blur(4px);
	mask: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 60%);
}
.gradient-blur.bottom > div:nth-of-type(3) {
	z-index: 4;
	backdrop-filter: blur(8px);
	mask: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 80%);
}
.gradient-blur.bottom::after {
	content: "";
	z-index: 5;
	backdrop-filter: blur(16px);
	mask: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

/* Scroll-driven анимация */
.gradient-blur.top::before,
.gradient-blur.top > div,
.gradient-blur.top::after {
	animation-timeline: scroll(y);
	animation-range: 0 150px;
}
.gradient-blur.bottom::before,
.gradient-blur.bottom > div,
.gradient-blur.bottom::after {
	animation-timeline: scroll(y);
	animation-range: calc(100% - 200px) 100%;
}
</style>
