export default defineNuxtPlugin(async () => {
	if (!("anchorName" in document.documentElement.style)) {
		window.UPDATE_ANCHOR_ON_ANIMATION_FRAME = true;

		await import("@oddbird/css-anchor-positioning");
	}
});
