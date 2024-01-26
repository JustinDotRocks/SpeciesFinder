
// Toggles the hidden class on the card when the triangle button is clicked.
document.addEventListener('DOMContentLoaded', () => {
    // Select all arrow buttons
    document.querySelectorAll('.arrow-button').forEach(button => {
        button.addEventListener('click', () => {
            // Get the target card ID from the data-target attribute of the clicked button
            const targetCardId = button.getAttribute('data-target');
            // Find all corresponding cards using the data-card attribute and toggle them
            document.querySelectorAll(`.card[data-card="${targetCardId}"]`).forEach(card => {
                card.classList.toggle('hidden');
            });
        });
    });
});





