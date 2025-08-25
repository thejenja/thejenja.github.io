import { defineNuxtPlugin, useHead } from "#app";

export default defineNuxtPlugin(() => {
	useHead({
		meta: [{ name: "yandex-verification", content: "6fb57a93002b4804" }],
	});
});
