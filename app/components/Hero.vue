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
							width="120"
							height="32"
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

let index = 0;
let cycleInterval = null;
let dragInstances = [];

const preciseAge = computed(() => getPreciseAge(new Date("2006-08-31")));

function renderActivities(set) {
	if (!activityContainer.value) return;

	dragInstances.forEach((instance) => instance.kill());
	dragInstances = [];

	activityContainer.value.innerHTML = "";

	set.forEach((act) => {
		const el = document.createElement("div");
		el.className = "activity";
		el.textContent = act.text;
		el.style.background = `color-mix(in srgb, ${act.color}, var(--bg) 80%)`;
		el.style.color = act.color;
		activityContainer.value.appendChild(el);
	});

	const activities = activityContainer.value.querySelectorAll(".activity");
	activities.forEach((activity) => {
		const dragInstance = Draggable.create(activity, {
			type: "x,y",
			bounds: "body",
			edgeResistance: 0.65,
			throwProps: true,
		});
		if (Array.isArray(dragInstance) && dragInstance.length > 0) {
			dragInstances.push(dragInstance[0]);
		} else if (dragInstance) {
			dragInstances.push(dragInstance);
		}
	});
}

function cycleActivities() {
	const currentSet = activitiesData.value.slice(index, index + 3);
	if (currentSet.length < 3) {
		currentSet.push(...activitiesData.value.slice(0, 3 - currentSet.length));
	}
	renderActivities(currentSet);
	index = (index + 3) % activitiesData.value.length;
}

function slideReplace(container, update) {
	const oldItems = container.querySelectorAll(".activity");

	const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

	// СТАРЫЕ: плавный уход (1 → 0)
	tl.to(oldItems, {
		x: 15,
		opacity: 0,
		duration: 0.6,
		stagger: 0.1,
		ease: "power2.inOut",
	});

	// Обновляем DOM после ухода
	tl.add(() => {
		update();

		const newItems = container.querySelectorAll(".activity");

		// Новые изначально невидимые и слева
		gsap.set(newItems, { x: -15, opacity: 0 });

		// НОВЫЕ: плавный заезд и проявление (0 → 1)
		tl.to(newItems, {
			x: 0,
			opacity: 1,
			duration: 0.8,
			stagger: 0.15,
			ease: "power2.out",
		});
	});
}

onMounted(() => {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;
	if (prefersReducedMotion) {
		cycleActivities();
		return;
	}

	const startActivityCycle = () => {
		if (cycleInterval) return;
		cycleInterval = setInterval(() => {
			slideReplace(activityContainer.value, () => cycleActivities());
		}, 4000);
	};

	setTimeout(() => {
		cycleActivities();
		startActivityCycle();
	}, 500);
});

onUnmounted(() => {
	if (cycleInterval) clearInterval(cycleInterval);
	dragInstances.forEach((instance) => instance.kill?.());
	dragInstances = [];
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
			100% 100% at var(--x1) var(--y1),
			var(--gradient-1) 0%,
			transparent 100%
		),
		radial-gradient(
			100% 100% at var(--x2) var(--y2),
			var(--gradient-2) 0%,
			transparent 100%
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
	height: 2rem;
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
