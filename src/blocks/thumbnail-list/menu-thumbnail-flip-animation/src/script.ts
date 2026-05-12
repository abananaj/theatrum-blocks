const LIST = [
	{ name: "minimal studio", src: "https://assets.codepen.io/8875557/wordpress.svg" },
	{ name: "vintage street", src: "https://assets.codepen.io/8875557/webflow.svg" },
	{ name: "gentle waves", src: "https://assets.codepen.io/8875557/shopify.svg" },
	{ name: "gentle waves", src: "https://assets.codepen.io/8875557/squarespace.svg" },
	{ name: "gentle waves", src: "https://assets.codepen.io/8875557/wix.svg" },];

let isSlowMode = false;

const thumbnailContainer = document.querySelector(".thumbnail-container") as HTMLElement;
const thumbnailFront = document.querySelector(".thumbnail-front") as HTMLImageElement;
const thumbnailBack = document.querySelector(".thumbnail-back") as HTMLImageElement;
const slowModeControl = document.querySelector(".slow-mode-control") as HTMLElement;
const menuItems = document.querySelectorAll(".menu-item");

function updateThumbnail(index: number) {
	const item = LIST[index];
	const isBack = Boolean(index % 2);

	if (isBack) {
		thumbnailBack.src = item.src;
		thumbnailBack.alt = item.name;
	} else {
		thumbnailFront.src = item.src;
		thumbnailFront.alt = item.name;
	}

	// Update container position and rotation
	if (thumbnailContainer) {
		thumbnailContainer.style.transform = `translateY(${index * 100}%) rotateX(${index * -180}deg)`;
	}
}

function toggleSlowMode() {
	isSlowMode = !isSlowMode;
	slowModeControl.classList.toggle("active", isSlowMode);

	if (thumbnailContainer) {
		if (isSlowMode) {
			thumbnailContainer.style.transitionDuration = "1s";
		} else {
			thumbnailContainer.style.transitionDuration = "0.3s";
		}
	}
}

// Initialize menu item hover listeners
menuItems.forEach((item, index) => {
	item.addEventListener("mouseenter", () => {
		updateThumbnail(index);
	});
});

// Initialize slow mode toggle
slowModeControl?.addEventListener("click", toggleSlowMode);
