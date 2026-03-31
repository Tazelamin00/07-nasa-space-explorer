// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);


// Show a random "Did You Know?" fact on page load
const factBox = document.getElementById('fact-box');
const facts = [
  "NASA stands for National Aeronautics and Space Administration!",
  "The Hubble Space Telescope has been in orbit since 1990.",
  "The first person on the Moon was Neil Armstrong in 1969.",
  "NASA’s Mars rovers have traveled many miles across the Red Planet.",
  "The International Space Station orbits Earth about every 90 minutes.",
  "NASA’s Voyager 1 is the farthest human-made object from Earth.",
  "The Sun is about 93 million miles (150 million km) from Earth.",
  "Jupiter is the largest planet in our solar system.",
  "NASA’s Perseverance rover landed on Mars in 2021.",
  "Saturn’s rings are made mostly of ice and rock."
];
function showRandomFact() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  factBox.textContent = `Did You Know? ${facts[randomIndex]}`;
}
showRandomFact();

// Find the button and gallery elements
const button = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA APOD API key (DEMO_KEY is public, but has limited requests per hour)
const API_KEY = 'DEMO_KEY';

// Function to fetch APOD data for a date range
async function fetchAPODImages(startDate, endDate) {
  // Build the API URL with start and end dates
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  // Fetch data from NASA's API
  const response = await fetch(url);
  // Parse the JSON data
  const data = await response.json();
  return data;
}

// Function to display images in the gallery
function displayGallery(images) {
  // Clear the gallery first
  gallery.innerHTML = '';
  let imageCount = 0;
  // Loop through each image and create a card
  images.forEach(item => {
    // Only show images (not videos)
    if (item.media_type === 'image') {
      imageCount++;
      // Create a div for the gallery item
      const div = document.createElement('div');
      div.className = 'gallery-item';
      // Add the image, title, and description
      div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.date}</p>
        <p>${item.explanation}</p>
      `;
      gallery.appendChild(div);
    }
  });
  // If no images found, show a message
  if (imageCount === 0) {
    gallery.innerHTML = '<p>No images found for this date range.</p>';
  }
}

// When the button is clicked, fetch and show images
// Add a click event to the button to fetch and show images
button.addEventListener('click', async function() {
  // Get the selected dates from the input fields
  const startDate = startInput.value;
  const endDate = endInput.value;
  // Show a loading message while fetching
  gallery.innerHTML = '<p class="loading-message">Loading images...</p>';
  try {
    // Fetch images from NASA's API
    const images = await fetchAPODImages(startDate, endDate);
    // Display the images in the gallery
    displayGallery(images);
  } catch (error) {
    // Show an error message if something goes wrong
    gallery.innerHTML = '<p>Sorry, there was a problem loading the images.</p>';
  }
});

// Modal logic
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');
const modalClose = document.querySelector('.modal-close');

// Open modal when an image is clicked
gallery.addEventListener('click', function(event) {
  const item = event.target.closest('.gallery-item');
  if (item && event.target.tagName === 'IMG') {
    // Get info from the clicked card
    modalImg.src = event.target.src;
    modalTitle.textContent = item.querySelector('h3').textContent;
    modalDate.textContent = item.querySelectorAll('p')[0].textContent;
    modalExplanation.textContent = item.querySelectorAll('p')[1].textContent;
    modal.style.display = 'block';
  }
});

// Close modal when X is clicked
modalClose.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Close modal when clicking outside modal content
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
