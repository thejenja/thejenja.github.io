<template>
	<div class="hero-activity">
		<span class="activity-label">{{ $t("hero.activity") }}</span>
		<div class="activity-viewport" aria-live="polite">
			<TransitionGroup
				tag="div"
				class="activity-tags"
				:class="{ 'shaking-mode': isAnyDragging }"
				:css="false"
				@before-enter="onBeforeEnter"
				@enter="onEnter"
				@leave="onLeave"
				role="list"
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
					role="listitem"
					:aria-label="act.text"
					@keydown="(e) => onActivityKeydown(e, index, $event.target)"
				>
					<Icon v-if="act.icon" :name="act.icon" :size="24" />
					{{ act.text }}
				</div>
			</TransitionGroup>
		</div>
		<div class="activity-controls">
			<button
				class="pause-btn"
				@click="togglePause"
				:aria-label="isPaused ? 'Play' : 'Pause'"
			>
				<Icon
					:name="isPaused ? 'mingcute:play-fill' : 'mingcute:pause-fill'"
					:size="16"
				/>
			</button>
		</div>
	</div>
	<div class="activity-progress-container">
		<div
			v-if="!isPaused"
			:key="progressKey"
			class="activity-progress"
			:style="{ animationDuration: CONSTANTS.CYCLE_DELAY + 'ms' }"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

if (typeof gsap !== "undefined" && Draggable) {
	gsap.registerPlugin(Draggable);
}

const { t } = useI18n();

const CONSTANTS = {
	CYCLE_DELAY: 4500,
	ANIMATION_DURATION: 0.9,
	STAGGER_DELAY: 0.12,
	LEAVE_DURATION: 0.5,
	RETRY_DELAY: 100,
};

const allActivities = computed(() => [
	{
		text: t("activities.frontend"),
		icon: "mingcute:code-line",
		color: "#fbbf24",
	},
	{
		text: t("activities.backend"),
		icon: "mingcute:server-fill",
		color: "#f43f5e",
	},
	{
		text: t("activities.design"),
		icon: "mingcute:palette-fill",
		color: "#10b981",
	},
	{
		text: t("activities.music"),
		icon: "mingcute:music-fill",
		color: "#ec4899",
	},
	{
		text: t("activities.video"),
		icon: "mingcute:video-fill",
		color: "#3b82f6",
	},
	{
		text: t("activities.animation"),
		icon: "mingcute:magic-1-fill",
		color: "#8b5cf6",
	},
	{
		text: t("activities.openSource"),
		icon: "mingcute:github-fill",
		color: "#aaa",
	},
	{
		text: t("activities.blogging"),
		icon: "mingcute:threads-line",
		color: "#16a34a",
	},
	{
		text: t("activities.neuralNetworks"),
		icon: "mingcute:robot-fill",
		color: "#c026d3",
	},
]);

const visibleItems = ref([]);
const currentIndex = ref(0);
const itemsToShow = ref(3);
const cycleTimeout = ref(null);
const isAnimating = ref(false);
const isAnyDragging = ref(false);
const isPaused = ref(false);
const progressKey = ref(0);
const shakingTweens = ref([]);

const checkResponsiveCount = () => {
	const w = window.innerWidth;
	let newCount = 3;
	if (w < 640) newCount = 1;
	else if (w < 1024) newCount = 2;
	else newCount = 3;
	itemsToShow.value = newCount;
};

watch(itemsToShow, () => {
	if (!isAnimating.value && !isAnyDragging.value && !isPaused.value) {
		updateActivities();
	}
});

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

	const parent = el.parentElement;
	const parentRect = parent.getBoundingClientRect();
	const elRect = el.getBoundingClientRect();

	const left = elRect.left - parentRect.left;
	const top = elRect.top - parentRect.top;

	gsap.set(el, {
		position: "absolute",
		left: left + "px",
		top: top + "px",
		width: elRect.width + "px",
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
	if (
		isAnimating.value ||
		isAnyDragging.value ||
		document.hidden ||
		isPaused.value
	)
		return;
	isAnimating.value = true;
	const total = allActivities.value.length;
	const nextSet = [];
	const count = itemsToShow.value;
	for (let i = 0; i < count; i++) {
		nextSet.push(allActivities.value[(currentIndex.value + i) % total]);
	}
	currentIndex.value = (currentIndex.value + count) % total;
	visibleItems.value = nextSet;
	progressKey.value++;
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
	if (prefersReducedMotion || isPaused.value) return;
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

function togglePause() {
	isPaused.value = !isPaused.value;
	if (isPaused.value) {
		if (cycleTimeout.value) clearTimeout(cycleTimeout.value);
	} else {
		progressKey.value++;
		scheduleNextCycle();
	}
}

function startShaking() {
	const activities = document.querySelectorAll(".activity:not(.dragging)");
	const tweens = [];
	activities.forEach((el) => {
		const delay = Math.random() * 0.15;
		const duration = 0.08 + Math.random() * 0.04;
		const angle = 0.8 + Math.random() * 0.6;

		const tween = gsap.to(el, {
			rotation: angle,
			duration: duration,
			delay: delay,
			yoyo: true,
			repeat: -1,
			ease: "sine.inOut",
			transformOrigin: "center center",
		});
		tweens.push(tween);
	});
	shakingTweens.value = tweens;
}

function stopShaking() {
	shakingTweens.value.forEach((tween) => tween.kill());
	shakingTweens.value = [];
	const activities = document.querySelectorAll(".activity");
	activities.forEach((el) => {
		gsap.set(el, { rotation: 0 });
	});
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
			startShaking();
			gsap.to(el, { scale: 1.1, duration: 0.2 });
			el.focus();
		},
		onDragEnd: function () {
			el.classList.remove("dragging");
			stopShaking();
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
	stopShaking();
});
</script>

<style scoped>
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
	background: color-mix(in srgb, var(--bg-mix), transparent 15%);
	color: var(--act-color);
	will-change: transform, opacity, filter;
	backface-visibility: hidden;
	display: inline-flex;
	gap: 8px;
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

.activity-controls {
	flex-shrink: 0;
	margin-left: 0.5rem;
}

.pause-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 8px;
	border: none;
	background: var(--bg-tertiary);
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.2s ease;
	position: fixed;
	left: 1rem;
	bottom: 1rem;
}

.pause-btn:hover {
	background: var(--bg-secondary);
	color: var(--text);
	transform: scale(1.05);
}

.activity-progress-container {
	height: 2px;
	width: 100%;
	background: var(--bg-tertiary);
	border-radius: 1px;
	overflow: hidden;
    position: fixed;
	left: 0;
	bottom: 0;
}

.activity-progress {
	height: 100%;
	background: #6a537e;
	border-radius: 1px;
	animation: progress-shrink linear forwards;
	transform-origin: left;
}

.activity-progress.paused {
	animation-play-state: paused;
}

@keyframes progress-shrink {
	0% {
		transform: scaleX(1);
	}
	100% {
		transform: scaleX(0);
	}
}
</style>
