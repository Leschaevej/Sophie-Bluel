export { openModal, checkAuth, modalGallery, modalForm };

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
    const modalContent = document.getElementById("modalContent");
    const addPhotoButton = document.querySelector("#addPhotoButton"); // Le bouton "Ajouter une photo"

    // Créer la nouvelle div backAndClose
    const backAndClose = document.createElement('div');
    backAndClose.classList.add('backAndClose');

    // Créer et ajouter le bouton de retour (backButton)
    const backButton = document.createElement('button');
    backButton.classList.add('backButton');
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    backButton.style.display = "none";  // Masquer au départ
    backAndClose.appendChild(backButton);

    // Créer et ajouter le bouton de fermeture (closeButton)
    const closeButton = document.createElement('button');
    closeButton.classList.add('closeButton');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    backAndClose.appendChild(closeButton);

    // Ajouter backAndClose à modalContent
    modalContent.insertBefore(backAndClose, modalContent.firstChild); // Ajouter au début de modalContent

    // Afficher la modale lorsqu'on clique sur "Modifier"
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

        // Cacher le bouton retour lorsqu'on est sur la galerie
        backButton.style.display = "none"; 
        // Toujours afficher le bouton de fermeture (closeButton) à droite
        closeButton.style.display = "block"; 
    });

    // Fermer la modale lorsqu'on clique sur le bouton "X"
    closeButton.addEventListener("click", function() {
        modalOverlay.style.display = "none";
        document.body.classList.remove("no-scroll");
        resetFormFields();
    });

    // Fermer la modale si l'utilisateur clique en dehors de la zone de contenu
    modalOverlay.addEventListener("click", function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = "none";
            document.body.classList.remove("no-scroll");
            resetFormFields();
        }
    });

    // Lier le bouton "Ajouter une photo" à la fonction showPhotoForm
    addPhotoButton.addEventListener("click", function() {
        showPhotoForm();
    });

    // Ajouter un événement au bouton retour pour revenir à la galerie
    backButton.addEventListener('click', function() {
        const modalGallery = document.querySelector(".modalGallery");
        const modalForm = document.querySelector(".modalForm");

        // Afficher la galerie et masquer le formulaire
        modalGallery.style.display = "flex";
        modalForm.style.display = "none";

        // Cacher le bouton retour
        backButton.style.display = "none";
    });
}

function showPhotoForm() {
    // Masquer la galerie et afficher le formulaire
    const modalGallery = document.querySelector(".modalGallery");
    const modalForm = document.querySelector(".modalForm");
    const backButton = document.querySelector(".backButton");

    modalGallery.style.display = "none";  // Cache la galerie
    modalForm.style.display = "flex";     // Affiche le formulaire

    // Afficher le bouton retour
    backButton.style.display = "block";
}

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

