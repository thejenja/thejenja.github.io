<template>
	<!-- Minimal mode for TopBar -->
		<button
		v-if="minimal"
		class="lang-btn-minimal"
		:class="{ 'brainrot-active': isBrainrotActive }"
		:title="currentLocaleName"
		aria-label="Toggle language"
		@click="handleClick"
	>
		<Icon name="mingcute:translate-2-line" :size="20" />
		<span v-if="isBrainrotActive" class="brainrot-indicator-minimal">🤪</span>
	</button>

	<!-- Full mode for Navigation -->
	<button
		v-else
		class="nav-tile"
		:class="{ 'brainrot-active': isBrainrotActive }"
		:title="
			currentLocaleName + (isBrainrotActive ? ' (Brainrot mode active)' : '')
		"
		aria-label="Toggle language"
		@click="handleClick"
	>
		<div class="tile-icon-wrapper">
			<Icon name="mingcute:globe-fill" />
			<span v-if="isBrainrotActive" class="brainrot-indicator">🤪</span>
		</div>
		<div class="tile-content">
			<span class="tile-label">{{ currentLocaleName }}</span>
		</div>
	</button>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";

interface Props {
	minimal?: boolean;
}

withDefaults(defineProps<Props>(), {
	minimal: false,
});

const { locale, locales, setLocale } = useI18n();

const currentLocale = computed(() => {
	return locales.value.find((l) => l.code === locale.value) || locales.value[0];
});

const currentLocaleName = computed(() => {
	if ((locale.value as string) === "brainrot") {
		return "Brainrot";
	}
	return currentLocale.value?.name || "English";
});

const toggleLanguage = () => {
	const availableLocales = locales.value
		.filter((l) => (l.code as string) !== "brainrot")
		.map((l) => l.code as string);

	const currentIndex = availableLocales.indexOf(locale.value as string);
	const nextIndex = (currentIndex + 1) % availableLocales.length;
	setLocale(availableLocales[nextIndex] as "ru" | "en");
};

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

		if ((locale.value as string) === "brainrot") {
			setLocale("en");
			document.documentElement.removeAttribute("data-brainrot");
			showNotification("Back to normal English! 😌", "success");
		} else {
			// Brainrot is not a real locale, we just set the attribute
			document.documentElement.setAttribute("data-brainrot", "true");
			showNotification("Brainrot mode activated! 🤪", "success");
		}
	}
};
</script>

<style scoped>
/* Minimal button styles */
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

.lang-code {
	font-size: 0.7rem;
	font-weight: 600;
}

.brainrot-indicator-minimal {
	position: absolute;
	top: -4px;
	right: -4px;
	font-size: 0.75rem;
}

/* Existing tile styles */
.nav-tile {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.75rem;
	background: var(--bg-tertiary);
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
