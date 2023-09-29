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
    } else if (image.type === 'item') {
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


//REMPLACE LES ANCIENS BOUTONS
noFilter.addEventListener('click', initialisationLanguage);
filterLockedPerks.addEventListener('click', showLockedPerks);
filterItem.addEventListener('click', showItemsOnly);


function performSearch() {
  const showKiller = killerCheckbox.checked;
  const showSurvivor = survivorCheckbox.checked;
  const showAll = characterCheckbox.checked;
  const searchTerm = searchInput.value.toLowerCase();
  const sortCroiss = sortCheckbox.checked;
  const sortDecroiss = sortCheckboxDecr.checked;

  if(sortCroiss) {
    dataLog.sort((a, b) => a.cost - b.cost);
  }
  if (sortDecroiss) {
    dataLog.sort((a, b) => b.cost - a.cost);
  }

  if(showAll || (!showKiller && ! showSurvivor && !showAll)) {
    const filteredData = dataLog.filter(image => 
      image.name.toLowerCase().includes(searchTerm) || 
      image.description.toLowerCase().includes(searchTerm)
    );
    displayImages(filteredData);
  }
  else {
    const filteredData = dataLog.filter(image => {
      const matches = (showKiller && image.type === 'Tueur' && (image.name.toLowerCase().includes(searchTerm) || image.description.toLowerCase().includes(searchTerm))) 
              || (showSurvivor && image.type === 'Survivant'&& (image.name.toLowerCase().includes(searchTerm) || image.description.toLowerCase().includes(searchTerm)));
       return matches;
    });
    displayImages(filteredData);
  }
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

sortCheckbox.addEventListener('change', performSearch);
sortCheckboxDecr.addEventListener('change', performSearch);

killerCheckbox.addEventListener('change', performSearch);
survivorCheckbox.addEventListener('change', performSearch);
characterCheckbox.addEventListener('change', performSearch);

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