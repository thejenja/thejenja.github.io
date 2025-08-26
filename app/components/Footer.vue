<template>
	<footer>
		<span class="copyright"
			>© 2025 thejenja | {{ $t("footer.madeWith") }} ❤️ & CSS</span
		>
		<span class="motto">{{ $t("footer.motto") }}</span>
	</footer>
</template>

<script setup></script>

<style scoped>
footer {
	background: var(--bg-tertiary);
	border-radius: 16px;
	padding: 1.5rem 2rem;
	color: var(--text);
	margin-top: 2em;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
}

span {
	opacity: 0.5;
}

@media (max-width: 768px) {
	footer {
		flex-direction: column;
		align-items: center;
	}
}
</style>
