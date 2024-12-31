// gradient.js

const gradientStyleTag = document.getElementById("gradient");
let angle = 0;

// Function to animate the gradient
function animateGradient() {
	angle += 0.2;

	const gradientStyle = `
    body {
        background:
            radial-gradient(at ${
							50 + 50 * Math.cos((angle * Math.PI) / 180)
						}% ${
		50 + 50 * Math.sin((angle * Math.PI) / 180)
	}%, var(--gradient-color-1) 0%, transparent 80%),
            radial-gradient(at ${
							50 + 50 * Math.cos(((angle + 120) * Math.PI) / 180)
						}% ${
		50 + 50 * Math.sin(((angle + 120) * Math.PI) / 180)
	}%, var(--gradient-color-2) 0%, transparent 80%),
            radial-gradient(at ${
							50 + 50 * Math.cos(((angle + 240) * Math.PI) / 180)
						}% ${
		50 + 50 * Math.sin(((angle + 240) * Math.PI) / 180)
	}%, var(--gradient-color-3) 0%, transparent 80%),
            var(--gradient-color-4);
    }
    `;

	gradientStyleTag.innerHTML = gradientStyle;

	requestAnimationFrame(animateGradient);
}

// Start the gradient animation
animateGradient();
