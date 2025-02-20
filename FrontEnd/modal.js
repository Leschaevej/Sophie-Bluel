export { openModal, modalGallery, modalForm,};

let eventListenersAdded = false;

// Fonction pour ouvrir la modal
function openModal() {
    // Sélectionne les éléments nécessaires pour l'affichage de la modal
    const openModalLink = document.querySelector(".openModalLink");
    const modalOverlay = document.querySelector(".modalOverlay");
    const modalContent = document.querySelector(".modalContent");

    // Vérifie si la section contenant les boutons retour et fermeture existe déjà
    let backAndClose = document.querySelector('.backAndClose');
    if (!backAndClose) {
        // Création d'un conteneur pour les boutons retour et fermeture
        backAndClose = document.createElement('div');
        backAndClose.classList.add('backAndClose');

        // Création du bouton retour
        const backButton = document.createElement('button');
        backButton.classList.add('backButton');
        backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        backAndClose.appendChild(backButton);

        // Création du bouton de fermeture
        const closeButton = document.createElement('button');
        closeButton.classList.add('closeButton');
        closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        backAndClose.appendChild(closeButton);

        // Insère la barre contenant les boutons en haut du contenu de la modal
        modalContent.insertBefore(backAndClose, modalContent.firstChild);
    }

    // Ajoute un événement au clic sur le lien d'ouverture de la modal
    openModalLink.addEventListener("click", function(event) {
        event.preventDefault();

        // Calcul de la largeur du scrollbar pour éviter les décalages
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Ajuste la barre de mode édition
        const modeEditionBar = document.querySelector('.modeEditionBar');
        if (modeEditionBar) {
            modeEditionBar.style.paddingRight = `${scrollbarWidth}px`;
        }

        // Empêche le défilement de la page en arrière-plan
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        // Affiche la modal et son contenu
        modalOverlay.style.display = "flex";
        modalContent.style.display = "block";

        // Gère l'affichage des différentes sections de la modal
        const modalGallery = document.querySelector(".galleryContainer");
        const modalForm = document.querySelector(".formContainer");
        if (modalGallery) modalGallery.style.display = "flex";
        if (modalForm) modalForm.style.display = "none";

        // Sélectionne les boutons de retour et fermeture
        const backButton = document.querySelector('.backButton');
        const closeButton = document.querySelector('.closeButton');

        // Cache le bouton de retour
        if (backButton) backButton.style.display = "none";

        // Affiche le bouton de fermeture
        if (closeButton) closeButton.style.display = "block";

        // Masque l'input d'ajout d'image
        const imageInput = document.querySelector('.image');
        if (imageInput) imageInput.style.display = 'none';

        // Fonction pour fermer la modal
        function closeModal() {
            modalOverlay.style.display = "none";
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
            resetFormFields();
        }

        // Ajoute un événement pour fermer la modal lorsque l'utilisateur clique sur le bouton de fermeture
        closeButton.addEventListener("click", closeModal);

        // Ajoute un événement pour fermer la modal si l'utilisateur clique en dehors du contenu
        modalOverlay.addEventListener("click", function(event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    });
}

// Fonction pour afficher le formulaire d'ajout de photo
function showPhotoForm() {
    const modalGallery = document.querySelector(".galleryContainer");
    const modalForm = document.querySelector(".formContainer");
    const backButton = document.querySelector(".backButton");
    const imageInput = document.querySelector('.image');

    // Change l'affichage pour montrer le formulaire d'ajout
    if (modalGallery && modalForm) {
        modalGallery.style.display = "none";
        modalForm.style.display = "flex";
    }

    // Cache l'input de l'image
    if (imageInput) {
        imageInput.style.display = 'none';
    }

    // Affiche le bouton de retour
    if (backButton) {
        backButton.style.display = "block";
    }

    // Gestion du clic sur le bouton de retour pour revenir à la galerie
    backButton.addEventListener('click', function() {
        if (modalGallery && modalForm) {
            modalGallery.style.display = "flex";
            modalForm.style.display = "none"; 
        }

        // Cache le bouton de retour et réinitialise les champs du formulaire
        if (backButton) backButton.style.display = "none";

        resetFormFields();
    });
}

// Fonction pour afficher la galerie dans la modal
function modalGallery() {
    
    const modalGallery = document.querySelector(".galleryContainer");
    modalGallery.innerHTML = '';

    // Ajout du titre de la galerie
    const galleryTitle = document.createElement('h2');
    galleryTitle.textContent = "Galerie photo";
    modalGallery.appendChild(galleryTitle);
    const galleryContainer = document.createElement('div');
    galleryContainer.className = "modalGallery";

    // Récupère les œuvres depuis l'API et les affiche dans la galerie
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            data.forEach(work => {
                const modalImageContainer = document.createElement('div');
                modalImageContainer.className = 'modal-image-container';

                const img = document.createElement('img');
                img.src = work.imageUrl;
                img.alt = work.title;
                img.dataset.workId = work.id;

                modalImageContainer.appendChild(img);

                // Ajout du bouton de suppression pour chaque image
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                modalImageContainer.appendChild(deleteButton);

                galleryContainer.appendChild(modalImageContainer);

                // Gestion du clic sur le bouton de suppression
                deleteButton.addEventListener('click', function() {
                    const workId = img.dataset.workId;
                    deleteWorks(workId, modalImageContainer);
                });
            });
        })

    modalGallery.appendChild(galleryContainer);

    // Ajout du bouton pour afficher le formulaire d'ajout d'une photo
    let showFormButton = document.querySelector('.showFormButton');
    if (!showFormButton) {
        showFormButton = document.createElement('button');
        showFormButton.classList.add('showFormButton');
        showFormButton.innerHTML = 'Ajouter une photo';
    }

    if (!modalGallery.contains(showFormButton)) {
        modalGallery.appendChild(showFormButton);
    }

    showFormButton.addEventListener("click", function() {
        showPhotoForm();
    });
}

