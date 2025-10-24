<template>
	<section class="hero">
		<div class="hero-content">
			<h1 class="hero-title">
				{{ $t("hero.greeting") }}
				<img
					src="/images/waving-hand.svg"
					alt="waving-hand"
					class="waving-hand"
					width="48"
					height="48"
				/>
			</h1>
			<p class="hero-subtitle">
				<i18n-t keypath="hero.subtitle" tag="span">
					<span class="highlight"
						><img
							src="/images/thejenja.svg"
							alt="thejenja"
							class="thejenja-logo"
							width="128"
							height="40"
					/></span>
					{{ preciseAge }}
				</i18n-t>
			</p>
			<div class="hero-activity">
				<span>{{ $t("hero.activity") }}</span>
				<div ref="activityContainer" class="activity-tags"></div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

if (typeof gsap !== "undefined" && Draggable) {
	gsap.registerPlugin(Draggable);
}

const activityContainer = ref(null);
const { t } = useI18n();

const activitiesData = computed(() => [
	{ text: t("activities.frontend"), color: "#fbbf24" },
	{ text: t("activities.backend"), color: "#f43f5e" },
	{ text: t("activities.design"), color: "#10b981" },
	{ text: t("activities.music"), color: "#ec4899" },
	{ text: t("activities.video"), color: "#3b82f6" },
	{ text: t("activities.animation"), color: "#8b5cf6" },
]);

const index = ref(0);
const cycleInterval = ref(null);
const dragInstances = ref([]);

// Функция для получения текущего набора активностей
const getCurrentSet = computed(() => {
	const start = index.value;
	const end = start + 3;
	let slice = activitiesData.value.slice(start, end);

	// Если набор меньше 3, добавляем элементы с начала
	if (slice.length < 3) {
		const remaining = 3 - slice.length;
		slice = [...slice, ...activitiesData.value.slice(0, remaining)];
	}
	return slice;
});

const preciseAge = computed(() => getPreciseAge(new Date("2006-08-31")));

function renderActivities(set) {
	if (!activityContainer.value) return;

	// Убиваем все существующие draggable экземпляры
	dragInstances.value.forEach((instance) => {
		if (instance && typeof instance.kill === "function") {
			try {
				instance.kill();
			} catch (error) {
				console.warn("Error killing Draggable instance:", error);
			}
		}
	});
	dragInstances.value = [];

	// Оптимизируем DOM-операции: создаем фрагмент для уменьшения перерисовок
	const fragment = document.createDocumentFragment();

	set.forEach((act) => {
		const el = document.createElement("div");
		el.className = "activity";
		el.textContent = act.text;
		el.style.background = `color-mix(in srgb, ${act.color}, var(--bg) 80%)`;
		el.style.color = act.color;
		// Устанавливаем начальное состояние для анимации
		el.style.opacity = "0";
		el.style.transform = "translateX(-15px)";
		fragment.appendChild(el);
	});

	// Очищаем контейнер и добавляем фрагмент за один раз
	activityContainer.value.innerHTML = "";
	activityContainer.value.appendChild(fragment);

	// Получаем все созданные элементы
	const activities = activityContainer.value.querySelectorAll(".activity");

	// Запускаем анимацию появления
	gsap.to(activities, {
		opacity: 1,
		x: 0,
		duration: 0.8,
		stagger: 0.15,
		ease: "power2.out",
		onComplete: () => {
			// Создаем draggable экземпляры после завершения анимации
			activities.forEach((activity) => {
				if (!Draggable) return;

				try {
					const dragInstance = Draggable.create(activity, {
						type: "x,y",
						bounds: activityContainer.value || "body",
						edgeResistance: 0.65,
						throwProps: true,
						onDragStart: function () {
							activity.classList.add("dragging");
						},
						onDragEnd: function () {
							activity.classList.remove("dragging");
							activity.classList.add("returning");
							// Убираем класс после завершения анимации
							setTimeout(() => {
								activity.classList.remove("returning");
							}, 500);
						},
					});

					if (Array.isArray(dragInstance) && dragInstance.length > 0) {
						dragInstances.value.push(dragInstance[0]);
					} else if (dragInstance) {
						dragInstances.value.push(dragInstance);
					}
				} catch (error) {
					console.warn("Error creating Draggable:", error);
				}
			});
		},
	});
}

function cycleActivities() {
	const currentSet = getCurrentSet.value;
	renderActivities(currentSet);
	index.value = (index.value + 3) % activitiesData.value.length;
}

