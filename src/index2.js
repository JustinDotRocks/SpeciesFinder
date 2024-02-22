
    // Variables for common elements
    const hamburgerButton = document.getElementById('hamburger-button');
    const menuModal = document.getElementById('menu-modal');
    const overlay = document.getElementById('overlay');
    const menuLinks = document.querySelectorAll('#menu-modal a');
    const cardButtons = document.querySelectorAll('.triangle-button');
    const cardModals = document.querySelectorAll('.card');
    const closeModalButton = document.getElementById('closeModal');
    const speciesSelectorLink = document.getElementById('speciesSelectorLink');
    const speciesHeader = document.getElementById('species-selector');

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
// Handle route changes for about page and main content visibility
const handleRouteChange = () => {
    const hash = window.location.hash;
    const mainContent = document.getElementById('mainContent');
    const aboutPage = document.getElementById('aboutPage');
    mainContent.classList.toggle('hidden', hash === '#about');
    aboutPage.classList.toggle('hidden', hash !== '#about');
    window.scrollTo(0, 0);
};
// Function to open the modal with dynamic content
const openModal = async (name, taxonId, description) => {
    // Directly using taxonId to fetch the image URL
    let imageUrl = await fetchImageFromAPI(taxonId);
    // Update modal content
    document.getElementById('modalTitle').textContent = name;
    document.getElementById('modalImage').src = imageUrl; // Use fetched or fallback URL
    document.getElementById('modalImage').alt = `Image of ${name}`;
    document.getElementById('modalDescription').textContent = description;
    // Show the modal
    document.getElementById('modal').classList.remove('hidden');
};
// Close modal when clicking outside of it
const closeModal = () => {
    document.getElementById('modal').classList.add('hidden');
};
// CARDS

// Define attachCardEventListeners outside and above displaySpecies
const attachCardEventListeners = () => {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', async () => {
            const name = card.getAttribute('data-common-name');
            const taxonId = card.getAttribute('data-taxon-id');
            const description = card.getAttribute('data-description');
            const imageUrl = await fetchImageFromAPI(taxonId); // Await the image URL

            openModal(name, imageUrl, description);
        });
    });
};
const attachToggleEventListeners = () => {
    document.querySelectorAll('.toggle-category').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const target = document.getElementById(targetId);
            target.classList.toggle('hidden');
            // Toggle the arrow direction
            button.innerHTML = target.classList.contains('hidden') ? 
                `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>` : 
                `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>`;
        });
    });
};
const updateSpeciesImages = async () => {
    document.querySelectorAll('.species-image').forEach(async (imgElement) => {
        const taxonId = imgElement.getAttribute('data-taxon-id');
        const imageUrl = await fetchImageFromAPI(taxonId);
        imgElement.src = imageUrl;
        const name = imgElement.getAttribute('data-name');
        const description = imgElement.getAttribute('data-description');
        imgElement.addEventListener('click', () => openModal(name, imageUrl, description));        });
};
const fetchImageFromAPI = async (taxonId) => {
    const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&per_page=1&order_by=votes`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0 && data.results[0].photos.length > 0) {
            return data.results[0].photos[0].url;
        } else {
            // No image found, returning placeholder image URL
            return 'https://via.placeholder.com/150';
        }
    } catch (error) {
        console.error(`Failed to fetch image for taxon ID ${taxonId}:`, error);
        // Fetching failed, returning placeholder image URL
        return 'https://via.placeholder.com/150';
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
// Function to dynamically display species and setup interactions
const displaySpecies = async () => {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const container = document.querySelector('#species-selection');
        container.innerHTML = ''; // Clear existing content

        Object.entries(data.species).forEach(([category, speciesList]) => {
            // Correctly replace spaces for ID and data-target attributes
            const formattedCategoryName = category.replace(/\s+/g, '-');
            const truncatedDescription = species.description.length > 75 ? species.description.substring(0, 75) + '...' : species.description;

            let categoryHtml = `
                <div class="flex justify-between items-center bg-white text-customBlue p-4 rounded-t-md">
                    <h2 class="text-xl font-bold">${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                    <button class="toggle-category focus:outline-none" data-target="${formattedCategoryName}Cards">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
                <div id="${formattedCategoryName}Cards" class="hidden flex flex-col items-center">
            `;
            let cardsHtml = speciesList.map(species => `
                <div class="card max-w-md bg-white rounded-lg border border-gray-200 shadow-md m-8 p-4 cursor-pointer" data-taxon-id="${species.taxon_id}" data-common-name="${species.common_name}" data-description="${species.description}">
                    <h3 class="text-xl text-customBlue font-semibold">${species.common_name}</h3>
                    <div class="flex -mx-4">
                        <img src="https://via.placeholder.com/150" alt="${species.common_name}" class="species-image w-3/4 h-3/4 rounded-md p-4">
                        <p class="text-gray-700 mt-2 px-4 w-1/2">${truncatedDescription}</p>
                    </div>
                </div>
            `).join('');

            // let cardsHtml = speciesList.map(species => {
            //     const truncatedDescription = species.description.length > 75 ? species.description.substring(0, 75) + '...' : species.description;
            //         return `
            //             <div class="card max-w-md bg-white rounded-lg border border-gray-200 shadow-md m-8 p-4 cursor-pointer" role="button" onclick="openModal('${species.common_name}', '${species.image}', '${species.description}')">
            //                 <h3 class="text-xl text-customBlue font-semibold">${species.common_name}</h3>
            //                 <div class="flex -mx-4">
            //                     <img src="${species.image}" alt="${species.common_name}" data-taxon-id="${species.taxon_id}" class="species-image w-3/4 h-3/4 rounded-md p-4">
            //                     <p class="text-gray-700 mt-2 px-4 w-1/2">${truncatedDescription}</p>
            //                 </div>
            //             </div>
            //         `;
            //         }).join('');
                    // Append the category and its cards to the container
                    container.innerHTML += categoryHtml + cardsHtml + '</div>';
                });
        attachToggleEventListeners();
        attachCardEventListeners();
        // Asynchronously update images without waiting for all to complete before rendering categories.
        updateSpeciesImages();
    } catch (error) {
        console.error('Error loading the JSON data:', error);
    }
};




const initializeApp = () => {
    // Menu functionality
    hamburgerButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));
    
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
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange(); // Ensure correct section is displayed on initial load

    // Card toggle functionality
    cardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetCards = document.querySelectorAll(`.card[data-card="${targetId}"]`);
            // Toggle visibility of target cards
            targetCards.forEach(card => {
                card.classList.toggle('hidden');
            });
            // Toggle the arrow direction on the button
            button.classList.toggle('triangle-up');
            button.classList.toggle('triangle-down');
        });
    });
    
    // MODAL
    

    // Assign openModal function to the window object for global access
    window.openModal = openModal;  
    // Modal interactions
    cardModals.forEach(card => {
        card.addEventListener('click', async (e) => {
            const title = card.querySelector('h2').textContent;
            const taxonId = card.dataset.taxonId;
            // const imageSrc = card.querySelector('img').src;
            const description = card.querySelector('p').textContent;

            const imageUrl = await fetchImageFromAPI(taxonId)
            openModal(title, imageUrl, description);
        });
    });
    closeModalButton.addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        if (event.target.id === 'modal') {
            closeModal();

        }
    }); 
    loadSpeciesData();
    document.addEventListener('DOMContentLoaded', initializeApp);

}
    



