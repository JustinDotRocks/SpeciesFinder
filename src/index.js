// Single Event Listener for the Triangle Button
document.addEventListener('DOMContentLoaded', () => {
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
});






