<template>
	<section class="contact-me">
		<h2>
			{{ $t("contact.title") }}
			<Mail />
		</h2>
		<a
			href="https://t.me/thejenja"
			target="_blank"
			rel="noopener noreferrer"
			class="contact-button telegram"
		>
			<img
				src="/icons/telegram-logo.svg"
				alt="Telegram"
				class="contact-icon"
				width="20"
				height="20"
			/>
			{{ $t("contact.writeTelegram") }}
		</a>

		<a href="mailto:thejenjagamertjg@gmail.com" class="contact-button email">
			<AtSign />
			{{ $t("contact.writeEmail") }}
		</a>
	</section>
</template>

<script setup>
import { AtSign, Mail } from "lucide-vue-next";
</script>

<style scoped>
.contact-button {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 1.5rem;
	border-radius: 12px;
	text-decoration: none;
	font-weight: 600;
	font-size: 1rem;
	transition: all 0.3s ease;
	border: none;
	cursor: pointer;
	justify-content: center;
}

.contact-button.telegram {
	background: #3b82f6;
	color: white;
}

.contact-button.telegram:hover {
	background: #2563eb;
}

.contact-button.email {
	background: var(--bg-tertiary);
	color: var(--text);
}

.contact-button.email:hover {
	background: var(--bg-secondary);
}
</style>
