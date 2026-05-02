<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { gsap } from 'gsap/dist/gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

// Регистрируем плагин
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollToPlugin);
}

// Типы
interface ProjectMeta {
	slug?: string;
	date?: string;
}

interface Project {
	title?: string;
	date?: string;
	meta?: ProjectMeta;
	_path?: string;
}

interface MonthData {
	year: number;
	month: number;
	monthName: string;
	id: string;
}

interface Props {
	projects: Project[];
}

const props = defineProps<Props>();

const { locale } = useI18n();
const isVisible = ref(true);
const activeMonthId = ref<string>('');
const activeYear = ref<number | null>(null);

// Получаем уникальные годы
const years = computed(() => {
	const yearSet = new Set<number>();
	props.projects.forEach(project => {
		const date = new Date(project.date || project.meta?.date || '');
		if (!isNaN(date.getTime())) {
			yearSet.add(date.getFullYear());
		}
	});
	return Array.from(yearSet).sort((a, b) => b - a);
});

// Получаем месяцы для активного года
const monthsForActiveYear = computed<MonthData[]>(() => {
	if (!activeYear.value) return [];

	const monthsMap = new Map<number, MonthData>();

	props.projects.forEach(project => {
		const date = new Date(project.date || project.meta?.date || '');
		if (isNaN(date.getTime())) return;

		if (date.getFullYear() === activeYear.value) {
			const month = date.getMonth();
			if (!monthsMap.has(month)) {
				const monthDate = new Date(activeYear.value, month);
				monthsMap.set(month, {
					year: activeYear.value,
					month,
					monthName: monthDate.toLocaleDateString(
						locale.value === 'ru' ? 'ru-RU' : 'en-US',
						{ month: 'short' }
					),
					id: `${activeYear.value}-${String(month + 1).padStart(2, '0')}`
				});
			}
		}
	});

	return Array.from(monthsMap.values()).sort((a, b) => b.month - a.month);
});

// Скролл к секции
const scrollToSection = (monthData: MonthData) => {
	const sectionId = `month-${monthData.id}`;
	const element = document.getElementById(sectionId);

	if (element) {
		gsap.to(window, {
			duration: 0.8,
			scrollTo: { y: element, offsetY: 120 },
			ease: 'power2.inOut'
		});
	}
};

// Скролл к году (первый месяц года)
const scrollToYear = (year: number) => {
	// Находим первый месяц этого года
	const monthsMap = new Map<number, MonthData>();
	props.projects.forEach(project => {
		const date = new Date(project.date || project.meta?.date || '');
		if (!isNaN(date.getTime()) && date.getFullYear() === year) {
			const month = date.getMonth();
			if (!monthsMap.has(month)) {
				const monthDate = new Date(year, month);
				monthsMap.set(month, {
					year,
					month,
					monthName: monthDate.toLocaleDateString(
						locale.value === 'ru' ? 'ru-RU' : 'en-US',
						{ month: 'short' }
					),
					id: `${year}-${String(month + 1).padStart(2, '0')}`
				});
			}
		}
	});

	const months = Array.from(monthsMap.values()).sort((a, b) => b.month - a.month);
	const firstMonth = months[0];
	if (firstMonth) {
		scrollToSection(firstMonth);
	}
};

// Проверка активности месяца
const isMonthActive = (monthData: MonthData): boolean => {
	return activeMonthId.value === `month-${monthData.id}`;
};

// Проверка активности года
const isYearActive = (year: number): boolean => {
	return activeYear.value === year;
};

// Intersection Observer
let observer: IntersectionObserver | null = null;
let visibilityHandler: (() => void) | null = null;

// Функция для инициализации observer
const initObserver = () => {
	if (!observer) return;
	
	const monthGroups = document.querySelectorAll('.month-group');
	
	// Если элементов нет, попробуем позже
	if (monthGroups.length === 0) {
		setTimeout(initObserver, 300);
		return;
	}
	
	monthGroups.forEach((el) => {
		observer?.observe(el);
	});
};

onMounted(() => {
	// Устанавливаем начальный активный год
	activeYear.value = years.value[0] || null;

	// Intersection Observer для отслеживания активных секций
	observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const id = entry.target.id;
					if (id.startsWith('month-')) {
						activeMonthId.value = id;

						// Извлекаем год из ID
						const match = id.match(/month-(\d{4})-/);
						if (match && match[1]) {
							const year = parseInt(match[1]);
							if (activeYear.value !== year) {
								activeYear.value = year;
							}
						}
					}
				}
			});
		},
		{
			rootMargin: '-10% 0px -50% 0px',
			threshold: 0.1
		}
	);

	// Инициализируем observer с задержкой для гарантии рендера DOM
	setTimeout(initObserver, 500);

	// Показываем/скрываем scrubber на мобильных при скролле
	let lastScrollY = window.scrollY;
	visibilityHandler = () => {
		if (window.innerWidth <= 768) {
			const currentScrollY = window.scrollY;
			isVisible.value = currentScrollY < lastScrollY || currentScrollY < 100;
			lastScrollY = currentScrollY;
		}
	};

	window.addEventListener('scroll', visibilityHandler, { passive: true });
});

onUnmounted(() => {
	observer?.disconnect();
	if (visibilityHandler) {
		window.removeEventListener('scroll', visibilityHandler);
	}
});

