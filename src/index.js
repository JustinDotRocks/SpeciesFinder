

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Toggling cards functionality
    document.querySelectorAll('.triangle-button').forEach(button => {
        button.addEventListener('click', function() {
            // Toggle the triangle direction classes
            this.classList.toggle('triangle-up');
            this.classList.toggle('triangle-down');

            // Get the target card ID from the data-target attribute
            const targetCardId = this.getAttribute('data-target');

            // Find and toggle visibility of all corresponding cards
            document.querySelectorAll(`.card[data-card="${targetCardId}"]`).forEach(card => {
                card.classList.toggle('hidden');
            });
        });
    });

    // Functionality for opening and closing the modal
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            // Extract and set the title
            const title = this.querySelector('h2').textContent;
            document.getElementById('modalTitle').textContent = title;
    
            // Extract and set the image source
            const imageSrc = this.querySelector('img').src;
            document.getElementById('modalImage').src = imageSrc;
    
            // Extract and set the description
            const description = this.querySelector('p').textContent;
            document.getElementById('modalDescription').textContent = description;
    
            // Show the modal
            document.getElementById('modal').classList.remove('hidden');
        });
    });

    // Closing the  card modal
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('modal').classList.add('hidden');
    });

    // Hamburger Menu Functionality
    const hamburgerButton = document.getElementById('hamburger-button');
    const menuModal = document.getElementById('menu-modal');
    const overlay = document.getElementById('overlay');
    const homeLink = document.getElementById('homeLink');

    hamburgerButton.addEventListener('click', () => {
        console.log("Hamburger button clicked");

        menuModal.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
    });

    // Close  menu modal when clicking on overlay
    overlay.addEventListener('click', () => {
        menuModal.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    // Closes the menu modal when the Home link in the menu is clicked
    homeLink.addEventListener('click', function() {
        // Close the menu modal and overlay
        menuModal.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    // About Page Toggling

    document.getElementById('aboutLink').addEventListener('click', () => {
        document.getElementById('menu-modal').classList.add('hidden');
        document.getElementById('overlay').classList.add('hidden');
    });
    
});

function handleRouteChange() {
    const hash = window.location.hash;

    // Hide both main content and About section initially
    const mainContent = document.getElementById('mainContent'); 
    const aboutPage = document.getElementById('aboutPage');
    mainContent.classList.add('hidden');
    aboutPage.classList.add('hidden');

    // Conditional rendering based on the hash
    if (hash === '#about') {
        // Show About page
        aboutPage.classList.remove('hidden');
    } else {
        // Show main content
        mainContent.classList.remove('hidden');
    }
    // Scroll to the top of the page
    window.scrollTo(0, 0);
}

window.addEventListener('hashchange', handleRouteChange, false);


handleRouteChange();

