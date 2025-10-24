<template>
	<div class="og-image">
		<div class="logo-placeholder">
			{{ logoInitial }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	title?: string;
	description?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Eugene (thejenja) - Frontend Developer",
	description: "Personal portfolio showcasing web development projects",
});

const displayTitle = computed(() => {
	return props.title;
});

const logoInitial = computed(() => {
	// Получаем первую букву имени из заголовка (предполагаем формат "Имя (никнейм) - должность")
	const name = props.title.split(" ")[0] || "E";
	return name.charAt(0).toUpperCase();
});
</script>

<style scoped>
.og-image {
	width: 100%;
	height: 100%;
	background:
		radial-gradient(100% 100% at 10% 100%, #00824e33 0%, transparent 100%),
		radial-gradient(111.8% 111.8% at 0% 0%, #375c4a33 0%, transparent 100%),
		linear-gradient(#0d0d0d);
	color: #f1f1f1;
	padding: 60px;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	justify-content: center;
	letter-spacing: -0.25em;
}

.header {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20px;
}

.logo-placeholder {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	background: linear-gradient(135deg, #4b5563, #1f2937);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48px;
	font-weight: bold;
	color: white;
	flex-shrink: 0;
}

.title {
	font-size: 64px;
	font-weight: 700;
	color: #f1f1;
	text-align: center;
	line-height: 1.1;
	max-width: 600px;
}

.description {
	font-size: 32px;
	font-weight: 400;
	margin-top: 30px;
	color: #a0a0a0;
	text-align: center;
	line-height: 1.4;
	max-width: 800px;
	padding: 0 40px;
}
</style>
