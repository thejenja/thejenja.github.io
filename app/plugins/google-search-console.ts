import { defineNuxtPlugin, useHead } from "#app";

export default defineNuxtPlugin(() => {
	useHead({
		meta: [
			{
				name: "google-site-verification",
				content: "EUmbyQBD7r2MHcCSmQ66zx1D8rqv4E8Q1wlMsPF5yeg",
			},
		],
	});
});
