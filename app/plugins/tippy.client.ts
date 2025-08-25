import { defineNuxtPlugin } from "#app";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

export default defineNuxtPlugin(() => {
	return {
		provide: {
			tippy: null,
		},
	};
});
