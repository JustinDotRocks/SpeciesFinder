const menuModal = document.getElementById("menu-modal");

// MENU
const toggleMenu = () => {
	const menuModal = document.getElementById("menu-modal");
	const isMenuOpen = menuModal.classList.contains("menu-slide-in");
	if (isMenuOpen) {
		// Menu is open, so slide it out
		menuModal.classList.replace("menu-slide-in", "menu-slide-out");
		setTimeout(() => menuModal.classList.add("hidden"), 250); // Ensure the menu is hidden after the animation
	} else {
		// Menu is closed, so slide it in
		menuModal.classList.remove("hidden");
		// menuModal.classList.replace("menu-slide-out", "menu-slide-in");
		setTimeout(
			() =>
				menuModal.classList.replace(
					"menu-slide-out",
					"menu-slide-in"
				),
			0
		); // Immediately start sliding in but allow for the class removal to take effect first
	}
	const overlay = document.getElementById("overlay");
	overlay.classList.toggle("hidden");
	const hamburgerButton = document.getElementById("hamburger-button");
	hamburgerButton.classList.toggle("hamburger-x");
};

// Close menu and overlay
const closeMenu = () => {
	menuModal.classList.replace("menu-slide-in", "menu-slide-out");
	setTimeout(() => menuModal.classList.add("hidden"), 250);
	const overlay = document.getElementById("overlay");
	overlay.classList.add("hidden");
	const hamburgerButton = document.getElementById("hamburger-button");
	hamburgerButton?.classList?.remove("hamburger-x");
};

const menuInteractions = () => {
	const hamburgerButton = document.getElementById("hamburger-button");
	const overlay = document.getElementById("overlay");
	const menuLinks = document.querySelectorAll("#menu-modal a");

	// Menu functionality
	hamburgerButton.addEventListener("click", toggleMenu);
	overlay.addEventListener("click", toggleMenu);
	menuLinks.forEach((link) => link.addEventListener("click", toggleMenu));
};

const handleRouteChange = () => {
	const hash = window.location.hash;
	const mainContent = document.getElementById("mainContent"); // Your main content
	const aboutPage = document.getElementById("aboutPage"); // About page, if you have one
	const favoritesPage = document.getElementById("favoritesPage"); // Favorites page
	const mapPage = document.getElementById("mapPage"); // Map page

	// Hide all pages
	mainContent.classList.add("hidden");
	aboutPage.classList.add("hidden");
	favoritesPage.classList.add("hidden");
	mapPage.classList.add("hidden");

	// Show the page based on the hash
	if (hash === "#about") {
		aboutPage.classList.remove("hidden");
	} else if (hash === "#favorites") {
		favoritesPage.classList.remove("hidden");
		showFavorites();
	} else if (hash === "#map") {
		mapPage.classList.remove("hidden");
	} else {
		mainContent.classList.remove("hidden");
	}
};

const speciesSelectorLinkListener = () => {
	const speciesSelectorLink = document.getElementById(
		"speciesSelectorLink"
	);
	const speciesHeader = document.getElementById("species-selection");
	const favoritesPage = document.getElementById("favoritesPage");
	console.log(speciesHeader);
	speciesSelectorLink.addEventListener("click", (e) => {
		e.preventDefault();

		favoritesPage.classList.add("hidden");
		// Add any other sections that need to be hidden here

		// Explicitly show mainContent if hidden
		const mainContent = document.getElementById("mainContent");
		if (mainContent.classList.contains("hidden")) {
			mainContent.classList.remove("hidden");
		}
		// Ensure the aboutPage is hidden
		const aboutPage = document.getElementById("aboutPage");
		if (!aboutPage.classList.contains("hidden")) {
			aboutPage.classList.add("hidden");
		}
		// toggleMenu();
		closeMenu();
		// Scroll to the speciesHeader or the specific section
		speciesHeader.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	});
};