function slideReplace(container, update) {
	if (!container) return;

	const oldItems = container.querySelectorAll(".activity");

	// Анимация исчезновения старых элементов
	gsap.to(oldItems, {
		opacity: 0,
		x: 15,
		duration: 0.6,
		stagger: 0.1,
		ease: "power2.inOut",
		onComplete: () => {
			// Обновляем DOM после ухода
			update();

			const newItems = container.querySelectorAll(".activity");

			// Новые изначально невидимые и слева
			gsap.set(newItems, { x: -15, opacity: 0 });

			// НОВЫЕ: плавный заезд и проявление (0 → 1)
			gsap.to(newItems, {
				x: 0,
				opacity: 1,
				duration: 0.8,
				stagger: 0.15,
				ease: "power2.out",
			});
		},
	});
}

onMounted(() => {
	// Проверяем, не запущен ли уже цикл
	if (cycleInterval.value) return;

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	if (prefersReducedMotion) {
		try {
			renderActivities(getCurrentSet.value);
		} catch (error) {
			console.error("Error rendering activities:", error);
		}
		return;
	}

	const startActivityCycle = () => {
		// Проверяем, не запущен ли уже цикл
		if (cycleInterval.value) return;

		cycleInterval.value = setInterval(() => {
			try {
				slideReplace(activityContainer.value, () => {
					try {
						cycleActivities();
					} catch (error) {
						console.error("Error cycling activities:", error);
					}
				});
			} catch (error) {
				console.error("Error in slideReplace:", error);
			}
		}, 4000);
	};

	setTimeout(() => {
		try {
			cycleActivities();
			startActivityCycle();
		} catch (error) {
			console.error("Error starting activity cycle:", error);
		}
	}, 500);
});

onUnmounted(() => {
	if (cycleInterval.value) clearInterval(cycleInterval.value);
	dragInstances.value.forEach((instance) => {
		if (instance && typeof instance.kill === "function") {
			try {
				instance.kill();
			} catch (error) {
				console.warn("Error killing Draggable instance:", error);
			}
		}
	});
	dragInstances.value = [];
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
/* Определяем кастомные переменные для позиций */
@property --x1 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 0%;
}
@property --y1 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 100%;
}
@property --x2 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 100%;
}
@property --y2 {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 0%;
}

.hero {
	--x1: 0%;
	--y1: 100%;
	--x2: 100%;
	--y2: 0%;
	background:
		radial-gradient(
			circle at var(--x1) var(--y1),
			var(--gradient-1) 0%,
			transparent 50%
		),
		radial-gradient(
			circle at var(--x2) var(--y2),
			var(--gradient-2) 0%,
			transparent 50%
		),
		var(--bg-quaternary);
	animation: moveGradient 10s ease-in-out infinite alternate;
	min-height: 320px;
	position: relative;
	border: 0;
	box-shadow: none;
}

.hero::before {
	content: '';
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	filter: blur(50px);
	--x1: 0%;
	--y1: 100%;
	--x2: 100%;
	--y2: 0%;
	background:
		radial-gradient(
			circle at var(--x1) var(--y1),
			var(--gradient-1) 0%,
			transparent 50%
		),
		radial-gradient(
			circle at var(--x2) var(--y2),
			var(--gradient-2) 0%,
			transparent 50%
		),
		var(--bg-quaternary);
	animation: moveGradient 10s ease-in-out infinite alternate;
}

@keyframes moveGradient {
	0% {
		--x1: 0%;
		--y1: 100%;
		--x2: 100%;
		--y2: 0%;
	}
	50% {
		--x1: 15%;
		--y1: 70%;
		--x2: 70%;
		--y2: 15%;
	}
	100% {
		--x1: 100%;
		--y1: 0%;
		--x2: 0%;
		--y2: 100%;
	}
}

.hero-content {
	font-size: clamp(1.5rem, 2vw, 2rem);
	font-weight: 700;
}

.hero-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.thejenja-logo {
	vertical-align: middle;
}

.highlight,
.highlight-text {
	background: linear-gradient(to right, #69527d, #6a537d);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	color: white;
	font-weight: 150;
}

.hero-activity {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
	margin: 0 0 1.5rem 0;
}

.activity-tags {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	position: relative;
}

.activity-tags > *,
.activity {
	padding: 0.25rem 0.75rem;
	border-radius: 16px;
	cursor: grab;
	user-select: none;
	transform: translateX(-15px);
	opacity: 0;
	transition: all 0.3s ease;
	position: relative;
	z-index: 1;
	white-space: nowrap;
}

.activity-tags > *:hover,
.activity:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.activity:active {
	cursor: grabbing;
}

/* Стили для перетаскиваемых элементов */
.activity.dragging {
	z-index: 1000 !important;
	transform: scale(1.1) rotate(2deg) !important;
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
	transition: none !important;
}

/* Анимация возврата */
.activity.returning {
	transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
}

html:not(.dark) .waving-hand {
	filter: invert(1);
}
</style>
