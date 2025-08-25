export default defineNuxtPlugin(() => {
	// Директива для анимаций кнопок
	const vAnimateButton = {
		mounted(el: HTMLElement, binding: any) {
			const { addHoverEffect, addClickAnimation } = useAnimations();

			const options = binding.value || {};

			// Добавляем hover эффект
			const cleanupHover = addHoverEffect(el, {
				scale: options.scale || 1.05,
				translateY: options.translateY || -2,
				duration: options.duration || 200,
			});

			// Добавляем click анимацию
			const cleanupClick = addClickAnimation(el);

			// Сохраняем функции очистки
			el._animationCleanup = () => {
				cleanupHover?.();
				cleanupClick?.();
			};
		},

		unmounted(el: HTMLElement) {
			if (el._animationCleanup) {
				el._animationCleanup();
			}
		},
	};

	// Директива для анимаций появления
	const vAnimateIn = {
		mounted(el: HTMLElement, binding: any) {
			const options = binding.value || {};
			const { shouldAnimate, getAnimationDuration } = useAnimationPreferences();

			if (!shouldAnimate("basic")) {
				return;
			}

			const duration = getAnimationDuration(options.duration || 600);
			const delay = options.delay || 0;
			const type = options.type || "slide-up";

			// Устанавливаем начальное состояние
			el.style.opacity = "0";
			el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
			el.style.transitionDelay = `${delay}ms`;

			switch (type) {
				case "slide-up":
					el.style.transform = "translateY(30px)";
					break;
				case "slide-down":
					el.style.transform = "translateY(-30px)";
					break;
				case "slide-left":
					el.style.transform = "translateX(-30px)";
					break;
				case "slide-right":
					el.style.transform = "translateX(30px)";
					break;
				case "scale":
					el.style.transform = "scale(0.9)";
					break;
				case "fade":
					el.style.transform = "none";
					break;
			}

			// Запускаем анимацию
			requestAnimationFrame(() => {
				el.style.opacity = "1";
				el.style.transform = "none";
			});
		},
	};

	return {
		provide: {
			vAnimateButton,
			vAnimateIn,
		},
	};
});