// Modal interactions
const modalElements = () => {
	const cardModals = document.querySelectorAll(".card");
	cardModals.forEach((card) => {
		card.addEventListener("click", async () => {
			const taxonId = card.getAttribute("data-taxon-id");
			if (!taxonId) {
				console.error(
					"Error: taxonId is undefined for the clicked card."
				);
				return;
			}
			const description =
				card.getAttribute("data-description") ||
				"Description Not Found";
			const title =
				card.querySelector("h3")?.textContent ||
				"Title Not Found";
			const scientificName =
				card.querySelector(".species-scientific-name")
					?.textContent || "Scientific Name Not Found";
			const imageSrc =
				card.querySelector("img")?.src || "Image Not Found";
			const map_image = card.getAttribute("data-map-image");

			// Open the modal with the Wikipedia URL
			// Delay the modal opening to allow any card click animations to be seen
			setTimeout(async () => {
				// Open the modal with the provided information
				openModal(
					title,
					imageSrc,
					description,
					scientificName,
					map_image,
					taxonId
				);

				// Then fetch and update the Wikipedia link and other data
				try {
					await displaySpeciesModalData(taxonId);
				} catch (error) {
					console.error(
						"Error updating modal with Wikipedia data:",
						error
					);
				}
			}, 250);
		});
	});
};

const toggleScrollLock = (isLocked) => {
	document.body.style.overflow = isLocked ? "hidden" : "";
};

const setupCloseModalListeners = () => {
	const closeModalButton = document.getElementById("closeModal");
	closeModalButton.addEventListener("click", closeModal);
	window.addEventListener("click", (event) => {
		if (event.target.id === "modal") {
			closeModal();
		}
	});
};

const closeModal = (taxonId) => {
	setTimeout(() => {
		document.getElementById("modal").classList.add("hidden");
		toggleScrollLock(false);
		if (taxonId !== undefined) {
			updateFavoriteIcons(taxonId);
		}
	}, 300);
};

const setupMapModalInteractions = () => {
	// Open the map-modal when the map image/container in the original modal is clicked
	document
		.getElementById("mapContainer")
		.addEventListener("click", function () {
			// Delay opening the map-modal to allow animation to be seen
			setTimeout(() => {
				document
					.getElementById("map-modal")
					.classList.remove("hidden");
				// Disable scrolling on the body.
				toggleScrollLock(true);
				adjustModalPositionForMap();
			}, 250);
		});

	// Close the map-modal
	document
		.getElementById("closeMapModal")
		.addEventListener("click", function () {
			setTimeout(() => {
				document
					.getElementById("map-modal")
					.classList.add("hidden");
				// Re-enable scrolling on the body if it was previously disabled
				toggleScrollLock(false);
				resetModalPosition(); // Reset modal position to center
			}, 250);
		});
};

// Adjust modal position for map view
const adjustModalPositionForMap = () => {
	const modalContainer = document.getElementById("modal-container");
	console.log("repositioned modal!!!!!!!!!!!!!!");
	modalContainer.classList.add("md:absolute", "md:top-16", "md:left-0");
};

// Reset modal position to center
const resetModalPosition = () => {
	const modalContainer = document.getElementById("modal-container");

	modalContainer.classList.remove("md:absolute", "md:top-16", "md:left-0");
};

const openModal = (
	name,
	imgSrc,
	description,
	scientificName,
	map_image,
	taxonId
) => {
	console.log("Received taxonId in openModal:", taxonId); // Debugging statement
	console.trace(); // This will print the call stack, helping identify where the call came from

	// Set the content of the modal elements
	document.getElementById("modalTitle").textContent = name;
	document.getElementById("modalImage").src = imgSrc;
	document.getElementById("modalImage").alt = name;
	document.getElementById("modalScientificName").textContent =
		scientificName;
	document.getElementById("modalDescription").textContent = description;
	document.getElementById("fullMapImage").src = map_image;

	// Handling the favorite star icon
	const modalTitle = document.getElementById("modalTitle");
	// Remove any existing star icon before adding a new one to prevent duplicates
	const existingStar = modalTitle.querySelector("#favoriteIcon");
	if (existingStar) {
		modalTitle.removeChild(existingStar);
	}

	// Continue with your logic for creating and appending the new star icon
	const isFavorited = checkIfFavorite(taxonId); // Ensure this function is defined and correctly checks the favorite state
	let starIcon = document.createElement("i");
	starIcon.id = "favoriteIcon";
	starIcon.setAttribute("data-taxon-id", taxonId);
	starIcon.className = isFavorited
		? "fas fa-star text-yellow-500"
		: "far fa-star";
	starIcon.style.cursor = "pointer";
	starIcon.addEventListener("click", () => {
		console.log("taxonId:", taxonId); // Debugging log
		toggleFavorite(taxonId.toString()); // Ensure toggleFavorite is defined and correctly toggles the favorite state
		updateFavoriteIcons(taxonId.toString()); // This function needs to correctly update the icon's appearance
	});
	modalTitle.appendChild(starIcon);

	// Resetting iframe and Wikipedia button state
	const wikiFrame = document.getElementById("wikiFrame");
	const modalWikiButtonContainer = document.getElementById(
		"modalWikiButtonContainer"
	);
	wikiFrame.classList.add("hidden");
	wikiFrame.src = "";
	modalWikiButtonContainer.classList.add("hidden");

	// Show the modal and reset scroll
	document.getElementById("modal").classList.remove("hidden");
	document.getElementById("modal-container").scrollTop = 0;
	toggleScrollLock(true);
};

