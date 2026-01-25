<template>
	<button
		class="nav-tile"
		:class="{ 'brainrot-active': isBrainrotActive }"
		:title="
			currentLocaleName + (isBrainrotActive ? ' (Brainrot mode active)' : '')
		"
		aria-label="Toggle language"
		@click="handleClick"
	>
		<div class="tile-icon-wrapper">
			<Globe />
			<span v-if="isBrainrotActive" class="brainrot-indicator">🤪</span>
		</div>
		<div class="tile-content">
			<span class="tile-label">{{ currentLocaleName }}</span>
		</div>
	</button>
</template>

<script setup lang="ts">
import { Globe } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";

const { locale, locales, setLocale } = useI18n();

const currentLocale = computed(() => {
	return locales.value.find((l) => l.code === locale.value) || locales.value[0];
});

const currentLocaleName = computed(() => {
	if (locale.value === "brainrot") {
		return "Brainrot";
	}
	// Для плитки можно сократить имя, если нужно, или оставить как есть
	return currentLocale.value?.name || "English";
});

const currentLocaleCode = computed(() => {
	if (locale.value === "brainrot") {
		return "BR";
	}
	return currentLocale.value?.code.toUpperCase() || "EN";
});

const toggleLanguage = () => {
	const availableLocales = locales.value
		.filter((l) => l.code !== "brainrot")
		.map((l) => l.code);

	const currentIndex = availableLocales.indexOf(locale.value);
	const nextIndex = (currentIndex + 1) % availableLocales.length;
	setLocale(availableLocales[nextIndex] as "ru" | "en");
};

// Проверяем, активен ли brainrot режим
const isBrainrotActive = computed(() => {
	if (typeof document !== "undefined") {
		return document.documentElement.hasAttribute("data-brainrot");
	}
	return false;
});

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

// Двойной клик для активации brainrot режима
let clickCount = 0;
let clickTimer: ReturnType<typeof setTimeout> | null = null;

const handleClick = () => {
	clickCount++;

	if (clickCount === 1) {
		clickTimer = setTimeout(() => {
			toggleLanguage();
			clickCount = 0;
		}, 300);
	} else if (clickCount === 2) {
		if (clickTimer) clearTimeout(clickTimer);
		clickCount = 0;

		if (locale.value === "brainrot") {
			setLocale("en");
			document.documentElement.removeAttribute("data-brainrot");
			showNotification("Back to normal English! 😌", "success");
		} else {
			setLocale("brainrot");
			document.documentElement.setAttribute("data-brainrot", "true");
			showNotification("Brainrot mode activated! 🤪", "success");
		}
	}
};
</script>

<style scoped>
/* Стили для плитки */
.nav-tile {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.75rem;
	background: var(--bg-tertiary); /* Более выраженный фон для плитки */
	color: var(--text);
	border-radius: 12px;
	border: 1px solid transparent;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	width: 100%;
	height: 100%;
	min-height: 80px;
}

.nav-tile:hover {
	background: var(--bg-secondary);
	border-color: var(--bg-tertiary);
	transform: translateY(-2px);
}

.nav-tile:active {
	transform: scale(0.98);
}

.tile-icon-wrapper {
	position: relative;
	display: flex;
}

.tile-icon-wrapper svg {
	width: 1.5rem;
	height: 1.5rem;
}

.tile-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
}

.tile-label {
	font-size: 0.9rem;
	font-weight: 500;
}

/* Brainrot стили */
.brainrot-indicator {
	position: absolute;
	top: -8px;
	right: -8px;
	font-size: 1rem;
	animation: brainrot-bounce 1s ease-in-out infinite;
}

.brainrot-active {
	background: linear-gradient(135deg, #ff6b9d, #ff8fab) !important;
	color: white !important;
	border: none;
	box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.brainrot-active .language-code {
	background: rgba(255, 255, 255, 0.3);
	color: white;
}

@keyframes brainrot-bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-3px);
	}
}

.brainrot-active {
	animation: brainrot-pulse 2s ease-in-out infinite;
}

@keyframes brainrot-pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.02);
	}
}
</style>
