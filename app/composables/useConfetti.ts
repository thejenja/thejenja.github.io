import { ref, onUnmounted } from "vue";

interface ConfettiOptions {
	particleCount?: number;
	spread?: number;
	origin?: { x: number; y: number };
	colors?: string[];
	gravity?: number;
	drift?: number;
}

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	color: string;
	rotation: number;
	rotationSpeed: number;
	size: number;
	shape: "circle" | "square" | "triangle" | "star";
	opacity: number;
	wobble: number;
	wobbleSpeed: number;
}

export function useConfetti() {
	const isActive = ref(false);
	const particles = ref<Particle[]>([]);
	let animationId: number | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;

	const defaultColors = [
		"#ff6b9d",
		"#feca57",
		"#48dbfb",
		"#ff9ff3",
		"#54a0ff",
		"#5f27cd",
		"#00d2d3",
		"#1dd1a1",
	];

	const createParticle = (
		originX: number,
		originY: number,
		colors: string[],
		spread = 360,
	): Particle => {
		const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
		const velocity = 8 + Math.random() * 12;
		const shapes: Particle["shape"][] = ["circle", "square", "triangle", "star"];

		return {
			x: originX + (Math.random() - 0.5) * 20,
			y: originY + (Math.random() - 0.5) * 10,
			vx: Math.cos(angle) * velocity,
			vy: Math.sin(angle) * velocity - 8,
			color: colors[Math.floor(Math.random() * colors.length)] ?? "#fff",
			rotation: Math.random() * 360,
			rotationSpeed: (Math.random() - 0.5) * 15,
			size: 4 + Math.random() * 10,
			shape: shapes[Math.floor(Math.random() * shapes.length)] ?? "square",
			opacity: 0.8 + Math.random() * 0.2,
			wobble: Math.random() * 10,
			wobbleSpeed: (Math.random() - 0.5) * 0.1,
		};
	};

	const drawParticle = (particle: Particle) => {
		if (!ctx) return;

		ctx.save();
		ctx.translate(particle.x, particle.y);
		ctx.rotate((particle.rotation * Math.PI) / 180);
		ctx.globalAlpha = particle.opacity;
		ctx.fillStyle = particle.color;

		switch (particle.shape) {
			case "circle":
				ctx.beginPath();
				ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
				ctx.fill();
				break;
			case "square":
				ctx.fillRect(
					-particle.size / 2,
					-particle.size / 2,
					particle.size,
					particle.size,
				);
				break;
			case "triangle":
				ctx.beginPath();
				ctx.moveTo(0, -particle.size / 2);
				ctx.lineTo(-particle.size / 2, particle.size / 2);
				ctx.lineTo(particle.size / 2, particle.size / 2);
				ctx.closePath();
				ctx.fill();
				break;
			case "star":
				drawStar(ctx, 0, 0, 5, particle.size / 2, particle.size / 4);
				break;
		}

		ctx.restore();
	};

	const drawStar = (
		ctx: CanvasRenderingContext2D,
		cx: number,
		cy: number,
		spikes: number,
		outerRadius: number,
		innerRadius: number,
	) => {
		let rot = (Math.PI / 2) * 3;
		const step = Math.PI / spikes;

		ctx.beginPath();
		ctx.moveTo(cx, cy - outerRadius);

		for (let i = 0; i < spikes; i++) {
			ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
			rot += step;

			ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
			rot += step;
		}

		ctx.lineTo(cx, cy - outerRadius);
		ctx.closePath();
		ctx.fill();
	};

	const updateParticle = (
		particle: Particle,
		gravity: number,
		drag: number,
		drift: number,
	) => {
		particle.wobble += particle.wobbleSpeed;
		particle.x += particle.vx + Math.sin(particle.wobble) * 0.5 + drift;
		particle.y += particle.vy;
		particle.vy += gravity;
		particle.vx *= drag;
		particle.vy *= drag;
		particle.rotation += particle.rotationSpeed;
		particle.opacity *= 0.995;
	};

	const animate = () => {
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const gravity = 0.25;
		const drag = 0.98;
		const drift = 0.05;

		particles.value = particles.value.filter((particle) => {
			updateParticle(particle, gravity, drag, drift);
			drawParticle(particle);

			return particle.y < canvas!.height + 50 && particle.opacity > 0.01;
		});

		if (particles.value.length > 0) {
			animationId = requestAnimationFrame(animate);
		} else {
			isActive.value = false;
			cleanup();
		}
	};

	const setupCanvas = () => {
		if (typeof document === "undefined") return;

		canvas = document.createElement("canvas");
		canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 9999;
		`;
		document.body.appendChild(canvas);

		const dpr = window.devicePixelRatio || 1;
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		canvas.style.width = "100%";
		canvas.style.height = "100%";

		ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.scale(dpr, dpr);
		}

		const handleResize = () => {
			if (!canvas) return;
			const dpr = window.devicePixelRatio || 1;
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			ctx?.scale(dpr, dpr);
		};

		window.addEventListener("resize", handleResize);
	};

	const cleanup = () => {
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		if (canvas && canvas.parentNode) {
			canvas.parentNode.removeChild(canvas);
			canvas = null;
			ctx = null;
		}
	};

	const trigger = (options: ConfettiOptions = {}) => {
		if (typeof document === "undefined") return;

		const {
			particleCount = 100,
			spread = 90,
			origin = { x: 0.5, y: 0.5 },
			colors = defaultColors,
		} = options;

		cleanup();

		setupCanvas();

		const originX = origin.x * window.innerWidth;
		const originY = origin.y * window.innerHeight;

		particles.value = Array.from({ length: particleCount }, () =>
			createParticle(originX, originY, colors, spread),
		);

		isActive.value = true;
		animate();
	};

	onUnmounted(() => {
		cleanup();
	});

	return {
		trigger,
		isActive,
		particles,
	};
}
