<template>
	<section class="hero">
		<img
			src="/images/monster.svg"
			alt="monster"
			class="floating-monster"
			width="144"
			loading="lazy"
			aria-hidden="true"
		/>

		<div class="hero-content">
			<h1 class="hero-title">
				{{ $t("hero.greeting") }}
				<img
					src="/images/waving-hand.svg"
					alt="waving-hand"
					class="waving-hand"
					width="48"
					height="48"
					loading="lazy"
				/>
			</h1>
			<p class="hero-subtitle">
				<i18n-t keypath="hero.subtitle" tag="span">
					<span class="highlight">
						<img
							src="/images/thejenja.svg"
							alt="thejenja"
							class="thejenja-logo"
							width="128"
							height="40"
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
							tabindex="0"
							role="button"
							:aria-label="act.text"
							@keydown="(e) => onActivityKeydown(e, index, $event.target)"
						>
							{{ act.text }}
						</div>
					</TransitionGroup>
				</div>
			</div>
		</div>

		<NuxtLinkLocale
			to="/about"
			class="about-icon-link"
			:aria-label="$t('hero.learnMore')"
		>
			<User class="about-icon" />
		</NuxtLinkLocale>
	</section>
</template>

<script setup>
// ... (Весь JS код остается без изменений) ...
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { User } from "lucide-vue-next";

// --- Constants ---
const CONSTANTS = {
	CYCLE_DELAY: 4500,
	ANIMATION_DURATION: 0.9,
	STAGGER_DELAY: 0.12,
	LEAVE_DURATION: 0.5,
	RETRY_DELAY: 100,
};

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
const itemsToShow = ref(3);
const cycleTimeout = ref(null);
const isAnimating = ref(false);
const isAnyDragging = ref(false);

const preciseAge = computed(() => getPreciseAge(new Date("2006-08-31")));

const checkResponsiveCount = () => {
	const w = window.innerWidth;
	let newCount = 3;
	if (w < 640) newCount = 1;
	else if (w < 1024) newCount = 2;
	else newCount = 3;
	itemsToShow.value = newCount;
};

const onActivityKeydown = (e, index, el) => {
	if (e.key === "Backspace" || e.key === "Delete") {
		e.preventDefault();
		const newItems = [...visibleItems.value];
		newItems.splice(index, 1);
		visibleItems.value = newItems;
		nextTick(() => {
			const siblings = document.querySelectorAll(".activity");
			if (siblings.length > 0) {
				const nextFocusIndex = Math.min(index, siblings.length - 1);
				siblings[nextFocusIndex]?.focus();
			}
		});
	}
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		gsap.to(el, {
			scale: 0.9,
			duration: 0.1,
			yoyo: true,
			repeat: 1,
			onComplete: () => {
				gsap.to(el, {
					x: 5,
					duration: 0.05,
					yoyo: true,
					repeat: 5,
					clearProps: "x",
				});
			},
		});
	}
	if (e.key === "ArrowRight") {
		e.preventDefault();
		const next = el.nextElementSibling;
		if (next) next.focus();
	}
	if (e.key === "ArrowLeft") {
		e.preventDefault();
		const prev = el.previousElementSibling;
		if (prev) prev.focus();
	}
};

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
		duration: CONSTANTS.ANIMATION_DURATION,
		delay: el.dataset.index * CONSTANTS.STAGGER_DELAY,
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

	const left = el.offsetLeft;
	const top = el.offsetTop;
	const width = el.offsetWidth;

	gsap.set(el, {
		position: "absolute",
		left: left,
		top: top,
		width: width,
		margin: 0,
		zIndex: 0,
		pointerEvents: "none",
	});

	gsap.to(el, {
		opacity: 0,
		x: 40,
		filter: "blur(12px)",
		scale: 0.95,
		duration: CONSTANTS.LEAVE_DURATION,
		delay: el.dataset.index * 0.05,
		ease: "power2.in",
		onComplete: done,
	});
};

