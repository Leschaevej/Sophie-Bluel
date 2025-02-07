export { openModal, checkAuth, modalGallery };

function checkAuth() {
    const token = localStorage.getItem("token");
    const openModalLink = document.getElementById("openModalLink");

    if (token) {
        // L'utilisateur est connecté
        openModalLink.style.display = "inline";
    } else {
        // L'utilisateur n'est pas connecté
        openModalLink.style.display = "none";
    }
};

// Fonction pour gérer l'ouverture et la fermeture de la modale
function openModal() {
    const openModalLink = document.getElementById("openModalLink");
    const modalOverlay = document.getElementById("modalOverlay");
    const closeModalButton = document.getElementById("closeModal");
    const addPhotoButton = document.querySelector("#addPhotoButton"); // Le bouton "Ajouter une photo"

    // Ouvrir la modale lorsque l'utilisateur clique sur "Modifier"
    openModalLink.addEventListener("click", function(event) {
        event.preventDefault();
        modalOverlay.style.display = "flex";
        document.body.classList.add("no-scroll");

        // Réinitialiser l'affichage des éléments dans la modale
        const modalGallery = document.querySelector(".modalGallery");
        const modalForm = document.querySelector(".modalForm");
        
        // Initialement, la galerie est affichée et le formulaire est caché
        modalGallery.style.display = "flex";
        modalForm.style.display = "none";
    });

    // Fermer la modale lorsqu'on clique sur le bouton "X"
    closeModalButton.addEventListener("click", function() {
        modalOverlay.style.display = "none";
        document.body.classList.remove("no-scroll");
    });

    // Fermer la modale si l'utilisateur clique en dehors de la zone de contenu
    modalOverlay.addEventListener("click", function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = "none";
            document.body.classList.remove("no-scroll");
        }
    });

    // Lier le bouton "Ajouter une photo" à la fonction showPhotoForm
    addPhotoButton.addEventListener("click", function() {
        showPhotoForm();
    });
};

function showPhotoForm() {
    // Masquer la galerie et afficher le formulaire
    const modalGallery = document.querySelector(".modalGallery");
    const modalForm = document.querySelector(".modalForm");

    modalGallery.style.display = "none";  // Cache la galerie
    modalForm.style.display = "flex";     // Affiche le formulaire
};

function modalGallery() {
    // Sélectionne le conteneur de la galerie dans la modale
    const modalGallery = document.querySelector(".modalGallery");
    modalGallery.innerHTML = ''; // Nettoie la galerie avant de la remplir à nouveau

    // Crée le titre de la galerie
    const modalGalleryTitle = document.createElement('div');
    modalGalleryTitle.className = "modal-Gallery-title";
    const galleryTitle = document.createElement('h2');
    galleryTitle.textContent = "Galerie photo";
    modalGalleryTitle.appendChild(galleryTitle);
    modalGallery.appendChild(modalGalleryTitle);

    // Crée un conteneur pour les images
    const galleryContainer = document.createElement('div');
    galleryContainer.className = "gallery-container";

    // Récupère la galerie principale et clone son contenu
    const mainGallery = document.querySelector('.gallery');
    
    const galleryClone = mainGallery.cloneNode(true);

    // Récupère chaque image de la galerie clonée
    const images = galleryClone.querySelectorAll('img');
        
    images.forEach((img) => {
        // Crée un conteneur pour chaque image
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        // Ajoute l'image clonée
        const clonedImage = img.cloneNode(true);
        imageContainer.appendChild(clonedImage);

        // Crée un bouton de suppression pour chaque image
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        imageContainer.appendChild(deleteButton);
        galleryContainer.appendChild(imageContainer)
    });
    

    // Ajoute le wrapper des images dans la modale
    modalGallery.appendChild(galleryContainer);
};