// Fonction pour supprimer une œuvre de la galerie
function deleteWorks(workId, modalImageContainer) {
    const token = sessionStorage.getItem('token');

    const workElement = document.querySelector(`.imageContainer[data-id='${workId}']`);
    if (workElement) {
        workElement.remove();
    }

    // Retirer l'élément de la galerie
    modalImageContainer.remove();

    // Requête API pour supprimer l'œuvre
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur de suppression');
        }
        return response.text();
    })
}

// Fonction pour créer et afficher le formulaire modal
function modalForm() {
    // Sélectionne le conteneur où le formulaire sera ajouté
    const formContainer = document.querySelector('.formContainer');

    // Crée un titre pour le formulaire
    const h2 = document.createElement('h2');
    h2.textContent = 'Ajout photo';
    formContainer.appendChild(h2);

    // Crée le conteneur principal du formulaire
    const modalFormContainer = document.createElement('div');
    modalFormContainer.classList.add('modalForm');
    formContainer.appendChild(modalFormContainer);

    // Crée un conteneur pour l'input de l'image
    const addImageInput = document.createElement('div');
    addImageInput.classList.add('addImageInput');
    modalFormContainer.appendChild(addImageInput);

    // Ajoute une icône pour l'input de l'image
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-image');
    addImageInput.appendChild(icon);

    // Crée l'élément input pour sélectionner une image
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.classList = 'image';
    imageInput.name = 'image';
    imageInput.accept = ".jpg, .jpeg, .png";
    imageInput.placeholder = 'Ajouter photo';
    imageInput.required = true;
    imageInput.style.display = 'none';
    addImageInput.appendChild(imageInput);

    // Crée un bouton personnalisé pour déclencher l'input d'image
    const customButton = document.createElement('button');
    customButton.textContent = 'Ajouter photo';
    customButton.classList.add('customAddPhotoButton');
    addImageInput.appendChild(customButton);

    // Lorsque le bouton est cliqué, on simule un clic sur l'input image
    customButton.addEventListener('click', function() {
        imageInput.click();
    });

    // Vérifie que la taille de l'image est inférieure à 4 Mo
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 4 * 1024 * 1024;
            if (file.size > maxSize) {
                alert("La taille de l'image ne doit pas dépasser 4 Mo.");
                event.target.value = '';
            }
        }
    });

    // Gère l'affichage de la prévisualisation de l'image
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {

                // Efface les anciennes prévisualisations
                previewContainer.innerHTML = '';

                // Crée l'image prévisualisée
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Image prévisualisée';
                previewContainer.appendChild(img);

                // Cache les éléments du formulaire une fois l'image sélectionnée
                const icon = addImageInput.querySelector('i');
                const input = addImageInput.querySelector('input');
                const infoText = addImageInput.querySelector('p');
                const customButton = addImageInput.querySelector('.customAddPhotoButton');

                if (icon) icon.style.display = 'none';
                if (input) input.style.display = 'none';
                if (infoText) infoText.style.display = 'none';
                if (customButton) customButton.style.display = 'none';

                const errorContainer = document.querySelector('.errorImageContainer');
                if (errorContainer) {
                    errorContainer.innerHTML = '';
                }
            };

            reader.readAsDataURL(file);
        }
    });

    // Conteneur de prévisualisation de l'image
    const previewContainer = document.createElement('div');
    previewContainer.classList = 'imagePreview';
    addImageInput.appendChild(previewContainer);

    // Conteneur d'erreur pour l'image
    const imageErrorContainer = document.createElement('div');
    imageErrorContainer.classList.add('errorImageContainer');
    addImageInput.insertAdjacentElement('afterend', imageErrorContainer);

    // Ajout du texte d'information sur le format de l'image
    const infoText = document.createElement('p');
    infoText.textContent = 'jpg, png : 4mo max';
    addImageInput.appendChild(infoText);

    // Ajoute un champ pour le titre
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Titre';
    titleLabel.classList ='modalLabel';
    modalFormContainer.appendChild(titleLabel);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.classList = 'modalTitle';
    titleInput.name = 'title';
    titleInput.required = true;
    titleInput.placeholder = 'Ajouter un titre';
    modalFormContainer.appendChild(titleInput);

    // Conteneur d'erreur pour le titre
    const titleErrorContainer = document.createElement('div');
    titleErrorContainer.classList.add('errorTitleContainer');
    titleInput.insertAdjacentElement('afterend', titleErrorContainer);

    // Écouteur pour effacer l'erreur lorsque l'utilisateur saisit un titre
    titleInput.addEventListener('input', function() {
        const errorContainer = document.querySelector('.errorTitleContainer');
        if (titleInput.value.trim()) {
            errorContainer.innerHTML = '';
        }
    });

    // Ajoute un champ pour sélectionner la catégorie
    const categoryLabel = document.createElement('label');
    categoryLabel.setAttribute('for', 'category');
    categoryLabel.textContent = 'Catégorie';
    categoryLabel.classList ='modalLabel';
    modalFormContainer.appendChild(categoryLabel);

    const categorySelect = document.createElement('select');
    categorySelect.classList = 'modalCategory';
    categorySelect.name = 'category';
    categorySelect.required = true;
    modalFormContainer.appendChild(categorySelect);

    // Conteneur d'erreur pour la catégorie
    const categoryErrorContainer = document.createElement('div');
    categoryErrorContainer.classList.add('errorCategoryContainer');
    categorySelect.insertAdjacentElement('afterend', categoryErrorContainer);

    // Écouteur pour effacer l'erreur lorsque l'utilisateur sélectionne une catégorie
    categorySelect.addEventListener('change', function() {
        const errorContainer = document.querySelector('.errorCategoryContainer');
        if (categorySelect.value) {
            errorContainer.innerHTML = '';
        }
    });

    // Récupère les catégories depuis l'API et les affiche dans le select
    categorySelect.innerHTML = '';
    fetch('http://localhost:5678/api/categories/')
        .then(response => response.json())
        .then(data => {

            // Crée une option par défaut
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner une catégorie';
            defaultOption.selected = true;
            defaultOption.disabled = true;
            categorySelect.appendChild(defaultOption);

            // Crée une option pour chaque catégorie
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })

    // Création et ajout du bouton de validation
    let addNewWorkButton = document.querySelector('.addNewWorkButton');
    if (!addNewWorkButton) {
        addNewWorkButton = document.createElement('button');
        addNewWorkButton.classList.add('addNewWorkButton');
        addNewWorkButton.innerHTML = 'Valider';
    }

    formContainer.appendChild(addNewWorkButton);

    // Ajoute l'événement pour valider le formulaire
    addNewWorkButton.addEventListener('click', function(event) {
        event.preventDefault();
        addNewWork();
    });
}

