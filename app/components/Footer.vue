<template>
	<footer role="contentinfo">
		<div class="footer-content">
			<div class="copyright">
				© {{ currentYear }} thejenja
				<span class="divider">|</span>
				<span class="tech-stack">
					{{ $t("footer.madeWith") }} <span class="heart">❤️</span> & CSS
				</span>
			</div>

			<div class="motto-container">
				<Transition name="slide-up" mode="out-in">
					<span :key="currentIndex" class="motto">
						{{ currentMottoText }}
					</span>
				</Transition>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const currentYear = new Date().getFullYear();

// Количество статических фраз в json (0..4) + 1 для времени
const MOTTO_COUNT = 6;
const TIME_INDEX = 5; // Индекс, под которым будет время
const INTERVAL_MS = 5000;

const currentIndex = ref(0);
let intervalId = null;

// Вычисляем текущий текст
const currentMottoText = computed(() => {
	// Если сейчас очередь показывать время (индекс 5)
	if (currentIndex.value === TIME_INDEX) {
		const now = new Date();
		const timeString = now.toLocaleTimeString(
			locale.value === "ru" ? "ru-RU" : "en-US",
			{ hour: "2-digit", minute: "2-digit" },
		);
		return t("footer.mottos.5", { currentTime: timeString });
	}

	// Иначе берем обычный перевод по индексу
	return t(`footer.mottos.${currentIndex.value}`);
});

const startRotation = () => {
	intervalId = setInterval(() => {
		currentIndex.value = (currentIndex.value + 1) % MOTTO_COUNT;
	}, INTERVAL_MS);
};

onMounted(() => {
	startRotation();
});

onUnmounted(() => {
	if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
footer {
	background: var(--bg-secondary);
	border: 1px solid var(--border-color, var(--bg-tertiary));
	border-radius: 16px;
	padding: 1.5rem 2rem;
	color: var(--text);
	margin-top: 3rem;

	backdrop-filter: blur(10px);
}

.footer-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	font-size: 0.95rem;
}

.copyright {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	opacity: 0.7;
	font-weight: 500;
}

.divider {
	opacity: 0.3;
}

.heart {
	display: inline-block;
	color: #ef4444;
	animation: heartbeat 1.5s ease-in-out infinite;
}

.motto-container {
	min-height: 1.5em;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.motto {
	display: inline-block;
	color: var(--text-secondary);
}

.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-up-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.slide-up-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
.slide-up-enter-to,
.slide-up-leave-from {
	opacity: 1;
	transform: translateY(0);
}

@keyframes heartbeat {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.15);
	}
}

@media (max-width: 640px) {
	.footer-content {
		flex-direction: column;
		justify-content: center;
		text-align: center;
		gap: 1.5rem;
	}

	.motto-container {
		justify-content: center;
	}
}

@media (prefers-reduced-motion: reduce) {
	.heart {
		animation: none;
	}
	.slide-up-enter-active,
	.slide-up-leave-active {
		transition: opacity 0.3s ease;
	}
	.slide-up-enter-from,
	.slide-up-leave-to {
		transform: none;
	}
}
</style>