function updateActivities() {
	if (isAnimating.value || isAnyDragging.value || document.hidden) return;
	isAnimating.value = true;
	const total = allActivities.value.length;
	const nextSet = [];
	const count = itemsToShow.value;
	for (let i = 0; i < count; i++) {
		nextSet.push(allActivities.value[(currentIndex.value + i) % total]);
	}
	currentIndex.value = (currentIndex.value + count) % total;
	visibleItems.value = nextSet;
	setTimeout(() => {
		isAnimating.value = false;
		scheduleNextCycle();
	}, CONSTANTS.CYCLE_DELAY);
}

function scheduleNextCycle() {
	if (cycleTimeout.value) clearTimeout(cycleTimeout.value);
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	if (prefersReducedMotion) return;
	cycleTimeout.value = setTimeout(() => {
		updateActivities();
	}, CONSTANTS.RETRY_DELAY);
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
			el.focus();
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
	checkResponsiveCount();
	window.addEventListener("resize", checkResponsiveCount);
	document.addEventListener("visibilitychange", handleVisibilityChange);
	const startSet = [];
	const count = itemsToShow.value;
	for (let i = 0; i < count; i++) {
		startSet.push(allActivities.value[i]);
	}
	visibleItems.value = startSet;
	currentIndex.value = count;
	setTimeout(() => {
		scheduleNextCycle();
	}, 3000);
});

onUnmounted(() => {
	window.removeEventListener("resize", checkResponsiveCount);
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

	overflow: visible;
}

.hero::before {
	content: "";
	position: absolute;
	inset: 0;

	z-index: -1;
	filter: blur(30px);
	background: inherit;

	opacity: 0.5;
}

.floating-monster {
	position: absolute;
	bottom: -15px;
	right: 0;

	transform: rotate(-10deg);
	animation: float 4s ease-in-out infinite;
	z-index: 1;

	pointer-events: none;

	transition:
		right 0.3s ease,
		transform 0.3s ease;
}

@media (min-width: 1024px) {
	.floating-monster {
		width: 150px;
		/* На больших экранах выдвигаем вправо, 
		   так как там обычно есть отступы (margins) у контейнера */
		right: -50px;
		bottom: -25px;
		transform: rotate(-25deg);
	}
}

@keyframes float {
	0%,
	100% {
		transform: rotate(-10deg) translateY(0);
	}
	50% {
		transform: rotate(-10deg) translateY(-10px);
	}
}

@media (min-width: 1024px) {
	@keyframes float {
		0%,
		100% {
			transform: rotate(-25deg) translateY(0);
		}
		50% {
			transform: rotate(-25deg) translateY(-10px);
		}
	}
}

.hero-content {
	font-size: clamp(1.5rem, 2vw, 2rem);
	position: relative;

	z-index: 10;
}

.hero-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	position: relative;
}

.about-icon-link {
	position: absolute;
	top: 20px;
	right: 20px;
	background: var(--bg-tertiary);
	border: 1px solid var(--border-color, transparent);
	border-radius: 12px;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	color: var(--text);
	z-index: 20;
}

.about-icon-link:hover {
	background: var(--bg-secondary);
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-icon {
	width: 24px;
	height: 24px;
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

.activity {
	padding: 0.25rem 0.75rem;
	border-radius: 16px;
	cursor: grab;
	user-select: none;
	font-weight: 500;
	white-space: nowrap;
	background: var(--bg-mix);
	color: var(--act-color);
	will-change: transform, opacity, filter;
	backface-visibility: hidden;
	display: inline-flex;
	align-items: center;
	transition:
		background-color 0.3s ease,
		color 0.3s ease,
		transform 0.2s ease,
		box-shadow 0.2s ease;
	outline: none;
}

.activity:focus-visible {
	box-shadow:
		0 0 0 2px var(--act-color),
		0 0 0 4px var(--bg);
	z-index: 20;
}

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
	background-color: var(--act-color) !important;
	color: #ffffff !important;
}

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