// Fonction pour ajouter un nouveau travail à la galerie
function addNewWork() {
    const imageInput = document.querySelector('.image');
    const titleInput = document.querySelector('.modalTitle');
    const categorySelect = document.querySelector('.modalCategory');

    // Supprime les messages d'erreur existants
    document.querySelectorAll('.errorMessage').forEach(error => error.remove());

    let formIsValid = true;

    // Validation de l'image
    if (!imageInput.files[0]) {
        formIsValid = false;
        const errorContainer = document.querySelector('.errorImageContainer');
        errorContainer.innerHTML = '<p class="errorMessage">Veuillez ajouter une image.</p>';
    }

    // Validation du titre
    if (!titleInput.value.trim()) {
        formIsValid = false;
        const errorContainer = document.querySelector('.errorTitleContainer');
        errorContainer.innerHTML = '<p class="errorMessage">Le titre est obligatoire.</p>';
    }

    // Validation de la catégorie
    if (!categorySelect.value) {
        formIsValid = false;
        const errorContainer = document.querySelector('.errorCategoryContainer');
        errorContainer.innerHTML = '<p class="errorMessage">Veuillez sélectionner une catégorie.</p>';
    }

    // Si le formulaire n'est pas valide, on arrête le traitement
    if (!formIsValid) {
        return;
    }

    // Ajoute les écouteurs d'événements uniquement la première fois
    if (!eventListenersAdded) {
        imageInput.addEventListener('change', function() {
            const errorContainer = document.querySelector('.errorImageContainer');
            if (imageInput.files[0]) {
                errorContainer.innerHTML = '';
            }
        });

        titleInput.addEventListener('input', function() {
            const errorContainer = document.querySelector('.errorTitleContainer');
            if (titleInput.value.trim()) {
                errorContainer.innerHTML = '';
            }
        });

        categorySelect.addEventListener('change', function() {
            const errorContainer = document.querySelector('.errorCategoryContainer');
            if (categorySelect.value) {
                errorContainer.innerHTML = '';
            }
        });

        eventListenersAdded = true;
    }

    // Vérifie si l'utilisateur est connecté
    const token = sessionStorage.getItem("token");
    if (!token) {
        alert("Vous devez être connecté pour ajouter un travail.");
        return;
    }

    // Envoie les données via un POST pour ajouter le travail
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categorySelect.value);

    fetch('http://localhost:5678/api/works/', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        const gallery = document.querySelector('.mainGallery');

        // Crée un conteneur pour la nouvelle image dans la galerie
        const newImageContainer = document.createElement('div');
        newImageContainer.classList.add('imageContainer');
        newImageContainer.setAttribute('data-id', data.id);
        const newImg = document.createElement('img');
        newImg.src = URL.createObjectURL(imageInput.files[0]);
        newImg.alt = data.title;
        const newTitle = document.createElement('p');
        newTitle.textContent = data.title;
        newImageContainer.appendChild(newImg);
        newImageContainer.appendChild(newTitle);
        gallery.appendChild(newImageContainer);

        // Ferme la modal après ajout
        document.querySelector('.modalOverlay').style.display = 'none';

        // Réinitialise le formulaire
        imageInput.value = '';
        titleInput.value = '';
        categorySelect.selectedIndex = 0;
        document.body.style.overflow = "";

        modalGallery();
        resetFormFields();
    });
}

// Réinitialise les champs du formulaire
function resetFormFields() {
    const imageInput = document.querySelector('.image');
    const titleInput = document.querySelector('.modalTitle');
    const categorySelect = document.querySelector('.modalCategory');
    
    if (imageInput) {
        imageInput.value = '';
        
        const previewContainer = document.querySelector('.imagePreview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
    }

    if (titleInput) {
        titleInput.value = '';
    }

    if (categorySelect) {
        categorySelect.selectedIndex = 0;
    }

    // Efface les messages d'erreur
    const errorMessages = document.querySelectorAll('.errorMessage');
    errorMessages.forEach((errorMessage) => {
        errorMessage.remove();
    });

    // Réaffiche les éléments du formulaire
    const addImageInput = document.querySelector('.addImageInput');
    if (addImageInput) {
        const icon = addImageInput.querySelector('i');
        const input = addImageInput.querySelector('input');
        const infoText = addImageInput.querySelector('p');
        const customButton = addImageInput.querySelector('.customAddPhotoButton');
        
        if (icon) icon.style.display = 'block'; 
        if (input) input.style.display = 'block';
        if (infoText) infoText.style.display = 'block';
        if (customButton) customButton.style.display = 'block';
    }
}