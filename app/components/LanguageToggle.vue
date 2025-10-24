<template>
	<button
		class="nav-link"
		:class="{ 'brainrot-active': isBrainrotActive }"
		:title="
			currentLocaleName + (isBrainrotActive ? ' (Brainrot mode active)' : '')
		"
		aria-label="Toggle language"
		@click="handleClick"
	>
		<Globe />
		<span>{{ currentLocaleName }}</span>
		<span class="language-code">{{ currentLocaleCode }}</span>
		<span v-if="isBrainrotActive" class="brainrot-indicator">🤪</span>
	</button>
</template>

<script setup lang="ts">
import { Globe } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { locale, locales, setLocale } = useI18n();

const currentLocale = computed(() => {
	return locales.value.find((l) => l.code === locale.value) || locales.value[0];
});

const currentLocaleName = computed(() => {
	if (locale.value === "brainrot") {
		return "Brainrot En 🤪";
	}
	return currentLocale.value?.name || "English";
});

const currentLocaleCode = computed(() => {
	if (locale.value === "brainrot") {
		return "BR";
	}
	return currentLocale.value?.code.toUpperCase() || "EN";
});

const toggleLanguage = () => {
	// Исключаем brainrot из обычного переключения
	const availableLocales = locales.value
		.filter((l) => l.code !== "brainrot")
		.map((l) => l.code);

	const currentIndex = availableLocales.indexOf(locale.value);
	const nextIndex = (currentIndex + 1) % availableLocales.length;
	setLocale(availableLocales[nextIndex] as "ru" | "en");
};

// Проверяем, активен ли brainrot режим
const isBrainrotActive = computed(() => {
	if (typeof document !== 'undefined') {
	return document.documentElement.hasAttribute("data-brainrot");
	}
	return false;
});

// Функция для показа уведомления
function showNotification(message: string, type: "success" | "info" | "warning" | "error" = "info") {
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

	notification.style.backgroundColor = colors[type as keyof typeof colors] || colors.info;
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
			// Обычное переключение языка
			toggleLanguage();
			clickCount = 0;
		}, 300);
	} else if (clickCount === 2) {
		// Двойной клик - активация brainrot режима
		if (clickTimer) clearTimeout(clickTimer);
		clickCount = 0;

		if (locale.value === "brainrot") {
			// Если уже в brainrot, возвращаемся к English
			setLocale("en");
			document.documentElement.removeAttribute("data-brainrot");
			showNotification("Back to normal English! 😌", "success");
		} else {
			// Активируем brainrot режим
			setLocale("brainrot");
			document.documentElement.setAttribute("data-brainrot", "true");
			showNotification("Brainrot mode activated! 🤪", "success");
		}
	}
};
</script>

<style scoped>
.language-code {
	background: var(--bg-tertiary);
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	font-weight: 600;
	font-size: 14px;
}

.nav-link svg {
	width: 1.25rem;
	height: 1.25rem;
}

.brainrot-indicator {
	margin-left: 0.5rem;
	font-size: 1.2rem;
	animation: brainrot-bounce 1s ease-in-out infinite;
}

.brainrot-active {
	background: linear-gradient(45deg, #ff6b9d, #ff8fab);
	color: white;
	box-shadow: 0 0 20px rgba(255, 107, 157, 0.5);
}

.brainrot-active .language-code {
	background: rgba(255, 255, 255, 0.2);
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

/* Анимация для brainrot режима */
.nav-link.brainrot-active {
	animation: brainrot-pulse 2s ease-in-out infinite;
}

@keyframes brainrot-pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}
</style>
