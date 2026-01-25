<template>
	<div class="navigation-wrapper" role="banner">
		<div class="nav-toggle-container">
			<NuxtLinkLocale
				v-if="isProjectPage"
				to="/projects"
				class="nav-toggle"
				:aria-label="$t('navigation.backToProjects')"
			>
				<ArrowLeft class="nav-icon" />
			</NuxtLinkLocale>
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
		</div>
		<div id="navigation" popover>
			<div class="nav-content">
				<div class="nav-header">
					<img
						src="/images/thejenja.svg"
						alt="logo"
						class="nav-logo"
						width="120"
						height="32"
						loading="lazy"
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

				<!-- Основная навигация -->
				<div class="nav-section">
					<NuxtLinkLocale to="/" class="nav-link" @click="closeNavigation">
						<Home />
						{{ $t("navigation.home") }}
					</NuxtLinkLocale>
					<NuxtLinkLocale to="/about" class="nav-link" @click="closeNavigation">
						<User />
						{{ $t("navigation.about") }}
					</NuxtLinkLocale>
					<NuxtLinkLocale
						to="/projects"
						class="nav-link"
						@click="closeNavigation"
					>
						<Folder />
						{{ $t("navigation.projects") }}
					</NuxtLinkLocale>
					<NuxtLinkLocale to="/uses" class="nav-link" @click="closeNavigation">
						<Code />
						{{ $t("navigation.uses") }}
					</NuxtLinkLocale>
				</div>

				<hr />

				<!-- Плитки настроек -->
				<div class="nav-section nav-tiles">
					<LanguageToggle />
					<ThemeToggle />
				</div>

				<hr />

				<!-- Дополнительные ссылки (Резюме и Git) -->
				<div class="nav-section">
					<!-- Резюме перенесено сюда -->
					<NuxtLinkLocale
						to="/resume"
						class="nav-link"
						@click="closeNavigation"
					>
						<FileText />
						{{ $t("navigation.resume") }}
					</NuxtLinkLocale>

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
import {
	Folder,
	Github,
	Home,
	Menu,
	X,
	ArrowLeft,
	User,
	Code,
	FileText,
} from "lucide-vue-next";
import { watch, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const isOpen = ref(false);
const navToggle = ref();

const route = useRoute();

// Определяем, находимся ли мы на странице проекта
const isProjectPage = computed(() => {
	return (
		route.path.includes("/projects/") &&
		route.params.slug &&
		Object.keys(route.params).includes("slug")
	);
});

const toggleNavigation = () => {
	// Состояние будет обновлено через события popover
};

const closeNavigation = () => {
	// Закрываем popover программно
	if (typeof document !== "undefined") {
		const navigation = document.getElementById("navigation");
		if (navigation && navigation.matches(":popover-open")) {
			navigation.hidePopover();
		}
	}
};

// Отслеживаем события popover для синхронизации состояния
onMounted(() => {
	if (typeof document !== "undefined") {
		const navigation = document.getElementById("navigation");

		if (navigation) {
			navigation.addEventListener("toggle", (event) => {
				isOpen.value = event.newState === "open";
			});
		}
	}
});

// Следим за изменениями маршрута и закрываем навигацию
watch(
	() => route.path,
	() => {
		isOpen.value = false;
		// Закрываем popover программно
		if (typeof document !== "undefined") {
			const navigation = document.getElementById("navigation");
			if (navigation && navigation.matches(":popover-open")) {
				navigation.hidePopover();
			}
		}
	},
);
</script>

<style scoped>
.nav-toggle-container {
	z-index: 1000;
	display: flex;
	gap: 10px;
	position: fixed;
	top: 1rem;
	left: 1rem;
}

.nav-toggle {
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
}

.nav-logo {
	height: 2rem;
}

.nav-icon {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	flex-direction: column;
}

#navigation {
	position: fixed;
	top: 0;
	left: 0;
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

/* Стили для сетки плиток */
.nav-tiles {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.5rem;
	margin: 0.25rem 0;
}

#navigation:popover-open {
	opacity: 1;
	transform: translateY(0) scale(1);
}

@starting-style {
	#navigation:popover-open {
		opacity: 0;
		transform: translateY(-10px) scale(0.95);
	}
}

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

	animation: nav-item-appear 0.3s ease-out backwards;
	animation-delay: calc(var(--nav-index, 0) * 0.05s + 0.1s);
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

.nav-link:hover {
	background: var(--bg-tertiary);
}

.nav-link svg {
	width: 1.25rem;
	height: 1.25rem;
	flex-shrink: 0;
}

/* Blur Fade Transitions */
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
		background-color: color-mix(in srgb, var(--bg), transparent 20%);
		backdrop-filter: blur(3px);
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

@media (prefers-reduced-motion: reduce) {
	#navigation,
	.nav-link,
	.nav-toggle {
		transition: none;
		animation: none;
	}

	#navigation:popover-open,
	#navigation:not(:popover-open) {
		transform: none;
	}
}
</style>
