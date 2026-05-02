<template>
	<div class="share-buttons" role="group" aria-label="Share this project">
		<button class="share-btn" @click="share('telegram')" title="Share on Telegram">
			<Icon name="mingcute:telegram-fill" :size="20" />
		</button>
		<button class="share-btn" @click="share('twitter')" title="Share on X (Twitter)">
			<Icon name="simple-icons:x" :size="18" />
		</button>
		<button class="share-btn" @click="share('linkedin')" title="Share on LinkedIn">
			<Icon name="mingcute:linkedin-fill" :size="20" />
		</button>
		<button class="share-btn" @click="copyLink" title="Copy link">
			<Icon v-if="!copied" name="mingcute:link-fill" :size="20" />
			<Icon v-else name="mingcute:check-fill" :size="20" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
	title: string;
	slug: string;
}>();

const copied = ref(false);

const getUrl = () => {
	return `${window.location.origin}/projects/${props.slug}`;
};

const share = (platform: string) => {
	const url = encodeURIComponent(getUrl());
	const text = encodeURIComponent(`Check out this project: ${props.title}`);
	const links: Record<string, string> = {
		telegram: `https://t.me/share/url?url=${url}&text=${text}`,
		twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
	};
	if (links[platform]) {
		window.open(links[platform], "_blank", "noopener,noreferrer");
	}
};

const copyLink = async () => {
	try {
		await navigator.clipboard.writeText(getUrl());
		copied.value = true;
		setTimeout(() => (copied.value = false), 2000);
	} catch (e) {
		console.error("Failed to copy link", e);
	}
};
</script>

<style scoped>
.share-buttons {
	display: flex;
	gap: 0.5rem;
	margin-top: 1rem;
}

.share-btn {
	background: var(--bg-tertiary);
	border: 1px solid var(--border);
	color: var(--text-secondary);
	width: 40px;
	height: 40px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
}

.share-btn:hover {
	background: var(--bg-secondary);
	color: var(--text);
	transform: translateY(-2px);
}

.share-btn:active {
	transform: scale(0.95);
}
</style>
