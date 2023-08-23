const imageContainer = document.querySelector('.image-container');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterTueurButton = document.getElementById('filterTueur');
const filterSurvivantButton = document.getElementById('filterSurvivant');
//const parallaxLayer2 = document.getElementById('parallax-layer2');
//const parallaxLayer3 = document.getElementById('parallax-layer3'); // à implémenter + tard

// pour le modal qui m'aura cassé les couilles un bon moment
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
// pour le modal

function displayImages(images) {
  imageContainer.innerHTML = '';

  images.forEach(image => {
    const imageElement = document.createElement('div');
    imageElement.classList.add('image-item');

    const logoSrc = image.type === 'Tueur' ? 'img/tueur-logo.png' : 'img/survivant-logo.png';

    imageElement.innerHTML = `
      <img src="${image.imagePath}" alt="${image.name}">
      <h3>${image.name}</h3>
      <p class="cost">
        <span class="cost-logo"><img src="img/BPlogo.png" alt="Logo"></span>
        ${image.cost}
      </p>
      <p>${image.description}</p>
      <img src="${logoSrc}" alt="${image.type} Logo" class="type-logo">
    `;
	imageElement.addEventListener('click', () => openModal(image)); // POUR LE MODAL
    imageContainer.appendChild(imageElement);
  });
}

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Assign fetched data to the variable
    dataLog = data;
    displayImages(data);
  })
  .catch(error => console.error('Error fetching data:', error));

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default Enter behavior (form submission)
    performSearch();
  }
});

// Attach event listeners to the filter buttons
filterTueurButton.addEventListener('click', () => filterByType('Tueur'));
filterSurvivantButton.addEventListener('click', () => filterByType('Survivant'));

function performSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredData = dataLog.filter(image => 
    image.name.toLowerCase().includes(searchTerm) || 
    image.description.toLowerCase().includes(searchTerm)
  );
  displayImages(filteredData);
}

function filterByType(type) {
  const filteredData = dataLog.filter(image => image.type === type);
  displayImages(filteredData);
}


/* parallax cool pour + tard
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  parallaxLayer2.style.transform = `translateY(${scrollPosition * 0.2}px)`;
  parallaxLayer3.style.transform = `translateY(${scrollPosition * 0.3}px)`;
});
*/

// pour le modal de mes 2
function openModal(image) {
  modal.style.display = 'block';
  modalImage.src = image.imagePath;

  modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', outsideClick);
}

function closeModal() {
  modal.style.display = 'none';
  modalImage.src = '';
  modalClose.removeEventListener('click', closeModal);
  window.removeEventListener('click', outsideClick);
}

function outsideClick(event) {
  if (event.target === modal) {
    closeModal();
  }
}