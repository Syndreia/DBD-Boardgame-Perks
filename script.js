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

//début options de filtres
const sortCheckbox = document.getElementById('sortCheckbox');
const killerCheckbox = document.getElementById('killerCheckbox');
const survivorCheckbox = document.getElementById('survivorCheckbox');

//langues
const languageSelect = document.getElementById('languageSelect');
const contentElements = document.querySelectorAll('.translate');

function displayImages(images) {
  imageContainer.innerHTML = '';

  images.forEach(image => {
    const imageElement = document.createElement('div');
    imageElement.classList.add('image-item');

//    const logoSrc = image.type === 'Tueur' ? 'img/tueur-logo.png' : 'img/survivant-logo.png';
    // Set the logo source based on the "statut" value
    let logoSrc = '';
    if (image.type === 'Tueur') {
      logoSrc = 'img/tueur-logo.png';
    } else if (image.type === 'Survivant') {
      logoSrc = 'img/survivant-logo.png';
    } else if (image.type === 'Item') {
      logoSrc = 'img/item-logo.png';
    }

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


function initialisationLanguage() {
  fetch(languageSelect.value+'data.json')
    .then(response => response.json())
    .then(data => {
      // Assign fetched data to the variable
      dataLog = data;
      displayImages(data);
    })
  .catch(error => console.error('Error fetching data:', error));
}

// fonction pour avoir les perks excluses uniquement
function showLockedPerks() {
  fetch(languageSelect.value+'data.json')
    .then(response => response.json())
    .then(data => {
      // Assign fetched data to the variable
      dataLog = data.filter(item => item.lock === true);
      displayImages(dataLog);
    })
  .catch(error => console.error('Error fetching data:', error));
}

// fonction pour les items uniquement
function showItemsOnly() {
  fetch(languageSelect.value+'data.json')
    .then(response => response.json())
    .then(data => {
      // Assign fetched data to the variable
      dataLog = data.filter(item => item.type === "item");
      displayImages(dataLog);
    })
  .catch(error => console.error('Error fetching data:', error));
}

//setup initial
initialisationLanguage();



// éléments pour la recherche
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default Enter behavior (form submission)
    performSearch();
  }
});


//REMPLACE LES ANCIENS BOUTONS CI-DESSOUS
noFilter.addEventListener('click', initialisationLanguage);
filterLockedPerks.addEventListener('click', showLockedPerks);
filterItem.addEventListener('click', showItemsOnly);
/*
// Attach event listeners to the filter buttons (les 2 boutons de base)
filterTueurButton.addEventListener('click', () => filterByType('Tueur'));
filterSurvivantButton.addEventListener('click', () => filterByType('Survivant'));
*/

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
// fin modal

// début filtre (OK ? Probable)
sortCheckbox.addEventListener('change', () => {
  if (sortCheckbox.checked) {
    // Sort images by cost (low to high)
    dataLog.sort((a, b) => a.cost - b.cost);
    displayImages(dataLog);
  } else {
    // Display images in their original order
    displayImages(dataLog);
  }
});

killerCheckbox.addEventListener('change', filterImages);
survivorCheckbox.addEventListener('change', filterImages);

// OK (à améliorer pour réafficher l'origine)
function filterImages() {
  const showKiller = killerCheckbox.checked;
  const showSurvivor = survivorCheckbox.checked;
  const searchTerm = searchInput.value.toLowerCase(); // Get the search input value

  // Filter images based on the checkbox selections and search input
  const filteredData = dataLog.filter(image => {
    const matchesType = (showKiller && image.type === 'Tueur') || (showSurvivor && image.type === 'Survivant');
    const matchesSearch = image.name.toLowerCase().includes(searchTerm) || image.description.toLowerCase().includes(searchTerm);
    
    return matchesType && matchesSearch;
  });

  // Display the filtered images
  displayImages(filteredData);
  if(!showKiller && !showSurvivor) {
    initialisationLanguage();
  }
}

//pour lancer recherche en permanence (OK)
searchInput.addEventListener('input', performSearch);

/*   PARTIE
     TRADUCTION */

// Create a function to load language content
function loadLanguage(languageCode) {
  fetch(`${languageCode}.json`)
    .then(response => response.json())
    .then(data => {
      // Update content based on language file
      document.getElementById('searchInput').placeholder = data['searchPlaceholder'];
      contentElements.forEach(element => {
        const key = element.dataset.translation; 
        if (key && data[key]) {
          element.textContent = data[key];
        }
      });
    })
    .catch(error => console.error('Error loading language:', error));
}

// Attach event listener to the language select element
languageSelect.addEventListener('change', () => {
  const selectedLanguage = languageSelect.value;
  loadLanguage(selectedLanguage);
  initialisationLanguage();
});

// Load the default language (e.g., English) on page load
loadLanguage(languageSelect.value);
/*  FIN 
    PARTIE
     TRADUCTION */


/* parallax cool pour + tard
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  parallaxLayer2.style.transform = `translateY(${scrollPosition * 0.2}px)`;
  parallaxLayer3.style.transform = `translateY(${scrollPosition * 0.3}px)`;
});
*/