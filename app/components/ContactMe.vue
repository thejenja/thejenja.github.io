<template>
	<section class="contact-me">
		<h2 class="contact-title">{{ $t("contact.title") }}</h2>

		<div class="contact-buttons">
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

			<a href="mailto:thejenja@example.com" class="contact-button email">
				<AtSign />
				{{ $t("contact.writeEmail") }}
			</a>
		</div>
	</section>
</template>

<script setup>
import { AtSign } from "lucide-vue-next";

// Компонент не требует дополнительной логики
</script>

<style scoped>

.contact-buttons {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

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

.contact-icon {
	width: 20px;
	height: 20px;
	flex-shrink: 0;
}
</style>
