<template>
	<section class="hero">
		<div class="hero-content">
			<h1 class="hero-title">
				{{ $t("hero.greeting") }}
				<NuxtImg
					src="/images/waving-hand.svg"
					alt="waving-hand"
					class="waving-hand"
					width="48"
					height="48"
					sizes="xs:24px sm:32px md:40px lg:48px"
					loading="lazy"
				/>
			</h1>
			<p class="hero-subtitle">
				<i18n-t keypath="hero.subtitle" tag="span">
					<span class="highlight">
						<NuxtImg
							src="/images/thejenja.svg"
							alt="thejenja"
							class="thejenja-logo"
							width="128"
							height="40"
							sizes="xs:64px sm:80px md:96px lg:128px"
							loading="lazy"
						/>
					</span>
					{{ preciseAge }}
				</i18n-t>
			</p>

			<div class="hero-activity">
				<span class="activity-label">{{ $t("hero.activity") }}</span>

				<div class="activity-viewport">
					<TransitionGroup
						tag="div"
						class="activity-tags"
						:class="{ 'shaking-mode': isAnyDragging }"
						:css="false"
						@before-enter="onBeforeEnter"
						@enter="onEnter"
						@leave="onLeave"
					>
						<div
							v-for="(act, index) in visibleItems"
							:key="act.text"
							:data-index="index"
							class="activity"
							:style="{
								'--act-color': act.color,
								'--bg-mix': `color-mix(in srgb, ${act.color}, var(--bg) 85%)`,
							}"
						>
							{{ act.text }}
						</div>
					</TransitionGroup>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

if (typeof gsap !== "undefined" && Draggable) {
	gsap.registerPlugin(Draggable);
}

const { t } = useI18n();

const allActivities = computed(() => [
	{ text: t("activities.frontend"), color: "#fbbf24" },
	{ text: t("activities.backend"), color: "#f43f5e" },
	{ text: t("activities.design"), color: "#10b981" },
	{ text: t("activities.music"), color: "#ec4899" },
	{ text: t("activities.video"), color: "#3b82f6" },
	{ text: t("activities.animation"), color: "#8b5cf6" },
]);

const visibleItems = ref([]);
const currentIndex = ref(0);
const itemsToShow = ref(3); // Дефолтное значение
const cycleTimeout = ref(null);
const isAnimating = ref(false);
const isAnyDragging = ref(false);

const preciseAge = computed(() => getPreciseAge(new Date("2006-08-31")));

// --- Адаптивность количества элементов ---

const checkResponsiveCount = () => {
	const w = window.innerWidth;
	let newCount = 3;

	if (w < 640) {
		newCount = 1; // Мобильные
	} else if (w < 1024) {
		newCount = 2; // Планшеты
	} else {
		newCount = 3; // Десктоп
	}

	// Если количество изменилось, обновляем переменную.
	// Изменение применится при следующем цикле обновления (updateActivities),
	// чтобы не ломать текущую анимацию.
	itemsToShow.value = newCount;
};

// --- Анимация (Motion Blur + Slide) ---

const onBeforeEnter = (el) => {
	el.style.opacity = 0;
};

const onEnter = (el, done) => {
	gsap.set(el, {
		opacity: 0,
		x: -40,
		filter: "blur(12px)",
		scale: 0.95,
	});

	gsap.to(el, {
		opacity: 1,
		x: 0,
		filter: "blur(0px)",
		scale: 1,
		duration: 0.9,
		// Задержка зависит от индекса, чтобы элементы вылетали "лесенкой"
		delay: el.dataset.index * 0.12,
		ease: "power3.out",
		onComplete: () => {
			el.style.filter = "";
			initDraggable(el);
			done();
		},
	});
};

const onLeave = (el, done) => {
	const draggableInstance = Draggable.get(el);
	if (draggableInstance) draggableInstance.kill();

	gsap.to(el, {
		opacity: 0,
		x: 40,
		filter: "blur(12px)",
		scale: 0.95,
		duration: 0.5,
		delay: el.dataset.index * 0.05,
		ease: "power2.in",
		onComplete: done,
	});
};

// --- Логика смены ---

function updateActivities() {
	if (isAnimating.value || isAnyDragging.value || document.hidden) return;
	isAnimating.value = true;

	visibleItems.value = [];

	setTimeout(() => {
		if (document.hidden) {
			isAnimating.value = false;
			return;
		}

		const total = allActivities.value.length;
		const nextSet = [];
		const count = itemsToShow.value; // Берем актуальное кол-во

		// Генерируем новый набор на основе itemsToShow
		for (let i = 0; i < count; i++) {
			nextSet.push(allActivities.value[(currentIndex.value + i) % total]);
		}

		// Сдвигаем индекс на количество показанных элементов
		currentIndex.value = (currentIndex.value + count) % total;

		visibleItems.value = nextSet;

		setTimeout(() => {
			isAnimating.value = false;
			scheduleNextCycle();
		}, 4500);
	}, 600);
}

function scheduleNextCycle() {
	if (cycleTimeout.value) clearTimeout(cycleTimeout.value);

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;
	if (prefersReducedMotion) return;

	cycleTimeout.value = setTimeout(() => {
		updateActivities();
	}, 100);
}

function handleVisibilityChange() {
	if (document.hidden) {
		if (cycleTimeout.value) clearTimeout(cycleTimeout.value);
	} else {
		if (!isAnimating.value && visibleItems.value.length > 0) {
			scheduleNextCycle();
		} else if (visibleItems.value.length === 0) {
			updateActivities();
		}
	}
}

// --- Draggable ---

