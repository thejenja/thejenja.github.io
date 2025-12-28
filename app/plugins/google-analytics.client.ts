import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		// Add Google Analytics script to the page
		(function (w, d, s, l, i) {
			// @ts-expect-error - dataLayer is defined by Google Analytics
			w[l] = w[l] || [];
			// @ts-expect-error - dataLayer is defined by Google Analytics
			w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

			const f = d.getElementsByTagName(s)[0];
			const j = d.createElement(s) as HTMLScriptElement;
			const dl = l !== "dataLayer" ? "&l=" + l : "";
			j.async = true;
			j.src = "https://www.googletagmanager.com/gtag/js?id=" + i + dl;
			if (f && f.parentNode) {
				f.parentNode.insertBefore(j, f);
			}
		})(window, document, "script", "dataLayer", "G-M7CK5DXGR9");

		// Initialize Google Analytics
		// @ts-expect-error - dataLayer is defined by Google Analytics
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			// @ts-expect-error - dataLayer is defined by Google Analytics and arguments is used by design
			dataLayer.push(arguments);
		}
		// @ts-expect-error - gtag function is defined by Google Analytics
		gtag("js", new Date());
		// @ts-expect-error - gtag function is defined by Google Analytics
		gtag("config", "G-M7CK5DXGR9");
	}
});
