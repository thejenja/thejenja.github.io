<template>
	<footer role="contentinfo">
		<div class="footer-content">
			<span class="copyright"
				>© {{ currentYear }} thejenja | {{ $t("footer.madeWith") }} ❤️ &
				CSS</span
			>
			<div class="info-wrapper">
				<span class="motto-wrapper">
					<span class="motto" :class="{ 'fade-out': isChanging }">{{
						currentMotto
					}}</span>
				</span>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
const { locale } = useI18n();
const currentYear = new Date().getFullYear();

// Функция для генерации строки времени
const generateTimeMotto = () => {
	const now = new Date();
	const timeString = now.toLocaleTimeString(locale.value === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' });
	return useI18n().t("footer.mottos.5", { currentTime: timeString });
};

// Состояние для обновления времени
const timeUpdateTrigger = ref(0);

// Массив с различными вариантами motto для текущего языка, получаемый из i18n
const mottos = computed(() => {
	// Получаем массив motto для текущего языка
	const localeValue = locale.value;
	if (localeValue === 'ru') {
		return [
			useI18n().t("footer.mottos.0"),
			useI18n().t("footer.mottos.1"),
			useI18n().t("footer.mottos.2"),
			useI18n().t("footer.mottos.3"),
			useI18n().t("footer.mottos.4"),
			// Добавляем строку с текущим временем как один из вариантов motto
			generateTimeMotto()
		];
	} else {
		return [
			useI18n().t("footer.mottos.0"),
			useI18n().t("footer.mottos.1"),
			useI18n().t("footer.mottos.2"),
			useI18n().t("footer.mottos.3"),
			useI18n().t("footer.mottos.4"),
			// Добавляем строку с текущим временем как один из вариантов motto
			generateTimeMotto()
		];
	}
});

// Функция для обновления времени
const updateTime = () => {
	timeUpdateTrigger.value++;
};

const currentMotto = ref("");
const isChanging = ref(false);
let currentIndex = 0;

// Обновляем текущий motto при изменении языка
const updateMotto = () => {
	// Обновляем время перед обновлением motto, чтобы получить актуальное время
	updateTime();
	currentMotto.value = mottos.value[0];
	currentIndex = 0;
};

// Функция для смены motto
const changeMotto = () => {
	isChanging.value = true;

	setTimeout(() => {
		currentIndex = (currentIndex + 1) % mottos.value.length;
		currentMotto.value = mottos.value[currentIndex];
		isChanging.value = false;
	}, 500); // Время анимации исчезновения
};

// Устанавливаем интервал для смены motto каждые 5 секунд и обновления времени каждую минуту
onMounted(() => {
	// Устанавливаем начальное значение motto
	updateMotto();
	
	const mottoInterval = setInterval(changeMotto, 5000);
	const timeInterval = setInterval(updateTime, 60000); // Обновляем время каждую минуту
	
	// Очищаем интервалы при размонтировании компонента
	onUnmounted(() => {
		clearInterval(mottoInterval);
		clearInterval(timeInterval);
	});
});

// Отслеживаем изменение языка и обновляем motto при смене
watch(locale, () => {
	updateMotto();
});
</script>

<style scoped>
footer {
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
}

.info-wrapper {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.5rem;
}


.motto-wrapper {
	min-height: 1.2em;
	display: flex;
	align-items: center;
}

.motto {
	display: inline-block;
	transition: opacity 0.5s ease-in-out;
}

.motto.fade-out {
	opacity: 0;
}

span {
	opacity: 0.5;
}

@media (max-width: 768px) {
	.footer-content {
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.info-wrapper {
		align-items: center;
	}
}
</style>