// This should be placed outside the showFavorites function, as it's a utility function
const determineSpeciesCategory = (taxonId, data) => {
	let categoryFound = "";

	// Loop through each category in the species object
	Object.entries(data.species).forEach(([category, speciesList]) => {
		// Check if any species in the current category matches the taxonId
		const speciesMatch = speciesList.find(
			(species) => species.taxon_id === taxonId
		);

		if (speciesMatch) {
			// If a match is found, save the category and stop searching
			categoryFound = category;
		}
	});

	return categoryFound;
};

const navigateToSpeciesCard = (categoryName, taxonId) => {
	// Make sure the Species Selection section is visible
	window.location.hash = ""; // Remove any existing hash
	document.getElementById("mainContent").classList.remove("hidden"); // Show main content if hidden

	// Find the correct category container
	const categoryContainer = document.getElementById(`${categoryName}Cards`);

	const expandCategoryAndScroll = () => {
		// Scroll to the specific card
		const card = document.querySelector(
			`.card[data-taxon-id="${taxonId}"]`
		);
		if (card) {
			card.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	if (categoryContainer.classList.contains("hidden")) {
		// Expand the correct category if it's not already expanded
		const categoryButton = document.querySelector(
			`[data-target="${categoryName}Cards"]`
		);
		if (categoryButton) {
			categoryButton.click(); // Simulate a click to expand the category
		}
		// Use setTimeout to allow time for category expansion and dynamic content loading
		setTimeout(expandCategoryAndScroll, 500); // Adjust timeout as needed based on your content loading time
	} else {
		// If the category is already expanded, directly scroll to the card
		expandCategoryAndScroll();
	}
};

const displaySpeciesModalData = async (taxonId) => {
	const {wikipedia_url, observations_count} = await fetchDataFromAPI(
		taxonId
	);

	// Secure the Wikipedia URL
	const secureWikipediaUrl = secureUrl(wikipedia_url);

	const wikiFrame = document.getElementById("wikiFrame");
	const showWikiButton = document.getElementById("showWiki");
	const modalWikiButtonContainer = document.getElementById(
		"modalWikiButtonContainer"
	);
	const wikipediaLinkElement = document.getElementById(
		"modalWikiButtonContainer"
	);

	if (secureWikipediaUrl) {
		// Set the href for the direct link with the secured URL
		wikipediaLinkElement.href = secureWikipediaUrl;
		wikipediaLinkElement.classList.remove("hidden"); // Show direct link when iframe is not used

		// modalWikiButtonContainer.classList.remove("hidden"); // Show "Show Wikipedia" button
		showWikiButton.onclick = () => {
			wikiFrame.classList.toggle("hidden");
			if (!wikiFrame.classList.contains("hidden")) {
				// Load iframe source only when showing it, with the secured URL
				wikiFrame.src = secureWikipediaUrl;
			}
		};
	} else {
		// No Wikipedia URL available
		modalWikiButtonContainer.classList.add("hidden"); // Hide "Show Wikipedia" button
		wikipediaLinkElement.classList.add("hidden"); // Also hide direct link
		wikiFrame.classList.add("hidden"); // Ensure iframe is hidden
	}

	// Display observation_count in the modal...
	const observationsCountElement =
		document.getElementById("observationsCount");
	observationsCountElement.textContent = `Observations Counted World Wide on INaturalist: ${observations_count}`;
};

const secureUrl = (url) => {
	return url ? url.replace(/^http:/, "https:") : url;
};

// Function to dynamically display species and setup interactions
const displaySpecies = async () => {
	try {
		const response = await fetch("./data.json");
		const data = await response.json();
		const container = document.querySelector("#species-selection");
		container.innerHTML = ""; // Clear existing content

		const favorites =
			JSON.parse(localStorage.getItem("favorites")) || []; // Get current favorites

		Object.entries(data.species).forEach(([category, speciesList]) => {
			const formattedCategoryName = category.replace(/\s+/g, "-"); // Replaces the whitspace with "-".
			let categoryHtml = `
                    <div class="flex justify-between items-center bg-white text-customBlue p-4 md:my-16 lg:my-12 xl:my-20">
                        <h2 class="text-xl md:text-2xl font-bold">${
					category.charAt(0).toUpperCase() +
					category.slice(1)
				}</h2>
                        <button class="toggle-category focus:outline-none" data-target="${formattedCategoryName}Cards">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>
                    <div id="${formattedCategoryName}Cards" class="hidden flex flex-col items-center">
                `;

			let cardsHtml = speciesList
				.map((species) => {
					const isFavorited = favorites.includes(
						species.taxon_id.toString()
					); // Check if the species is favorited

					return `
                        <div id="species-selection" class="card bg-white rounded-lg border border-gray-200 shadow-md m-8 p-4 cursor-pointer xl:text-3xl" role="button" data-description="${
					species.description
				}" data-taxon-id="${
						species.taxon_id
					}" data-map-image="${species.map_image}">
                            <h3 class="text-xl xl:text-3xl ml-4 text-customBlue font-semibold">
                                ${species.common_name}
                                <i class="${
							isFavorited
								? "fas fa-star text-yellow-500"
								: "far fa-star"
						} favorite-icon" data-taxon-id="${
						species.taxon_id
					}"></i>
                            </h3>
                            <div class="species-scientific-name text-xl xl:text-2xl ml-4 italic text-customBlue" data-taxon-id="${
						species.taxon_id
					}"></div>
                            <div class="cardImageContainer flex justify-center ">
                                    <img src="" alt="Loading, Please Wait" data-taxon-id="${
							species.taxon_id
						}" class="species-image rounded-md p-4">
                            </div>
                            <div class="flex justify-between items-center p-2 m-2 xl:text-3xl ">
                                <div class="species-threatened-status italic text-lg xl:text-2xl" data-taxon-id="${
							species.taxon_id
						}"></div>
                                <div class="text-customBlue text-md xl:text-2xl font-semibold">Click card to read more!</div>

                            </div>

                        </div>
                    `;
				})
				.join("");

			// Append the category and its cards to the container
			container.innerHTML += categoryHtml + cardsHtml + "</div>";
		});
		// After .card elements are added to the DOM:
		modalElements(); // Attach event listeners to newly added .card elements

		attachToggleEventListeners();
	} catch (error) {
		console.error("Error loading the JSON data:", error);
	}
};

// Function to attach event listeners to category toggle buttons
const attachToggleEventListeners = () => {
	document.querySelectorAll(".toggle-category").forEach((button) => {
		button.addEventListener("click", async () => {
			const targetId = button.getAttribute("data-target");
			const targetContainer = document.getElementById(targetId);
			const isHidden = targetContainer.classList.contains("hidden");

			// Toggle visibility
			targetContainer.classList.toggle("hidden", !isHidden);

			// Update the button's icon based on the category's visibility
			button.innerHTML = isHidden
				? `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>` // Icon for "collapse"
				: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`; // Icon for "expand"

			// Fetch and update images if the category is being expanded
			if (isHidden) {
				await updateSpeciesCardData(targetContainer);
				await updateSpeciesCardImages(targetContainer);
			}
		});
	});
};

const updateSpeciesCardImages = async (container) => {
	const images = container.querySelectorAll("img.species-image");
	for (const img of images) {
		const taxonId = img.getAttribute("data-taxon-id");
		if (img.src) {
			// Check if the image src is not already set
			const imageUrl = await fetchImageFromAPI(taxonId);
			img.src = imageUrl;
		}
	}
};

const updateSpeciesCardData = async (container, taxonId) => {
	const elements = container.querySelectorAll(".species-scientific-name");
	for (const element of elements) {
		const taxonId = element.getAttribute("data-taxon-id");
		if (!element.textContent) {
			// Check if the content is not already set
			const {scientificName, threatened} = await fetchDataFromAPI(
				taxonId
			); // Destructure to get both values
			element.textContent = scientificName; // Set the scientific name
			// Find the corresponding element for threatened status within the same container/card
			const threatenedElement = element
				.closest(".card")
				.querySelector(".species-threatened-status");
			if (threatenedElement) {
				threatenedElement.textContent = threatened
					? "Threatened"
					: "Not Threatened"; // Update based on the boolean value
			}
		}
	}
};

// ///////////
// FAVORITES:
// ///////////
const checkIfFavorite = (taxonId) => {
	// Ensure taxonId is defined before proceeding
	if (typeof taxonId === "undefined" || taxonId === null) {
		return false; // or handle this case as you see fit
	}
	const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
	console.log(favorites);
	return favorites.includes(taxonId.toString());
};

const toggleFavorite = (taxonId) => {
	let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
	const index = favorites.indexOf(taxonId.toString());
	if (index === -1) {
		favorites.push(taxonId.toString());
	} else {
		favorites.splice(index, 1);
	}
	localStorage.setItem("favorites", JSON.stringify(favorites));
	updateFavoriteIcons(taxonId);

	return favorites.includes(taxonId.toString()); // Return the updated favorite status
};

const updateFavoriteIcon = (taxonId) => {
	const isFavorited = checkIfFavorite(taxonId.toString()); // Re-check favorite status

	// Update the icon in the modal if it exists
	const favoriteIconInModal = document.querySelector(
		`#modal #favoriteIcon[data-taxon-id="${taxonId}"]`
	);
	if (favoriteIconInModal) {
		favoriteIconInModal.className = isFavorited
			? "fas fa-star text-yellow-500"
			: "far fa-star";
	}

	// Update icons in the main card list
	const favoriteIconsInList = document.querySelectorAll(
		`.card .favorite-icon[data-taxon-id="${taxonId}"]`
	);
	favoriteIconsInList.forEach((icon) => {
		icon.className = isFavorited
			? "fas fa-star text-yellow-500"
			: "far fa-star";
	});
};

const updateFavoriteIcons = (taxonId) => {
	const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
	const isFavorited = checkIfFavorite(taxonId); // Re-check favorite status

	// Update the icon in the modal if it exists
	const favoriteIconInModal = document.querySelector(
		`#modal #favoriteIcon[data-taxon-id="${taxonId}"]`
	);
	if (favoriteIconInModal) {
		favoriteIconInModal.className = isFavorited
			? "fas fa-star text-yellow-500"
			: "far fa-star";
	}

	document.querySelectorAll(".favorite-icon").forEach((icon) => {
		const taxonId = icon.getAttribute("data-taxon-id");
		if (favorites.includes(taxonId)) {
			// Update to favorited state
			icon.classList.remove("far");
			icon.classList.add("fas", "fa-star", "text-yellow-500");
		} else {
			// Update to non-favorited state
			icon.classList.add("far");
			icon.classList.remove("fas", "text-yellow-500");
		}
	});
};

// Favorites Page
const showFavorites = async () => {
	const response = await fetch("./data.json");
	const data = await response.json();

	const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
	const container = document.getElementById("favoritesContainer");
	container.innerHTML = ""; // Clear existing content

	if (favorites.length === 0) {
		container.innerHTML =
			"<p class='text-customBlue flex justify-center'>You have no favorites yet.</p>";
		return;
	}

	// Create a grid container for the cards
	const grid = document.createElement("div");
	grid.className =
		"grid grid-cols-2 gap-4 mt-4 mx-4 lg:grid-cols-4 xl:grid-cols-5";
	container.appendChild(grid);

	const allSpecies = Object.values(data.species).flat(); // Flatten all species into a single array
	for (const favoriteTaxonId of favorites) {
		const species = allSpecies.find(
			(species) => species.taxon_id.toString() === favoriteTaxonId
		);
		if (species) {
			const imageUrl = await fetchImageFromAPI(species.taxon_id);
			// Create a card for this species
			const card = document.createElement("div");
			card.className =
				"favorites-card border-2 border-grey rounded-md m-2 cursor-pointer";
			card.innerHTML = `
                    <div class="card-body flex flex-col items-center h-52">
                        <h5 class="card-title text-customBlue text-md m-4 bold">${species.common_name}</h5>
                        <img src="${imageUrl}" alt="${species.common_name}" class="card-img-top overflow-hidden h-28 w-auto m-2">
                    </div>
                `;

			// Add click event listener to navigate to the species card
			card.addEventListener("click", () => {
				// Logic to navigate to the species card in the Species Selection section
				const categoryName = determineSpeciesCategory(
					species.taxon_id,
					data
				);
				navigateToSpeciesCard(categoryName, species.taxon_id);
			});

			grid.appendChild(card);
		}
	}

	// Setup the "Clear All Favorites" button
	// Ensure we're not adding multiple listeners
	const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");
	clearFavoritesBtn.removeEventListener("click", clearAllFavoritesHandler); // Remove existing listener to prevent duplicates
	clearFavoritesBtn.addEventListener("click", clearAllFavoritesHandler); // Add new listener
};

// Favorites Page
const clearAllFavoritesHandler = () => {
	localStorage.removeItem("favorites"); // Clears all favorites from localStorage

	// Update UI on the favorites page
	const container = document.getElementById("favoritesContainer");
	container.innerHTML =
		'<p class="text-center text-customBlue">You have no favorites yet.</p>';

	// Update all favorite icons to unfavorite status
	updateAllFavoriteIconsToUnfavorited();
	loadSpeciesData();
};

// Favorites Page
const updateAllFavoriteIconsToUnfavorited = () => {
	const favoriteIcons = document.querySelectorAll(
		".favorite-icon, #favoriteIcon"
	);
	favoriteIcons.forEach((icon) => {
		// Assuming 'fas' is favorited and 'far' is unfavorited. Adjust if your class names differ.
		icon.classList.replace("fas", "far");
	});
};

const fetchDataFromAPI = async (taxonId) => {
	const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&per_page=1`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log(data?.results);
		const scientificName = data?.results?.[0]?.taxon?.name || "";
		const threatened = data?.results?.[0]?.taxon?.threatened || false;
		const wikipedia_url =
			data?.results?.[0]?.taxon?.wikipedia_url || false;
		console.log("Wikipedia URL:", wikipedia_url);
		const observations_count =
			data?.results?.[0]?.taxon?.observations_count || "";
		return {
			scientificName,
			threatened,
			wikipedia_url,
			observations_count,
		};
	} catch (error) {
		console.error(
			`Failed to fetch data for taxon ID ${taxonId}:`,
			error
		);
		return {
			scientificName: "",
			threatened: false,
			wikipedia_url,
			observations_count: "",
		};
	}
};

const fetchImageFromAPI = async (taxonId) => {
	const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&per_page=1`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log(data?.results);
		return (
			data?.results?.[0]?.taxon?.default_photo?.medium_url ||
			data?.results[0]?.photos[0]?.url ||
			"" // Fallback URL
		);
	} catch (error) {
		console.error(
			`Failed to fetch image for taxon ID ${taxonId}:`,
			error
		);
		return ""; // Fallback URL
	}
};

// loadSpeciesData to call displaySpecies with the entire data object
const loadSpeciesData = async () => {
	try {
		const response = await fetch("./data.json");
		const data = await response.json();
		displaySpecies(data.species);
	} catch (error) {
		console.error("Error loading the JSON file:", error);
	}
};

document.addEventListener("DOMContentLoaded", () => {
	loadSpeciesData();
	document.addEventListener("DOMContentLoaded", loadSpeciesData);
	handleRouteChange(); // Ensure correct section is displayed on initial load
	window.addEventListener("hashchange", handleRouteChange);
	menuInteractions();
	speciesSelectorLinkListener();
	setupCloseModalListeners();
	setupMapModalInteractions();

	document
		.getElementById("species-selection")
		.addEventListener("click", function (event) {
			// Check if the clicked element or one of its parents has the 'favorite-icon' class
			let target = event.target;
			while (
				target != null &&
				!target.classList.contains("favorite-icon")
			) {
				target = target.parentElement;
			}

			// If a favorite icon was clicked
			if (
				target != null &&
				target.classList.contains("favorite-icon")
			) {
				const taxonId = target.getAttribute("data-taxon-id");
				if (taxonId) {
					toggleFavorite(taxonId);
					updateFavoriteIcons(); // Assuming this updates all favorite icons based on the latest state
				}
			}
		});
});
