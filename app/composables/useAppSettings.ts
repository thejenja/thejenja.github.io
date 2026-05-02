import { ref, watch, onMounted } from "vue";

export function useAppSettings() {
	const showPreloader = ref(true);

	onMounted(() => {
		try {
			const sp = localStorage.getItem("app:showPreloader");
			if (sp !== null) showPreloader.value = sp === "true";
			// eslint-disable-next-line no-empty
		} catch {}
	});

	watch(showPreloader, (v) => {
		try {
			localStorage.setItem("app:showPreloader", String(v));
			// eslint-disable-next-line no-empty
		} catch {}
	});

	return {
		showPreloader,
	};
}
