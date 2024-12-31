// cursor.js

// Select the cursor element and hover targets
const cursor = document.getElementById("cursor");
const hoverTargets = document.querySelectorAll("a, .translate, .Marquee-tag, button");

// Initialize mouse and cursor coordinates
let mouseX = 0,
	mouseY = 0;
let cursorX = 0,
	cursorY = 0;
let isHovering = false;

// Update mouse coordinates on mousemove event
document.addEventListener("mousemove", (e) => {
	if (!isHovering) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		cursor.style.opacity = 1;
	}
});

// Function to animate the cursor smoothly
function animateCursor() {
	cursorX += (mouseX - cursorX) * 0.2; // Smooth interpolation
	cursorY += (mouseY - cursorY) * 0.2;

	// Update cursor position
	cursor.style.left = `${cursorX}px`;
	cursor.style.top = `${cursorY}px`;

	requestAnimationFrame(animateCursor);
}

// Function to set cursor styles
function setCursorStyles(width, height, backgroundColor) {
	const styleTag = document.getElementById("cursorStyles");
	styleTag.innerHTML = `
        #cursor {
            width: ${width}px;
            height: ${height}px;
            border-radius: 20px;
            background-color: ${backgroundColor};
        }
    `;
}

// Function to handle mouseenter event
function handleMouseEnter(event) {
	isHovering = true;
	const rect = event.target.getBoundingClientRect();
	mouseX = rect.left + rect.width / 2;
	mouseY = rect.top + rect.height / 2;

	// Set enlarged cursor styles
	setCursorStyles(
		rect.width + 10,
		rect.height + 10,
		"rgba(255, 255, 255, 0.05)"
	);
}

// Function to handle mouseleave event
function handleMouseLeave() {
	isHovering = false;

	// Reset cursor styles to default
	setCursorStyles(35, 35, "rgba(255, 255, 255, 0.15)");
}

// Add event listeners for hover targets
hoverTargets.forEach((target) => {
	target.addEventListener("mouseenter", handleMouseEnter);
	target.addEventListener("mouseleave", handleMouseLeave);
});

// Start cursor animation
animateCursor();
