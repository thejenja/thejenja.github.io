const donateButton = document.getElementById("ton");
const donateOverlay = document.getElementById("donateOverlay");
const donatePopup = document.getElementById("donatePopup");
const closePopup = document.getElementById("closePopup");
const copyButton = document.getElementById("copyButton");
const walletAddress = document.getElementById("walletAddress").innerText;
const customAlert = document.getElementById("customAlert");

// Open popup
donateButton.addEventListener("click", () => {
	donateOverlay.classList.add("active");
	donatePopup.classList.add("active");
});

// Close popup
function closeDonatePopup() {
	donatePopup.classList.remove("active");
	setTimeout(() => donateOverlay.classList.remove("active"), 300);
}

closePopup.addEventListener("click", closeDonatePopup);

// Close popup by clicking outside
donateOverlay.addEventListener("click", (event) => {
	if (event.target === donateOverlay) {
		closeDonatePopup();
	}
});

// Show custom alert
function showAlert(message) {
	customAlert.textContent = message;
	customAlert.classList.add("active");
	setTimeout(() => {
		customAlert.classList.remove("active");
	}, 2000);
}

// Copy wallet address
copyButton.addEventListener("click", () => {
	navigator.clipboard
		.writeText(walletAddress)
		.then(() => {
			showAlert("Wallet address copied to clipboard!");
		})
		.catch((err) => {
			showAlert("Failed to copy wallet address.");
			console.error(err);
		});
});
