import { ref, onMounted, onUnmounted } from "vue";

export interface AnimationOptions {
	duration?: number;
	stagger?: number;
	distance?: number;
	ease?: string;
	threshold?: number;
	rootMargin?: string;
}

export function useAnimations(options: AnimationOptions = {}) {
	const {
		duration = 400,
		stagger = 100,
		distance = 30,
		ease = "cubic-bezier(0.4, 0, 0.2, 1)",
		threshold = 0.1,
		rootMargin = "0px 0px -50px 0px",
	} = options;

	const { shouldAnimate, getAnimationDuration, getStaggerDelay } =
		useAnimationPreferences();

	// === БАЗОВЫЕ АНИМАЦИИ ===
	const fadeIn = (elements: HTMLElement | HTMLElement[], delay: number = 0) => {
		if (!shouldAnimate("basic")) {
			const els = Array.isArray(elements) ? elements : [elements];
			els.forEach((el) => {
				el.style.opacity = "1";
				el.style.transform = "none";
			});
			return;
		}

		const els = Array.isArray(elements) ? elements : [elements];
		els.forEach((el, index) => {
			const animDuration = getAnimationDuration(duration, "basic");
			const staggerDelay = getStaggerDelay(stagger);

			el.style.opacity = "0";
			el.style.transition = `opacity ${animDuration}ms ${ease}`;
			el.style.transitionDelay = `${delay + index * staggerDelay}ms`;

			requestAnimationFrame(() => {
				el.style.opacity = "1";
			});
		});
	};

	const slideIn = (
		elements: HTMLElement | HTMLElement[],
		direction: "up" | "down" | "left" | "right" = "up",
		delay: number = 0
	) => {
		if (!shouldAnimate("basic")) {
			const els = Array.isArray(elements) ? elements : [elements];
			els.forEach((el) => {
				el.style.opacity = "1";
				el.style.transform = "none";
			});
			return;
		}

		const els = Array.isArray(elements) ? elements : [elements];
		const transforms = {
			up: `translateY(${distance}px)`,
			down: `translateY(-${distance}px)`,
			left: `translateX(${distance}px)`,
			right: `translateX(-${distance}px)`,
		};

		els.forEach((el, index) => {
			const animDuration = getAnimationDuration(duration, "basic");
			const staggerDelay = getStaggerDelay(stagger);

			el.style.opacity = "0";
			el.style.transform = transforms[direction];
			el.style.transition = `opacity ${animDuration}ms ${ease}, transform ${animDuration}ms ${ease}`;
			el.style.transitionDelay = `${delay + index * staggerDelay}ms`;

			requestAnimationFrame(() => {
				el.style.opacity = "1";
				el.style.transform = "none";
			});
		});
	};

	const scaleIn = (
		elements: HTMLElement | HTMLElement[],
		delay: number = 0
	) => {
		if (!shouldAnimate("basic")) {
			const els = Array.isArray(elements) ? elements : [elements];
			els.forEach((el) => {
				el.style.opacity = "1";
				el.style.transform = "none";
			});
			return;
		}

		const els = Array.isArray(elements) ? elements : [elements];
		els.forEach((el, index) => {
			const animDuration = getAnimationDuration(duration, "basic");
			const staggerDelay = getStaggerDelay(stagger);

			el.style.opacity = "0";
			el.style.transform = "scale(0.8)";
			el.style.transition = `opacity ${animDuration}ms ${ease}, transform ${animDuration}ms ${ease}`;
			el.style.transitionDelay = `${delay + index * staggerDelay}ms`;

			requestAnimationFrame(() => {
				el.style.opacity = "1";
				el.style.transform = "scale(1)";
			});
		});
	};

	// === HOVER АНИМАЦИИ ===
	const addHoverEffect = (
		element: HTMLElement,
		options: {
			scale?: number;
			translateY?: number;
			duration?: number;
		} = {}
	) => {
		if (!shouldAnimate("basic")) return;

		const { scale = 1.05, translateY = -2, duration: number = 200 } = options;
		const animDuration = getAnimationDuration(duration, "basic");

		const originalTransition = element.style.transition;
		element.style.transition = `transform ${animDuration}ms ${ease}`;

		const handleMouseEnter = () => {
			element.style.transform = `scale(${scale}) translateY(${translateY}px)`;
		};

		const handleMouseLeave = () => {
			element.style.transform = "scale(1) translateY(0)";
		};

		element.addEventListener("mouseenter", handleMouseEnter);
		element.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			element.removeEventListener("mouseenter", handleMouseEnter);
			element.removeEventListener("mouseleave", handleMouseLeave);
			element.style.transition = originalTransition;
			element.style.transform = "";
		};
	};

	// === CLICK АНИМАЦИИ ===
	const addClickAnimation = (element: HTMLElement) => {
		if (!shouldAnimate("basic")) return;

		const handleClick = () => {
			element.style.transform = "scale(0.95)";
			setTimeout(() => {
				element.style.transform = "";
			}, 150);
		};

		element.addEventListener("click", handleClick);

		return () => {
			element.removeEventListener("click", handleClick);
		};
	};

	// === SCROLL АНИМАЦИИ ===
	const elements = ref<HTMLElement[]>([]);
	const observer = ref<IntersectionObserver | null>(null);

	const registerScrollElement = (
		el: HTMLElement,
		animationType: "fade" | "slide" | "scale" = "fade",
		delay: number = 0
	) => {
		if (!el) return;

		elements.value.push(el);

		if (!shouldAnimate("basic")) {
			el.style.opacity = "1";
			el.style.transform = "none";
			return;
		}

		// Устанавливаем начальное состояние
		el.style.opacity = "0";

		switch (animationType) {
			case "slide":
				el.style.transform = "translateY(30px)";
				break;
			case "scale":
				el.style.transform = "scale(0.8)";
				break;
			default:
				el.style.transform = "none";
		}

		const animDuration = getAnimationDuration(duration, "basic");
		el.style.transition = `opacity ${animDuration}ms ${ease}, transform ${animDuration}ms ${ease}`;
		el.style.transitionDelay = `${delay}ms`;

		if (observer.value) {
			observer.value.observe(el);
		}
	};

	const animateScrollElement = (el: HTMLElement) => {
		el.style.opacity = "1";
		el.style.transform = "none";
	};

	onMounted(() => {
		observer.value = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animateScrollElement(entry.target as HTMLElement);
					}
				});
			},
			{ threshold, rootMargin }
		);

		elements.value.forEach((el) => {
			if (observer.value) {
				observer.value.observe(el);
			}
		});
	});

	onUnmounted(() => {
		if (observer.value) {
			observer.value.disconnect();
		}
	});

	return {
		// Базовые анимации
		fadeIn,
		slideIn,
		scaleIn,

		// Hover анимации
		addHoverEffect,

		// Click анимации
		addClickAnimation,

		// Scroll анимации
		registerScrollElement,
		animateScrollElement,
	};
}
