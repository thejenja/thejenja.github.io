import { ref, watch, onMounted } from "vue";

export function useAppSettings() {
	const showPreloader = ref(true);

	onMounted(() => {
		try {
			const sp = localStorage.getItem("app:showPreloader");
			if (sp !== null) showPreloader.value = sp === "true";
		} catch {}
	});

	watch(showPreloader, (v) => {
		try {
			localStorage.setItem("app:showPreloader", String(v));
		} catch {}
	});

	const togglePreloader = () => (showPreloader.value = !showPreloader.value);

	return {
		showPreloader,
		togglePreloader,
	};
}
