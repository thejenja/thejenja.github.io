<template>
	<div class="project-meta">
		<!-- Тип проекта -->
		<div v-if="project.meta?.type" class="meta-item meta-type">
			<DynamicIcon :icon="getTypeIconName(project.meta.type)" size="16" />
			<span>{{ getTypeLabel(project.meta.type) }}</span>
		</div>

		<!-- Стадия проекта -->
		<div v-if="project.meta?.stage" class="meta-item meta-stage">
			<DynamicIcon :icon="getStageIconName(project.meta.stage)" size="16" />
			<span>{{ getStageLabel(project.meta.stage) }}</span>
		</div>

		<!-- Дата -->
		<div v-if="project.date || project.meta?.date" class="meta-item meta-date">
			<Calendar size="16" />
			<span>{{ formatDate(project.date || project.meta?.date) }}</span>
		</div>

		<!-- Избранный проект -->
		<div v-if="project.meta?.featured" class="meta-item meta-featured">
			<Star size="16" />
			<span>{{ $t("common.featured") }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Calendar, Star } from "lucide-vue-next";
import DynamicIcon from "./DynamicIcon.vue";

interface ProjectMeta {
	type?: "web-app" | "mobile-app" | "website" | "library" | "tool" | "game";
	stage?: "planning" | "in-progress" | "completed" | "on-hold" | "archived";
	featured?: boolean;
	date?: string;
}

interface Project {
	title?: string;
	description?: string;
	date?: string;
	meta?: ProjectMeta;
	_path?: string;
}

interface Props {
	project: Project;
}

const props = defineProps<Props>();
const { t } = useI18n();

const getTypeIconName = (type: string) => {
	const iconMap: Record<string, string> = {
		"web-app": "lucide:globe",
		"mobile-app": "lucide:smartphone",
		website: "lucide:globe",
		library: "lucide:package",
		tool: "lucide:wrench",
		game: "lucide:gamepad-2",
	};
	return iconMap[type] || "lucide:code";
};

const getStageIconName = (stage: string) => {
	const iconMap: Record<string, string> = {
		planning: "lucide:clock",
		"in-progress": "lucide:code",
		completed: "lucide:check-circle",
		"on-hold": "lucide:pause",
		archived: "lucide:archive",
	};
	return iconMap[stage] || "lucide:code";
};

const getTypeLabel = (type: string) => {
	return t(`projectTypes.${type}`, type);
};

const getStageLabel = (stage: string) => {
	return t(`projectStages.${stage}`, stage);
};

const formatDate = (date: string | Date) => {
	if (!date) return "";

	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("ru-RU", {
		year: "numeric",
		month: "long",
	});
};
</script>

<style scoped>
.project-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-top: 0.75rem;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.25rem 0.75rem;
	background: var(--bg-tertiary);
	border: 1px solid var(--border);
	border-radius: 9999px;
	font-size: 0.75rem;
	color: var(--text-secondary);
	transition: all 0.2s ease;
}

.meta-item:hover {
	background: var(--bg-quaternary);
	border-color: var(--text-tertiary);
	color: var(--text);
}

.meta-type {
	border-color: var(--accent);
	color: var(--accent);
}

.meta-stage {
	border-color: var(--text-tertiary);
}

.meta-stage:hover {
	border-color: var(--text-secondary);
}

.meta-date {
	border-color: var(--border);
}

.meta-featured {
	border-color: #fbbf24;
	color: #fbbf24;
	background: rgba(251, 191, 36, 0.1);
}

.meta-featured:hover {
	background: rgba(251, 191, 36, 0.2);
}

/* Анимация появления */
.meta-item {
	animation: meta-slide-in 0.3s ease-out backwards;
}

.meta-item:nth-child(1) {
	animation-delay: 0ms;
}
.meta-item:nth-child(2) {
	animation-delay: 50ms;
}
.meta-item:nth-child(3) {
	animation-delay: 100ms;
}
.meta-item:nth-child(4) {
	animation-delay: 150ms;
}

@keyframes meta-slide-in {
	from {
		opacity: 0;
		transform: translateY(8px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Уважение к настройкам пользователя */
@media (prefers-reduced-motion: reduce) {
	.meta-item {
		animation: none;
	}
}

/* Адаптивность */
@media (max-width: 640px) {
	.project-meta {
		gap: 0.5rem;
	}

	.meta-item {
		font-size: 0.6875rem;
		padding: 0.25rem 0.5rem;
	}
}
</style>
