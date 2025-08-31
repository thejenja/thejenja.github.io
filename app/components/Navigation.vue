<template>
	<div class="navigation-wrapper">
		<button
			ref="navToggle"
			class="nav-toggle"
			popovertarget="navigation"
			@click="toggleNavigation"
			:aria-label="$t('navigation.toggle')"
		>
			<transition name="blur-fade" mode="out-in">
				<Menu v-if="!isOpen" class="nav-icon" />
				<X v-else class="nav-icon" />
			</transition>
		</button>
		<div id="navigation" popover>
			<div class="nav-content">
				<div class="nav-header">
					<img
						src="/images/thejenja.svg"
						alt="logo"
						class="nav-logo"
						width="120"
						height="32"
					/>
				</div>
				<button
					class="nav-close"
					popovertarget="navigation"
					popovertargetaction="hide"
					@click="toggleNavigation"
				>
					<X />
				</button>
				<div class="nav-section">
					<NuxtLinkLocale to="/" class="nav-link" @click="closeNavigation">
						<Home />
						{{ $t("navigation.home") }}
					</NuxtLinkLocale>
					<NuxtLinkLocale
						to="/projects"
						class="nav-link"
						@click="closeNavigation"
					>
						<Folder />
						{{ $t("navigation.projects") }}
					</NuxtLinkLocale>
				</div>
				<hr />
				<div class="nav-section">
					<LanguageToggle />
					<ThemeToggle />

					<hr />

					<a
						href="https://github.com/thejenja/thejenja.github.io"
						target="_blank"
						rel="noopener noreferrer"
						class="nav-link"
					>
						<Github />
						{{ $t("navigation.sourceCode") }}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Folder, Github, Home, Menu, X } from "lucide-vue-next";
import { watch } from "vue";

const isOpen = ref(false);
const navToggle = ref();

const toggleNavigation = () => {
	// Состояние будет обновлено через события popover
};

const closeNavigation = () => {
	// Закрываем popover программно
	const navigation = document.getElementById("navigation");
	if (navigation && navigation.matches(":popover-open")) {
		navigation.hidePopover();
	}
};

// Отслеживаем события popover для синхронизации состояния
onMounted(() => {
	const navigation = document.getElementById("navigation");

	if (navigation) {
		navigation.addEventListener("toggle", (event) => {
			isOpen.value = event.newState === "open";
		});
	}
});

// Следим за изменениями маршрута и закрываем навигацию
const route = useRoute();
watch(
	() => route.path,
	() => {
		isOpen.value = false;
		// Закрываем popover программно
		const navigation = document.getElementById("navigation");
		if (navigation && navigation.matches(":popover-open")) {
			navigation.hidePopover();
		}
	}
);
</script>

<style scoped>
.navigation-wrapper {
	/* Обертка для Navigation компонента */
}

.nav-toggle {
	position: fixed;
	top: 1rem;
	left: 1rem;
	z-index: 1000;
	appearance: none;
	border: 0;
	background: transparent;
	color: var(--text);
	border-radius: 8px;
	cursor: pointer;
	padding: 0.75rem;
	anchor-name: --btn-nav;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.nav-toggle:hover {
	background: var(--bg-tertiary);
	transform: scale(1.05);
}

.nav-logo {
	height: 2rem;
}

/* Анимированная иконка гамбургера */
.nav-icon {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	flex-direction: column;
}

.nav-icon__line {
	width: 70%;
	height: 2px;
	background: var(--text);
	border-radius: 1px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	transform-origin: center;
}

#navigation {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	background: var(--bg-secondary);
	border: 0;
	border-radius: 16px;
	padding: 0.75rem;
	margin-top: 1rem;
	color: var(--text);
	flex-shrink: 0;
	position-anchor: --btn-nav;
	top: anchor(--btn-nav bottom);
	left: anchor(--btn-nav left);

	/* Современные CSS анимации для popover */
	transition:
		opacity 0.3s ease,
		transform 0.3s ease,
		overlay 0.3s ease allow-discrete,
		display 0.3s ease allow-discrete;
}

.nav-section {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

/* Анимация появления popover */
#navigation:popover-open {
	opacity: 1;
	transform: translateY(0) scale(1);
}

/* Начальное состояние для анимации */
@starting-style {
	#navigation:popover-open {
		opacity: 0;
		transform: translateY(-10px) scale(0.95);
	}
}

/* Анимация исчезновения */
#navigation:not(:popover-open) {
	opacity: 0;
	transform: translateY(-10px) scale(0.95);
}

.nav-header,
.nav-close {
	display: none;
}

.nav-content {
	height: 100%;
}

hr {
	border: 0;
	border-top: 2px solid var(--bg-tertiary);
	margin: 0.5rem 0;
}

.nav-link {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.3rem 0.5rem;
	color: var(--text);
	font-size: 1.2rem;
	text-decoration: none;
	border-radius: 8px;
	transition: all 0.3s ease;
	border: none;
	background: none;
	cursor: pointer;
	width: 100%;
	text-align: left;

	/* Анимация появления элементов навигации */
	animation: nav-item-appear 0.3s ease-out backwards;
	animation-delay: calc(var(--nav-index, 0) * 0.05s + 0.1s);
}

.nav-section:nth-child(1) .nav-link {
	--nav-index: 0;
}

.nav-section:nth-child(2) .nav-link {
	--nav-index: 1;
}

.nav-section:nth-child(3) .nav-link {
	--nav-index: 2;
}

@keyframes nav-item-appear {
	from {
		opacity: 0;
		transform: translateX(-20px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.nav-link svg {
	width: 1.25rem;
	height: 1.25rem;
}

.nav-link:hover {
	background: var(--bg-tertiary);
}

.nav-link svg {
	flex-shrink: 0;
}

.blur-fade-enter-active,
.blur-fade-leave-active {
	transition:
		opacity 0.25s ease,
		filter 0.25s ease;
}

.blur-fade-enter-from {
	opacity: 0;
	filter: blur(4px);
}
.blur-fade-enter-to {
	opacity: 1;
	filter: blur(0);
}

.blur-fade-leave-from {
	opacity: 1;
	filter: blur(0);
}
.blur-fade-leave-to {
	opacity: 0;
	filter: blur(4px);
}

@media (max-width: 768px) {
	.nav-toggle {
		position: sticky;
		margin: 0.5rem 0;
	}
	#navigation {
		width: 100%;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: 0;
		padding: 1rem;
		border-radius: 0 0 16px 16px;
		border: 0;
	}
	[popover]::backdrop {
		background-color: var(--bg) / 0.5;
		backdrop-filter: blur(10px);
	}
	.nav-link {
		width: 100%;
	}
	.nav-header,
	.nav-close {
		display: block;
	}

	.nav-close {
		appearance: none;
		border: 0;
		background: transparent;
		color: var(--text);
		cursor: pointer;
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	#navigation,
	.nav-link,
	.nav-toggle,
	.nav-icon__line {
		transition: none;
		animation: none;
	}

	#navigation:popover-open,
	#navigation:not(:popover-open) {
		transform: none;
	}

	.nav-toggle:hover {
		transform: none;
	}
}
</style>
