export { openModal, checkAuth, modalGallery, modalForm, addNewWork };

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
    const openModalLink = document.querySelector("#openModalLink");
    const modalOverlay = document.querySelector(".modalOverlay");
    const modalContent = document.querySelector(".modalContent");

    let addPhotoButton = document.querySelector('.addPhotoButton');
    if (!addPhotoButton) {
        addPhotoButton = document.createElement('button');
        addPhotoButton.classList.add('addPhotoButton');
        addPhotoButton.innerHTML = 'Ajouter une photo';
    }

    if (modalContent && !modalContent.contains(addPhotoButton)) {
        modalContent.appendChild(addPhotoButton);
    }

    const backAndClose = document.createElement('div');
    backAndClose.classList.add('backAndClose');

    const backButton = document.createElement('button');
    backButton.classList.add('backButton');
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    backAndClose.appendChild(backButton);

    const closeButton = document.createElement('button');
    closeButton.classList.add('closeButton');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    backAndClose.appendChild(closeButton);

    modalContent.insertBefore(backAndClose, modalContent.firstChild);

    openModalLink.addEventListener("click", function(event) {
        event.preventDefault();
        modalOverlay.style.display = "flex";
        document.body.classList.add("no-scroll");

        const modalGallery = document.querySelector(".galleryContainer");
        const modalForm = document.querySelector(".formContainer");

        if (modalGallery) {
            modalGallery.style.display = "flex";
        }

        if (modalForm) {
            modalForm.style.display = "none";
        }

        backButton.style.display = "none";
        closeButton.style.display = "block";
        addPhotoButton.style.display = "inline-block";
    });

    closeButton.addEventListener("click", function() {
        modalOverlay.style.display = "none";
        document.body.classList.remove("no-scroll");
        resetFormFields();
    });

    modalOverlay.addEventListener("click", function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = "none";
            document.body.classList.remove("no-scroll");
            resetFormFields();
        }
    });

    addPhotoButton.addEventListener("click", function() {
        showPhotoForm();  // Afficher la modale du formulaire
    });
}

function showPhotoForm() {
    const modalGallery = document.querySelector(".galleryContainer");
    const modalForm = document.querySelector(".formContainer");
    const backButton = document.querySelector(".backButton");

    if (modalGallery && modalForm) {
        modalGallery.style.display = "none";  // Cache la galerie
        modalForm.style.display = "flex";     // Affiche le formulaire
    }

    if (backButton) backButton.style.display = "block";

    backButton.addEventListener('click', function() {
        if (modalGallery && modalForm) {
            modalGallery.style.display = "flex";  // Afficher la galerie
            modalForm.style.display = "none";     // Masquer le formulaire
        }

        if (backButton) backButton.style.display = "none";  // Cacher le bouton retour
    });
}


function modalGallery() {
    // Sélectionne le conteneur de la galerie dans la modale
    const modalGallery = document.querySelector(".galleryContainer");
    modalGallery.innerHTML = ''; // Nettoie la galerie avant de la remplir à nouveau

    // Crée le titre h2 sans envelopper dans une div
    const galleryTitle = document.createElement('h2');
    galleryTitle.textContent = "Galerie photo";
    modalGallery.appendChild(galleryTitle); // Ajoute directement le titre à modalGallery

    // Crée un conteneur pour les images
    const galleryContainer = document.createElement('div');
    galleryContainer.className = "modalGallery";

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
    const modalForm = document.querySelector('.formContainer');

    // Créer le titre h2
    const h2 = document.createElement('h2');
    h2.textContent = 'Ajout photo';
    modalForm.appendChild(h2);

    // Créer le conteneur du formulaire
    const formContainer = document.createElement('div');
    formContainer.classList.add('modalForm');
    modalForm.appendChild(formContainer);

    // Créer la div pour l'ajout de l'image
    const addImageInput = document.createElement('div');
    addImageInput.classList.add('addImageInput');
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
    imageInput.accept = ".jpg, .jpeg, .png";
    imageInput.placeholder = 'Ajouter photo';
    imageInput.required = true;
    imageInput.style.display = 'none'; // Cacher l'input de type file
    addImageInput.appendChild(imageInput);

    // Créer un bouton personnalisé pour ajouter la photo
    const customButton = document.createElement('button');
    customButton.textContent = 'Ajouter photo';
    customButton.classList.add('customAddPhotoButton');
    addImageInput.appendChild(customButton);

    // Ajouter un événement au bouton pour déclencher l'input file
    customButton.addEventListener('click', function() {
        imageInput.click(); // Ouvrir le sélecteur de fichier
    });

    // Vérifier la taille de l'image
    imageInput.addEventListener('change', function(event) {
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
    const addImageInput = document.querySelector('.addImageInput');
    const previewContainer = document.getElementById('imagePreview');
    const icon = addImageInput.querySelector('i');
    const input = addImageInput.querySelector('input');
    const infoText = addImageInput.querySelector('p');

    if (previewContainer) previewContainer.innerHTML = ''; // Supprimer l'image prévisualisée
    if (icon) icon.style.display = 'block'; // Réafficher l'icône
    if (input) input.style.display = 'block'; // Réafficher l'input
    if (infoText) infoText.style.display = 'block'; // Réafficher le texte "jpg, png : 4mo max"
}

function addNewWork() {
    const modalForm = document.querySelector(".modalForm");

    if (!modalForm) {
        console.error("Formulaire modalForm non trouvé");
        return;
    }

    modalForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("image", document.querySelector("#image").files[0]);
        formData.append("title", document.querySelector("#title").value);
        formData.append("category", document.querySelector("#category").value);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            });

            if (response.ok) {
                alert("Work ajouté avec succès !");
                resetFormFields();
                modalGallery(); 
            } else {
                alert("Erreur lors de l'ajout du work.");
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    });
}
