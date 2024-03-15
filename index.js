
    const menuModal = document.getElementById('menu-modal');

    // MENU
    // Toggle menu visibility and animation
    const toggleMenu = () => {
        const isMenuOpen = menuModal.classList.contains('menu-slide-in');
        menuModal.classList.toggle('hidden', isMenuOpen);
        menuModal.classList.toggle('menu-slide-in', !isMenuOpen);
        menuModal.classList.toggle('menu-slide-out', isMenuOpen);
        overlay.classList.toggle('hidden');
        hamburgerButton.classList.toggle('hamburger-x');
    };
    // Close menu and overlay
    const closeMenu = () => {
        menuModal.classList.replace('menu-slide-in', 'menu-slide-out');
        setTimeout(() => menuModal.classList.add('hidden'), 250);
        overlay.classList.add('hidden');
        hamburgerButton.classList.remove('hamburger-x');
    };

    const menuInteractions = () => {
        const hamburgerButton = document.getElementById('hamburger-button');
        const overlay = document.getElementById('overlay');
        const menuLinks = document.querySelectorAll('#menu-modal a');
        // Menu functionality
        hamburgerButton.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        menuLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // Handle route changes for about page and main content visibility
    const handleRouteChange = () => {
        const hash = window.location.hash;
        const mainContent = document.getElementById('mainContent');
        const aboutPage = document.getElementById('aboutPage');
        mainContent.classList.toggle('hidden', hash === '#about');
        aboutPage.classList.toggle('hidden', hash !== '#about');
        window.scrollTo(0, 0);
    };

    const speciesSelectorLinkListener = () => {
        const speciesSelectorLink = document.getElementById('speciesSelectorLink');
        const speciesHeader = document.getElementById('species-selector');
        speciesSelectorLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Explicitly show mainContent if hidden
            const mainContent = document.getElementById('mainContent');
            if (mainContent.classList.contains('hidden')) {
                mainContent.classList.remove('hidden');
            }
            // Ensure the aboutPage is hidden
            const aboutPage = document.getElementById('aboutPage');
            if (!aboutPage.classList.contains('hidden')) {
                aboutPage.classList.add('hidden');
            }
            // Close the menu
            closeMenu();
            // Scroll to the speciesHeader or the specific section
            speciesHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };
    
    // // Modal interactions
    const modalElements = (data) => {
        const cardModals = document.querySelectorAll('.card');
        cardModals.forEach(card => {
            card.addEventListener('click', async () => {
                const taxonId = card.getAttribute('data-taxon-id');
                const description = card.getAttribute('data-description') || "Description Not Found";
                const title = card.querySelector('h3')?.textContent || "Title Not Found";
                const scientificName = card.querySelector('.species-scientific-name')?.textContent || "Scientific Name Not Found";
                const imageSrc = card.querySelector('img')?.src || "Image Not Found";
                
                // Open the modal with the Wikipedia URL
                openModal(title, imageSrc, description, scientificName);
                // Then fetch and update the Wikipedia link
                try {
                    await displaySpeciesModalData(taxonId);
                } catch (error) {
                    console.error("Error updating modal with Wikipedia data:", error);
                }
    

            });
        });
    };

    const toggleScrollLock = (isLocked) => {
        document.body.style.overflow = isLocked ? 'hidden' : '';
    }
    
    const setupCloseModalListeners = () => {
        const closeModalButton = document.getElementById('closeModal');
        //Close Modal when close modal button is pressed
        closeModalButton.addEventListener('click', () => {
            document.getElementById('modal').classList.add('hidden');
            // Enable scrolling again
            toggleScrollLock(false);
        });
        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target.id === 'modal') {
                document.getElementById('modal').classList.add('hidden');
                // Enable scrolling again
                toggleScrollLock(false);
            }
        });
    }

    // Function to setup interactions for the map within the modal
    const setupMapModalInteractions = () => {
        // Open the map-modal when the map image/container in the original modal is clicked
        document.getElementById('mapContainer').addEventListener('click', function() {
            document.getElementById('map-modal').classList.remove('hidden');
            // Optional: Disable scrolling on the body if not already handled
            toggleScrollLock(true);
        });

        // Close the map-modal
        document.getElementById('closeMapModal').addEventListener('click', function() {
            document.getElementById('map-modal').classList.add('hidden');
            // Re-enable scrolling on the body if it was previously disabled
            toggleScrollLock(false);
        });
    };

    const openModal  = (name, imgSrc, description, scientificName) => {
        // Set the content of the modal elements
        document.getElementById('modalTitle').textContent = name;
        document.getElementById('modalImage').src = imgSrc;
        document.getElementById('modalImage').alt = name; // Set alt attribute for accessibility
        document.getElementById('modalScientificName').textContent = scientificName;
        document.getElementById('modalDescription').textContent = description;
        // Ensure the iframe and the "Show Wikipedia" button are reset to their initial state
        const wikiFrame = document.getElementById("wikiFrame");
        const modalWikiButtonContainer = document.getElementById("modalWikiButtonContainer");
        
        wikiFrame.classList.add('hidden'); // Hide the iframe
        wikiFrame.src = ""; // Reset the src to ensure it doesn't load the previous content
        modalWikiButtonContainer.classList.add('hidden'); // Hide the "Show Wikipedia" button until it's verified that a URL exists
    
        // Show the modal
        document.getElementById('modal').classList.remove('hidden');   
        document.getElementById('modal-container').scrollTop = 0; // This line ensures the modal scrolls to the top
    
        // Disable scrolling
        toggleScrollLock(true);
    };

    const displaySpeciesModalData = async (taxonId) => {
        const { wikipedia_url, observations_count } = await fetchDataFromAPI(taxonId);
        const wikiFrame = document.getElementById("wikiFrame");
        const showWikiButton = document.getElementById("showWiki");
        const modalWikiButtonContainer = document.getElementById("modalWikiButtonContainer");
        const wikipediaLinkElement = document.getElementById("species-wikipedia-url");
    
        if (wikipedia_url) {
            // Wikipedia URL is available
            wikipediaLinkElement.href = wikipedia_url; // Set the href for direct link (if needed)
            wikipediaLinkElement.classList.add("hidden"); // Ensure direct link is hidden when iframe is to be used
    
            modalWikiButtonContainer.classList.remove("hidden"); // Show "Show Wikipedia" button
            showWikiButton.onclick = () => {
                wikiFrame.classList.toggle("hidden");
                if (!wikiFrame.classList.contains("hidden")) {
                    wikiFrame.src = wikipedia_url; // Load iframe source only when showing it
                }
            };
        } else {
            // No Wikipedia URL available
            modalWikiButtonContainer.classList.add("hidden"); // Hide "Show Wikipedia" button
            wikipediaLinkElement.classList.add("hidden"); // Also hide direct link
            wikiFrame.classList.add("hidden"); // Ensure iframe is hidden
        }
    
        // Display observation_count in the modal...
        const observationsCountElement = document.getElementById('observationsCount');
        observationsCountElement.textContent = `Observations Counted World Wide on INaturalist: ${observations_count}`;
    };

    // Function to dynamically display species and setup interactions
    const displaySpecies = async () => {
        try {
            const response = await fetch('./data.json');
            const data = await response.json();
            const container = document.querySelector('#species-selection');
            container.innerHTML = ''; // Clear existing content
    
            Object.entries(data.species).forEach(([category, speciesList]) => {
                const formattedCategoryName = category.replace(/\s+/g, '-'); // Replaces the whitspace with "-".
                let categoryHtml = `
                    <div class="flex justify-between items-center bg-white text-customBlue p-4 ">
                        <h2 class="text-xl font-bold">${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                        <button class="toggle-category focus:outline-none" data-target="${formattedCategoryName}Cards">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>
                    <div id="${formattedCategoryName}Cards" class="hidden flex flex-col items-center">
                `;
    
                let cardsHtml = speciesList.map(species => {
                    // const truncatedDescription = species.description.length > 75 ? `${species.description.substring(0, 75)}...` : species.description;
                    // <p class="text-gray-700 mt-2 px-4 w-1/2">${truncatedDescription}</p>

                    return `
                        <div class="card  bg-white rounded-lg border border-gray-200 shadow-md m-8 p-4 cursor-pointer" role="button" data-description="${species.description}" data-taxon-id="${species.taxon_id}" onclick="openModal('${species.common_name}', '', '${species.description}')">
                            <h3 class="text-xl ml-4 text-customBlue font-semibold">${species.common_name}</h3>
                            <div class="species-scientific-name text-xl ml-4 italic text-customBlue" data-taxon-id="${species.taxon_id}"></div>
                            <div class="cardImageContainer flex justify-center ">
                                    <img src="" alt="Loading, Please Wait" data-taxon-id="${species.taxon_id}" class="species-image rounded-md p-4">
                            </div>
                            <div class="flex justify-between items-center p-2 m-2">
                                <div class="species-threatened-status italic text-lg" data-taxon-id="${species.taxon_id}"></div>
                                <div class="text-customBlue text-md font-semibold">Click card to read more!</div>

                            </div>

                        </div>
                    `;
                }).join('');
                
                // Append the category and its cards to the container
                container.innerHTML += categoryHtml + cardsHtml + '</div>';
            });
            // After .card elements are added to the DOM:
            modalElements(); // Attach event listeners to newly added .card elements

            attachToggleEventListeners();

        } catch (error) {
            console.error('Error loading the JSON data:', error);
        }
    };

    // Function to attach event listeners to category toggle buttons
    const attachToggleEventListeners = () => {
        document.querySelectorAll('.toggle-category').forEach(button => {
            button.addEventListener('click', async () => {
                const targetId = button.getAttribute('data-target');
                const targetContainer = document.getElementById(targetId);
                const isHidden = targetContainer.classList.contains('hidden');

                // Toggle visibility
                targetContainer.classList.toggle('hidden', !isHidden);

        
                // Update the button's icon based on the category's visibility
                button.innerHTML = isHidden ? 
                    `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>` :  // Icon for "collapse"
                    `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;  // Icon for "expand"
    
                // Fetch and update images if the category is being expanded
                if (isHidden) {
                    await updateSpeciesCardData(targetContainer);
                    await updateSpeciesCardImages(targetContainer);
                }
            });
        });
    };
    
    const updateSpeciesCardImages = async (container) => {
        const images = container.querySelectorAll('img.species-image');
        for (const img of images) {
            const taxonId = img.getAttribute('data-taxon-id');
            if (img.src) { // Check if the image src is not already set
                const imageUrl = await fetchImageFromAPI(taxonId);
                img.src = imageUrl;
            }
        }
    };

    const updateSpeciesCardData = async (container, taxonId) => {
        const elements = container.querySelectorAll('.species-scientific-name');
        for (const element of elements) {
            const taxonId = element.getAttribute('data-taxon-id');
            if (!element.textContent) { // Check if the content is not already set
                const { scientificName, threatened
                } = await fetchDataFromAPI(taxonId); // Destructure to get both values
                element.textContent = scientificName; // Set the scientific name
                // Find the corresponding element for threatened status within the same container/card
                const threatenedElement = element.closest('.card').querySelector('.species-threatened-status');
                if (threatenedElement) {
                    threatenedElement.textContent = threatened ? "Threatened" : "Not Threatened"; // Update based on the boolean value
                }
            }
        }
    };
    

    const fetchDataFromAPI = async (taxonId) => {
        const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&per_page=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data?.results); 
            const scientificName = data?.results?.[0]?.taxon?.name || "";
            const threatened = data?.results?.[0]?.taxon?.threatened || false; 
            const wikipedia_url
            = data?.results?.[0]?.taxon?.wikipedia_url
            || false; 
            console.log("Wikipedia URL:", wikipedia_url);
            const observations_count = data?.results?.[0]?.taxon?.observations_count || "";
            return {
                scientificName,
                threatened,
                wikipedia_url,
                observations_count

            };
        } catch (error) {
            console.error(`Failed to fetch data for taxon ID ${taxonId}:`, error);
            return { scientificName: '', threatened: false, wikipedia_url, observations_count
            : '' };
        }
        
    };
    
    
    const fetchImageFromAPI = async (taxonId) => {
        const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&per_page=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data?.results)
            return (
                data?.results?.[0]?.taxon?.default_photo?.medium_url || data?.results[0]?.photos[0]?.url || "" // Fallback URL
            )
        } catch (error) {
            console.error(`Failed to fetch image for taxon ID ${taxonId}:`, error);
            return ''; // Fallback URL
        }
    };
    
    // loadSpeciesData to call displaySpecies with the entire data object
    const loadSpeciesData = async () => {
        try {
            const response = await fetch('./data.json'); 
            const data = await response.json();
            displaySpecies(data.species);
        } catch (error) {
            console.error('Error loading the JSON file:', error);
        }
    };
    

    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('DOMContentLoaded', loadSpeciesData);
        window.addEventListener('hashchange', handleRouteChange);
        handleRouteChange(); // Ensure correct section is displayed on initial load
        menuInteractions();
        speciesSelectorLinkListener();
        loadSpeciesData();
        // Setup modal close listeners
        setupCloseModalListeners();
        // cardButtonsListener();
        setupCloseModalListeners();
        setupMapModalInteractions();

    });
