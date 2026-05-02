<template>
	<button
		class="lang-btn-minimal"
		:title="currentLocaleName"
		aria-label="Toggle language"
		@click="handleClick"
	>
		<Icon name="mingcute:translate-2-line" :size="20" />
	</button>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { locale, locales, setLocale } = useI18n();

const currentLocale = computed(() => {
	return locales.value.find((l) => l.code === locale.value) || locales.value[0];
});

const currentLocaleName = computed(() => {
	return currentLocale.value?.name || "English";
});

const toggleLanguage = () => {
	const availableLocales = locales.value
		.map((l) => l.code as string);

	const currentIndex = availableLocales.indexOf(locale.value as string);
	const nextIndex = (currentIndex + 1) % availableLocales.length;
	setLocale(availableLocales[nextIndex] as "ru" | "en");
};

function showNotification(
	message: string,
	type: "success" | "info" | "warning" | "error" = "info",
) {
	const notification = document.createElement("div");
	notification.className = `notification notification-${type}`;
	notification.textContent = message;

	Object.assign(notification.style, {
		position: "fixed",
		top: "20px",
		right: "20px",
		padding: "12px 20px",
		borderRadius: "8px",
		color: "white",
		fontWeight: "500",
		zIndex: "10000",
		transform: "translateX(100%)",
		transition: "transform 0.3s ease",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
	});

	const colors = {
		success: "#10b981",
		info: "#3b82f6",
		warning: "#f59e0b",
		error: "#ef4444",
	};

	notification.style.backgroundColor =
		colors[type as keyof typeof colors] || colors.info;
	document.body.appendChild(notification);

	setTimeout(() => {
		notification.style.transform = "translateX(0)";
	}, 100);

	setTimeout(() => {
		notification.style.transform = "translateX(100%)";
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300);
	}, 3000);
}

const handleClick = () => {
	toggleLanguage();
};
</script>

<style scoped>
.lang-btn-minimal {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	width: 36px;
	height: 36px;
	border-radius: 10px;
	background: transparent;
	border: none;
	color: var(--text);
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
}

.lang-btn-minimal:hover {
	opacity: 0.8;
}
</style>