function initDraggable(el) {
	if (!Draggable) return;

	Draggable.create(el, {
		type: "x,y",
		edgeResistance: 0.65,
		throwProps: true,
		zIndexBoost: true,
		onDragStart: function () {
			el.classList.add("dragging");
			isAnyDragging.value = true;
			gsap.to(el, { scale: 1.1, duration: 0.2 });
		},
		onDragEnd: function () {
			el.classList.remove("dragging");
			isAnyDragging.value = false;
			el.classList.add("returning");

			gsap.to(el, {
				x: 0,
				y: 0,
				scale: 1,
				duration: 0.5,
				ease: "elastic.out(1, 0.4)",
				onComplete: () => {
					el.classList.remove("returning");
				},
			});
		},
	});
}

onMounted(() => {
	// 1. Сначала определяем ширину экрана
	checkResponsiveCount();

	// 2. Вешаем слушатель ресайза
	window.addEventListener("resize", checkResponsiveCount);
	document.addEventListener("visibilitychange", handleVisibilityChange);

	// 3. Формируем стартовый набор с учетом ширины
	const startSet = [];
	const count = itemsToShow.value;
	for (let i = 0; i < count; i++) {
		startSet.push(allActivities.value[i]);
	}
	visibleItems.value = startSet;

	// Обновляем индекс, чтобы следующая пачка шла за стартовой
	currentIndex.value = count;

	setTimeout(() => {
		scheduleNextCycle();
	}, 3000);
});

onUnmounted(() => {
	window.removeEventListener("resize", checkResponsiveCount); // Чистим слушатель
	document.removeEventListener("visibilitychange", handleVisibilityChange);
	if (cycleTimeout.value) clearTimeout(cycleTimeout.value);
	gsap.killTweensOf(".activity");
});

function getPreciseAge(birthDate) {
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
	return age;
}
</script>

<style scoped>
@property --x1 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 0%;
}
@property --y1 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 0%;
}
@property --x2 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 100%;
}
@property --y2 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 100%;
}

.hero {
	--x1: 0%;
	--y1: 0%;
	--x2: 100%;
	--y2: 100%;
	position: relative;
	min-height: 320px;
	border: 0;
	box-shadow: none;
	background:
		radial-gradient(
			circle at var(--x1) var(--y1),
			var(--gradient-1) 0%,
			transparent 40%
		),
		radial-gradient(
			circle at var(--x2) var(--y2),
			var(--gradient-2) 0%,
			transparent 40%
		),
		var(--bg-quaternary);
	animation: rotateBlobs 12s linear infinite;
}

.hero::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	filter: blur(60px);
	background: inherit;
}

@keyframes rotateBlobs {
	0% {
		--x1: 0%;
		--y1: 0%;
		--x2: 100%;
		--y2: 100%;
	}
	25% {
		--x1: 100%;
		--y1: 0%;
		--x2: 0%;
		--y2: 100%;
	}
	50% {
		--x1: 100%;
		--y1: 100%;
		--x2: 0%;
		--y2: 0%;
	}
	75% {
		--x1: 0%;
		--y1: 100%;
		--x2: 100%;
		--y2: 0%;
	}
	100% {
		--x1: 0%;
		--y1: 0%;
		--x2: 100%;
		--y2: 100%;
	}
}

.hero-content {
	font-size: clamp(1.5rem, 2vw, 2rem);
	position: relative;
	z-index: 2;
}

.hero-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.highlight {
	display: inline-flex;
	align-items: center;
	vertical-align: middle;
	height: 1.2em;
}

.hero-activity {
	height: 3.5rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin: 0 0 1.5rem 0;
	flex-wrap: nowrap;
}

.activity-label {
	white-space: nowrap;
	flex-shrink: 0;
}

.activity-viewport {
	flex-grow: 1;
	height: 100%;
	display: flex;
	align-items: center;
	overflow: visible;
	position: relative;
}

.activity-tags {
	display: flex;
	gap: 0.5rem;
	position: relative;
	width: 100%;
}

/* --- Стили Активности --- */
.activity {
	padding: 0.25rem 0.75rem;
	border-radius: 16px;
	cursor: grab;
	user-select: none;
	font-weight: 500;
	white-space: nowrap;

	/* Начальные стили (по умолчанию) */
	background: var(--bg-mix);
	color: var(--act-color);

	/* Для производительности анимации блюра */
	will-change: transform, opacity, filter;
	/* Важно для корректного отображения 3D/блюра */
	backface-visibility: hidden;

	display: inline-flex;
	align-items: center;
	transition:
		background-color 0.3s ease,
		color 0.3s ease,
		transform 0.2s ease,
		box-shadow 0.2s ease;
}

/* Инверсия цветов при наведении */
.activity:hover {
	background-color: var(--act-color) !important;
	color: var(--bg-mix) !important;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 10;
}

.activity:active {
	cursor: grabbing;
}

.activity.dragging {
	z-index: 1000 !important;
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
	/* При перетаскивании цвет тоже яркий */
	background-color: var(--act-color) !important;
	color: #ffffff !important;
}

/* --- iPhone Shake Effect --- */
.shaking-mode .activity:not(.dragging) {
	animation: shake 0.3s ease-in-out infinite;
}

.shaking-mode .activity:nth-child(2n):not(.dragging) {
	animation-delay: 0.1s;
}
.shaking-mode .activity:nth-child(3n):not(.dragging) {
	animation-delay: 0.05s;
}

@keyframes shake {
	0% {
		transform: rotate(0deg);
	}
	25% {
		transform: rotate(1deg) translateY(1px);
	}
	50% {
		transform: rotate(0deg);
	}
	75% {
		transform: rotate(-1deg) translateY(-1px);
	}
	100% {
		transform: rotate(0deg);
	}
}

html:not(.dark) .waving-hand {
	filter: invert(1);
}
</style>
