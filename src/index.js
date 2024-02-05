document.addEventListener('DOMContentLoaded', () => {
    // Variables for common elements
    const hamburgerButton = document.getElementById('hamburger-button');
    const menuModal = document.getElementById('menu-modal');
    const overlay = document.getElementById('overlay');
    const menuLinks = document.querySelectorAll('#menu-modal');
    const cardButtons = document.querySelectorAll('.triangle-button');
    const cardModals = document.querySelectorAll('.card');
    const closeModalButton = document.getElementById('closeModal');
    const speciesSelectorLink = document.getElementById('speciesSelectorLink');
    const speciesHeader = document.getElementById('species-selector');

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
        setTimeout(() => menuModal.classList.add('hidden'), 300);
        overlay.classList.add('hidden');
        hamburgerButton.classList.remove('hamburger-x');
    };

    // Menu functionality
    hamburgerButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Card toggle functionality
    cardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetCards = document.querySelectorAll(`.card[data-card="${targetId}"]`);
            targetCards.forEach(card => {
                card.classList.toggle('hidden');
            });
        });
    });

    // Modal interactions
    cardModals.forEach(card => {
        card.addEventListener('click', (e) => {
            const title = card.querySelector('h2').textContent;
            const imageSrc = card.querySelector('img').src;
            const description = card.querySelector('p').textContent;
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalImage').src = imageSrc;
            document.getElementById('modalDescription').textContent = description;
            document.getElementById('modal').classList.remove('hidden');
        });
    });

    closeModalButton.addEventListener('click', () => {
        document.getElementById('modal').classList.add('hidden');
    });

    // Handle route changes for about page and main content visibility
    const handleRouteChange = () => {
        const hash = window.location.hash;
        const mainContent = document.getElementById('mainContent');
        const aboutPage = document.getElementById('aboutPage');

        mainContent.classList.toggle('hidden', hash === '#about');
        aboutPage.classList.toggle('hidden', hash !== '#about');
        window.scrollTo(0, 0);
    };


    speciesSelectorLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior
        
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
});