// Обновляем observer при изменении проектов
watch(() => props.projects, () => {
	nextTick(() => {
		observer?.disconnect();
		setTimeout(initObserver, 300);
	});
	activeYear.value = years.value[0] || null;
}, { deep: true });
</script>

<template>
	<div
		class="timeline-scrubber"
		:class="{ 'is-visible': isVisible }"
	>
		<div class="scrubber-content">
			<div
				v-for="year in years"
				:key="year"
				class="scrubber-year-item"
				:class="{ 'is-active': isYearActive(year) }"
			>
				<!-- Год -->
				<button
					class="scrubber-year"
					:class="{ active: isYearActive(year) }"
					@click="scrollToYear(year)"
				>
					<span class="year-text">{{ year }}</span>
				</button>

				<!-- Месяцы только для активного года - слева название, справа линия -->
				<div
					v-if="isYearActive(year) && monthsForActiveYear.length > 0"
					class="scrubber-months"
				>
					<button
						v-for="month in monthsForActiveYear"
						:key="month.id"
						class="scrubber-month"
						:class="{ active: isMonthActive(month) }"
						@click="scrollToSection(month)"
					>
						<span class="month-name">{{ month.monthName }}</span>
						<div class="month-indicator">
							<div class="month-line" />
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.timeline-scrubber {
	position: fixed;
	right: 1.5rem;
	top: 50%;
	transform: translateY(-50%) translateX(20px);
	z-index: 100;
	opacity: 0;
	pointer-events: none;
	transition:
		opacity 0.3s ease,
		transform 0.3s ease;
}

.timeline-scrubber.is-visible {
	opacity: 1;
	pointer-events: auto;
	transform: translateY(-50%) translateX(0);
}

.scrubber-content {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.5rem;
}

/* Элемент года */
.scrubber-year-item {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.375rem;
}

/* Год - без кругов */
.scrubber-year {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.25rem 0;
	transition: all 0.3s ease;
	opacity: 0.4;
}

.scrubber-year:hover {
	opacity: 0.7;
}

.scrubber-year.active {
	opacity: 1;
}

.year-text {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--text-secondary);
	transition: all 0.3s ease;
}

.scrubber-year.active .year-text {
	color: var(--text);
	font-size: 1rem;
	font-weight: 700;
}

/* Месяцы под активным годом - название слева, линия справа */
.scrubber-months {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.375rem;
	padding-right: 0.5rem;
	border-right: 2px solid var(--border);
	margin-right: 0.25rem;
	animation: slideIn 0.3s ease;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateX(-10px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.scrubber-month {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.15rem 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: all 0.3s ease;
	opacity: 0.5;
}

.scrubber-month:hover {
	opacity: 0.8;
}

.scrubber-month.active {
	opacity: 1;
}

/* Название месяца - всегда видно */
.month-name {
	font-size: 0.7rem;
	font-weight: 500;
	color: var(--text-secondary);
	text-transform: lowercase;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.scrubber-month.active .month-name {
	color: var(--text);
	font-weight: 600;
}

/* Линия справа от названия */
.month-indicator {
	width: 12px;
	height: 2px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.month-line {
	width: 8px;
	height: 2px;
	background: var(--text-secondary);
	border-radius: 1px;
	transition: all 0.3s ease;
}

.scrubber-month.active .month-line {
	width: 16px;
	background: var(--text);
	box-shadow: 0 0 8px color-mix(in srgb, var(--text) 50%, transparent);
}

/* Мобильная версия */
@media (max-width: 768px) {
	.timeline-scrubber {
		position: fixed;
		right: 0;
		left: 0;
		top: auto;
		bottom: 0;
		transform: translateY(100%);
		padding: 0.75rem 1rem;
		background: color-mix(in srgb, var(--bg) 95%, transparent);
		backdrop-filter: blur(12px);
		border-top: 1px solid var(--border);
	}

	.timeline-scrubber.is-visible {
		transform: translateY(0);
	}

	.scrubber-content {
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		align-items: flex-start;
	}

	.scrubber-year-item {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}

	.scrubber-year {
		padding: 0.5rem;
	}

	.year-text {
		font-size: 0.8rem;
	}

	.scrubber-year.active .year-text {
		font-size: 0.9rem;
	}

	.scrubber-months {
		flex-direction: row;
		gap: 0.5rem;
		padding-right: 0;
		padding-left: 0.5rem;
		border-right: none;
		border-left: 1px solid var(--border);
		margin-right: 0;
		animation: slideInMobile 0.3s ease;
	}

	@keyframes slideInMobile {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.scrubber-month {
		padding: 0.375rem;
		flex-direction: column;
		gap: 0.25rem;
	}

	.month-name {
		font-size: 0.6rem;
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}

	.month-indicator {
		width: 20px;
		height: 3px;
	}

	.month-line {
		width: 100%;
		height: 3px;
	}

	.scrubber-month.active .month-line {
		width: 28px;
	}
}

@media (max-width: 480px) {
	.scrubber-content {
		gap: 0.75rem;
	}

	.year-text {
		font-size: 0.75rem;
	}

	.month-name {
		display: none;
	}

	.month-indicator {
		width: 16px;
	}

	.scrubber-month.active .month-line {
		width: 24px;
	}
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
	.timeline-scrubber,
	.scrubber-year,
	.scrubber-month,
	.month-line,
	.month-name,
	.year-text,
	.scrubber-months {
		transition: none;
		animation: none;
	}
}
</style>
