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

			<ActivityTags />
		</div>
	</section>
</template>

<script setup>
import { computed } from "vue";
import ActivityTags from "./ActivityTags.vue";

function getPreciseAge(birthDate) {
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
	return age;
}

const preciseAge = computed(() => getPreciseAge(new Date("2006-08-31")));
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
	min-height: 330px;
	border: 0;
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
	animation: rotateBlobs 12s cubic-bezier(0.22, 1, 0.36, 1) infinite;
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

@keyframes rotateBlobs {
	0%,
	to {
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
}

.highlight {
	display: inline-flex;
	align-items: center;
	vertical-align: middle;
	height: 1.2em;
}

html:not(.dark) .waving-hand {
	filter: invert(1);
}
</style>
