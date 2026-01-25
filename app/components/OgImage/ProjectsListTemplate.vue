<template>
	<div
		style="
			width: 100%;
			height: 100%;
			background:
				radial-gradient(100% 100% at 0% 100%, #45285d66 0%, transparent 100%),
				radial-gradient(100% 100% at 100% 0, #5c2d3a66 0%, transparent 100%),
				linear-gradient(#111);
			color: #6b537e;
			display: flex;
			flex-direction: column;
			align-content: center;
		"
	>
		<h1
			style="
				margin: auto;
				font-size: 6em;
				letter-spacing: -0.03em;
				text-align: center;
			"
		>
			{{ title }}
		</h1>
	</div>
</template>

<script setup lang="ts">
interface Props {
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Projects",
});
</script>