function modalForm() {
    // Obtenez la référence de la div "modalForm"
    const modalForm = document.querySelector('.modalForm');

    // Créer le titre h2
    const h2 = document.createElement('h2');
    h2.textContent = 'Ajout photo';
    modalForm.appendChild(h2);

    // Créer le conteneur du formulaire
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    modalForm.appendChild(formContainer);

    // Créer la div pour l'ajout de l'image
    const addImageInput = document.createElement('div');
    addImageInput.classList.add('add-image-input');
    formContainer.appendChild(addImageInput);

    // Ajouter l'icône
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-image');
    addImageInput.appendChild(icon);

    // Créer et ajouter le champ de fichier pour l'image
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.id = 'image';
    imageInput.name = 'image';
    imageInput.accept = ".jpg, .jpeg, .png"
    imageInput.placeholder = '+ Ajouter photo';
    imageInput.required = true;
    addImageInput.appendChild(imageInput);

    // Verifi la taille de l'image
    document.getElementById('image').addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

            if (file.size > maxSize) {
                alert("La taille de l'image ne doit pas dépasser 4 Mo.");
                event.target.value = ''; // Réinitialise l'input si le fichier est trop grand
            }
        }
    });

    // Ajouter un event listener pour afficher la prévisualisation de l'image sélectionnée
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                console.log('Image chargée :', e.target.result); // Vérifiez si l'image est correctement lue

                // Vider le conteneur previewContainer avant d'ajouter la prévisualisation
                previewContainer.innerHTML = ''; // Effacer le contenu du conteneur

                // Créer une image pour afficher la prévisualisation
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Image prévisualisée';

                // Ajoutez l'image au conteneur de prévisualisation
                previewContainer.appendChild(img);

                // Cacher l'icône, l'input et le texte dans .add-image-input
                const icon = addImageInput.querySelector('i');
                const input = addImageInput.querySelector('input');
                const infoText = addImageInput.querySelector('p');

                if (icon) icon.style.display = 'none';
                if (input) input.style.display = 'none';
                if (infoText) infoText.style.display = 'none';
            };

            // Lire le fichier sélectionné
            reader.readAsDataURL(file);
        } else {
            console.log('Aucun fichier sélectionné');
        }
    });

    // Ajouter un conteneur pour afficher la prévisualisation de l'image
    const previewContainer = document.createElement('div');
    previewContainer.id = 'imagePreview';
    addImageInput.appendChild(previewContainer);

    // Ajouter le texte
    const infoText = document.createElement('p');
    infoText.textContent = 'jpg, png : 4mo max';
    addImageInput.appendChild(infoText);

    // Créer et ajouter le champ "Titre"
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Titre';
    formContainer.appendChild(titleLabel);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'title';
    titleInput.name = 'title';
    titleInput.required = true;
    titleInput.placeholder = 'Ajouter un titre';
    formContainer.appendChild(titleInput);

    // Créer et ajouter le champ "Catégorie"
    const categoryLabel = document.createElement('label');
    categoryLabel.setAttribute('for', 'category');
    categoryLabel.textContent = 'Catégorie';
    formContainer.appendChild(categoryLabel);

    const categorySelect = document.createElement('select');
    categorySelect.id = 'category';
    categorySelect.name = 'category';
    categorySelect.required = true;
    formContainer.appendChild(categorySelect);

    document.addEventListener('DOMContentLoaded', () => {
        const categorySelect = document.getElementById('category');
    
        categorySelect.selectedIndex = -1;
    
        fetch('http://localhost:5678/api/categories/')
            .then(response => response.json())
            .then(data => {
                console.log('Catégories chargées depuis l\'API:', data);
    
                // Ajouter une option vide (par défaut rien n'est sélectionné)
                const defaultOption = document.createElement('option');
                defaultOption.value = '';  // Valeur vide
                defaultOption.textContent = 'Sélectionner une catégorie';  // Texte par défaut
                defaultOption.selected = true;
                defaultOption.disabled = true;
                categorySelect.appendChild(defaultOption);
    
                // Ajouter les options des catégories
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des catégories:', error);
            });
    });
}

function resetFormFields() {
    // Réinitialiser les valeurs des champs
    document.getElementById('image').value = '';  
    document.getElementById('title').value = '';  
    document.getElementById('category').selectedIndex = 0;  

    // Réafficher l'icône et le texte de l'input image
    const addImageInput = document.querySelector('.add-image-input');
    const previewContainer = document.getElementById('imagePreview');
    const icon = addImageInput.querySelector('i');
    const input = addImageInput.querySelector('input');
    const infoText = addImageInput.querySelector('p');

    if (previewContainer) previewContainer.innerHTML = ''; // Supprimer l'image prévisualisée
    if (icon) icon.style.display = 'block'; // Réafficher l'icône
    if (input) input.style.display = 'block'; // Réafficher l'input
    if (infoText) infoText.style.display = 'block'; // Réafficher le texte "jpg, png : 4mo max"
}