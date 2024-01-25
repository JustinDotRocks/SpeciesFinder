// fetch('data.json')
//   .then(response => response.json())
//   .then(data => {
//     // Use your data here
//     console.log(data);
//   })
//   .catch(error => console.error('Error:', error));

//   document.addEventListener('DOMContentLoaded', () => {
//     // Selecting the button using its class
//     const menuButton = document.querySelector('.menu-button');
    
//     menuButton.addEventListener('click', () => {
//       // Assuming you have another element to toggle, like a menu
//       const menu = document.querySelector('.menu');
//       menu.classList.toggle('hidden');
//     });
//   });
  

// Toggling the menu on mobile
document.getElementById('menuToggle').addEventListener('click', function() {
    document.querySelector('aside').classList.toggle('-translate-x-full');
});
  

// Adding click to triangle button
document.getElementById('arrow-button').addEventListener('click', () => {
    console.log('Triangle button clicked!');
});


document.getElementById('hamburger-button').addEventListener('click', () => {
    // Toggle navigation menu or similar functionality
});

