<template>
	<footer class="footer">
		<div class="footer-content">
			<div class="footer-left">
				<span class="copyright"
					>© 2025 thejenja | {{ $t("footer.madeWith") }} ❤️ & CSS</span
				>
			</div>
			<div class="footer-right">
				<span class="motto">{{ $t("footer.motto") }}</span>
			</div>
		</div>
	</footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
	background: var(--bg-tertiary);
	border-radius: 16px;
	padding: 1.5rem 2rem;
	color: var(--text);
	margin-top: 2em;
}

.footer-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	opacity: 0.5;
	transition: opacity 0.3s ease;
}

.footer:hover .footer-content {
	opacity: 0.8;
}

.copyright,
.motto {
	transition: transform 0.3s ease;
}

.footer:hover .copyright {
	transform: translateX(2px);
}

.footer:hover .motto {
	transform: translateX(-2px);
}

@media (max-width: 768px) {
	.footer-content {
		flex-direction: column;
		text-align: center;
	}

	.footer-left,
	.footer-right {
		text-align: center;
	}
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.footer-content,
	.copyright,
	.motto {
		transition: none;
	}

	.footer:hover .footer-content,
	.footer:hover .copyright,
	.footer:hover .motto {
		transform: none;
		opacity: 0.5;
	}
}
</style>
