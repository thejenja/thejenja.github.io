import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		(function (m, e, t, r, i, k, a) {
			// @ts-expect-error
			m[i] =
				m[i] ||
				function () {
					(m[i].a = m[i].a || []).push(arguments);
				};
			// @ts-expect-error
			m[i].l = 1 * new Date();
			for (let j = 0; j < e.scripts.length; j++) {
				if (e.scripts[j].src.indexOf(r) !== -1) return;
			}
			// @ts-expect-error
			k = e.createElement(t);
			// @ts-expect-error
			a = e.getElementsByTagName(t)[0];
			k.async = 1;
			k.src = r;
			a.parentNode.insertBefore(k, a);
		})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

		// @ts-expect-error
		ym(103699281, "init", {
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true,
			webvisor: true,
		});
	}
});
