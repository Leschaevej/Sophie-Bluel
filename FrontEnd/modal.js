export { openModal, checkAuth, modalGallery, modalForm,};

// Fonction de vérification de l'authentification
function checkAuth() {
    const token = localStorage.getItem("token");
    const openModalLink = document.getElementById("openModalLink");

    // Vérifie si le token existe, si oui, l'utilisateur est connecté
    if (token) {
        openModalLink.style.display = "inline";
    } else {
        openModalLink.style.display = "none";
    }
};

// Fonction pour gérer l'ouverture et la fermeture de la modale
function openModal() {
    const openModalLink = document.querySelector("#openModalLink");
    const modalOverlay = document.querySelector(".modalOverlay");
    const modalContent = document.querySelector(".modalContent");

    // Créer un conteneur pour les boutons de retour et de fermeture
    const backAndClose = document.createElement('div');
    backAndClose.classList.add('backAndClose');

    // Créer le bouton de retour
    const backButton = document.createElement('button');
    backButton.classList.add('backButton');
    backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    backAndClose.appendChild(backButton);

    // Créer le bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.classList.add('closeButton');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    backAndClose.appendChild(closeButton);

    // Insère les boutons dans le contenu de la modale
    modalContent.insertBefore(backAndClose, modalContent.firstChild);

    // Écouteur d'événement pour ouvrir la modale
    openModalLink.addEventListener("click", function(event) {
        event.preventDefault();
        modalOverlay.style.display = "flex";
        document.body.classList.add("no-scroll");

        // Affiche la galerie et cache le formulaire par défaut
        const modalGallery = document.querySelector(".galleryContainer");
        const modalForm = document.querySelector(".formContainer");

        if (modalGallery) {
            modalGallery.style.display = "flex";
        }

        if (modalForm) {
            modalForm.style.display = "none";
        }

        // Cache le bouton de retour et affiche le bouton de fermeture
        backButton.style.display = "none";
        closeButton.style.display = "block";

        // Cache l'input image
        const imageInput = document.querySelector('#image');
        if (imageInput) {
            imageInput.style.display = 'none';
        }
    });

    // Écouteur d'événement pour fermer la modale
    closeButton.addEventListener("click", function() {
        modalOverlay.style.display = "none";
        document.body.classList.remove("no-scroll");
        resetFormFields();
    });

    // Fermeture de la modale lorsque l'utilisateur clique sur l'overlay
    modalOverlay.addEventListener("click", function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = "none";
            document.body.classList.remove("no-scroll");
            resetFormFields();
        }
    });
}

// Fonction pour afficher le formulaire d'ajout de photo
function showPhotoForm() {
    const modalGallery = document.querySelector(".galleryContainer");
    const modalForm = document.querySelector(".formContainer");
    const backButton = document.querySelector(".backButton");
    const imageInput = document.querySelector('#image');

    // Masque la galerie et affiche le formulaire
    if (modalGallery && modalForm) {
        modalGallery.style.display = "none";
        modalForm.style.display = "flex";
    }

    // Cache l'input image
    if (imageInput) {
        imageInput.style.display = 'none';
    }

    // Affiche le bouton de retour
    if (backButton) {
        backButton.style.display = "block";
    }

    // Ajoute un écouteur d'événement pour gérer le clic sur le bouton de retour
    backButton.addEventListener('click', function() {
        if (modalGallery && modalForm) {
            modalGallery.style.display = "flex";
            modalForm.style.display = "none"; 
        }

        if (backButton) backButton.style.display = "none";

        resetFormFields();
    });
}

// Fonction pour afficher la galerie dans la modale
function modalGallery() {
    // Sélectionne le conteneur de la galerie dans la modale et réinitialise son contenu
    const modalGallery = document.querySelector(".galleryContainer");
    modalGallery.innerHTML = '';

    // Crée et ajoute un titre h2 pour la galerie
    const galleryTitle = document.createElement('h2');
    galleryTitle.textContent = "Galerie photo";
    modalGallery.appendChild(galleryTitle);

    // Crée un conteneur div pour les images de la galerie
    const galleryContainer = document.createElement('div');
    galleryContainer.className = "modalGallery";

    // Appel fetch pour récupérer les œuvres depuis l'API
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            // Parcourt chaque œuvre récupérée
            data.forEach(work => {
                // Crée un conteneur div pour chaque image
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';

                // Crée l'élément image et ajoute l'URL et le titre de l'œuvre
                const img = document.createElement('img');
                img.src = work.imageUrl;
                img.alt = work.title;
                img.dataset.workId = work.id;

                // Ajoute l'image au conteneur de l'image
                imageContainer.appendChild(img);

                // Crée un bouton de suppression pour chaque image
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                imageContainer.appendChild(deleteButton);

                // Ajoute le conteneur de l'image à la galerie
                galleryContainer.appendChild(imageContainer);

                // Ajoute un événement pour supprimer l'œuvre lorsqu'on clique sur le bouton de suppression
                deleteButton.addEventListener('click', function() {
                    const workId = img.dataset.workId;
                    deleteWorks(workId, imageContainer);
                });
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des œuvres:', error);
        });

    // Ajoute le conteneur des images dans la modale
    modalGallery.appendChild(galleryContainer);

    // Crée un bouton "Ajouter une photo" si ce n'est pas déjà fait
    let showFormButton = document.querySelector('.showFormButton');
    if (!showFormButton) {
        showFormButton = document.createElement('button');
        showFormButton.classList.add('showFormButton');
        showFormButton.innerHTML = 'Ajouter une photo';
    }

    // Ajoute le bouton "Ajouter une photo" dans la galerie
    if (!modalGallery.contains(showFormButton)) {
        modalGallery.appendChild(showFormButton);
    }

    // Ajoute un événement pour afficher le formulaire d'ajout de photo lorsque l'on clique sur le bouton
    showFormButton.addEventListener("click", function() {
        showPhotoForm();
    });
}

function deleteWorks(workId, imageContainer) {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error("Token manquant !");
        alert("Vous devez être connecté pour effectuer cette action.");
        return;
    }

    // Créer la div de confirmation
    const confirmationDiv = document.createElement('div');
    confirmationDiv.classList.add('confirmation-overlay');

    // Créer la div de contenu de la confirmation
    const confirmationContent = document.createElement('div');
    confirmationContent.classList.add('confirmation-content');

    // Créer le message de confirmation
    const confirmationMessage = document.createElement('p');
    confirmationMessage.textContent = "Supprimer la photo ?";
    confirmationContent.appendChild(confirmationMessage);

    // Créer un conteneur pour les boutons de confirmation
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    
    // Créer le bouton de confirmation
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Oui';
    confirmButton.classList.add('confirm-button');
    buttonContainer.appendChild(confirmButton);

    // Créer le bouton d'annulation
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Non';
    cancelButton.classList.add('cancel-button');
    buttonContainer.appendChild(cancelButton);

    confirmationContent.appendChild(buttonContainer);
    confirmationDiv.appendChild(confirmationContent);

    // Ajouter la div de confirmation au body
    const modalOverlay = document.querySelector(".modalOverlay");
    modalOverlay.appendChild(confirmationDiv);  // Ajouter par-dessus la galerie modale

    // Gérer l'annulation de la suppression
    cancelButton.addEventListener('click', () => {
        confirmationDiv.remove();  // Retirer la div de confirmation
    });

    // Gérer la confirmation de la suppression
    confirmButton.addEventListener('click', () => {
        // Supprimer l'œuvre de l'API via une requête DELETE
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("Work supprimé avec succès");

                // Remplacer le contenu de la confirmation par une icône de poubelle
                const trashIcon = document.createElement('i');
                trashIcon.classList.add('fa', 'fa-trash', 'trash-icon');
                confirmationContent.innerHTML = '';  // Effacer le contenu actuel
                confirmationContent.appendChild(trashIcon);  // Ajouter l'icône de la poubelle

                // Supprimer l'image de la galerie
                imageContainer.remove();

                // Réactualiser la galerie modale
                modalGallery();

                // Optionnel: Vous pouvez supprimer la div de confirmation après un court délai
                setTimeout(() => {
                    confirmationDiv.remove();  // Retirer la div de confirmation
                }, 1000);

            } else {
                console.error("Erreur lors de la suppression du work");
                alert("Une erreur est survenue lors de la suppression du work.");
            }
        })
        .catch(error => {
            console.error("Erreur de requête :", error);
            alert("Une erreur est survenue lors de la suppression du work.");
        });
    });
}

function modalForm() {
    // Obtenez la référence de la div "formContainer" qui contient le formulaire modal
    const formContainer = document.querySelector('.formContainer');

    // Créer le titre h2 pour le formulaire d'ajout photo
    const h2 = document.createElement('h2');
    h2.textContent = 'Ajout photo';
    formContainer.appendChild(h2);

    // Créer un conteneur principal pour le formulaire
    const modalFormContainer = document.createElement('div');
    modalFormContainer.classList.add('modalForm');
    formContainer.appendChild(modalFormContainer);

    // Créer la div pour l'ajout de l'image (avec icône et champ fichier)
    const addImageInput = document.createElement('div');
    addImageInput.classList.add('addImageInput');
    modalFormContainer.appendChild(addImageInput);

    // Ajouter l'icône de l'image
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-image');
    addImageInput.appendChild(icon);

    // Créer et ajouter le champ d'entrée pour sélectionner l'image
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.id = 'image';
    imageInput.name = 'image';
    imageInput.accept = ".jpg, .jpeg, .png";
    imageInput.placeholder = 'Ajouter photo';
    imageInput.required = true;
    imageInput.style.display = 'none';
    addImageInput.appendChild(imageInput);

    // Créer un bouton personnalisé pour déclencher la sélection de l'image
    const customButton = document.createElement('button');
    customButton.textContent = 'Ajouter photo';
    customButton.classList.add('customAddPhotoButton');
    addImageInput.appendChild(customButton);

    // Ajouter un événement au bouton pour déclencher le clic sur l'input file
    customButton.addEventListener('click', function() {
        imageInput.click();
    });

    // Vérifier la taille de l'image sélectionnée (max 4 Mo)
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

    // Ajouter un événement pour afficher la prévisualisation de l'image sélectionnée
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log('Image chargée :', e.target.result);

                // Vider le conteneur de prévisualisation avant d'ajouter la nouvelle image
                previewContainer.innerHTML = '';

                // Créer une image pour afficher la prévisualisation
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Image prévisualisée';

                // Ajouter l'image au conteneur de prévisualisation
                previewContainer.appendChild(img);

                // Cacher l'icône, l'input et le bouton après sélection de l'image
                const icon = addImageInput.querySelector('i');
                const input = addImageInput.querySelector('input');
                const infoText = addImageInput.querySelector('p');
                const customButton = addImageInput.querySelector('.customAddPhotoButton');

                if (icon) icon.style.display = 'none';
                if (input) input.style.display = 'none';
                if (infoText) infoText.style.display = 'none';
                if (customButton) customButton.style.display = 'none';
            };

            // Lire le fichier sélectionné
            reader.readAsDataURL(file);
        }
    });

    // Ajouter un conteneur pour afficher la prévisualisation de l'image
    const previewContainer = document.createElement('div');
    previewContainer.id = 'imagePreview';
    addImageInput.appendChild(previewContainer);

    // Ajouter un conteneur pour afficher des erreurs sur l'image
    const imageErrorContainer = document.createElement('div');
    imageErrorContainer.classList.add('error-image-container');
    addImageInput.insertAdjacentElement('afterend', imageErrorContainer);

    // Ajouter le texte d'info sous le champ de l'image (types et taille max)
    const infoText = document.createElement('p');
    infoText.textContent = 'jpg, png : 4mo max';
    addImageInput.appendChild(infoText);

    // Créer et ajouter le champ "Titre"
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Titre';
    modalFormContainer.appendChild(titleLabel);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'title';
    titleInput.name = 'title';
    titleInput.required = true;
    titleInput.placeholder = 'Ajouter un titre';
    modalFormContainer.appendChild(titleInput);

    // Ajouter un conteneur d'erreur pour le champ titre
    const titleErrorContainer = document.createElement('div');
    titleErrorContainer.classList.add('error-title-container');
    titleInput.insertAdjacentElement('afterend', titleErrorContainer);

    // Créer et ajouter le champ "Catégorie"
    const categoryLabel = document.createElement('label');
    categoryLabel.setAttribute('for', 'category');
    categoryLabel.textContent = 'Catégorie';
    modalFormContainer.appendChild(categoryLabel);

    const categorySelect = document.createElement('select');
    categorySelect.id = 'category';
    categorySelect.name = 'category';
    categorySelect.required = true;
    modalFormContainer.appendChild(categorySelect);

    // Ajouter un conteneur d'erreur pour le champ catégorie
    const categoryErrorContainer = document.createElement('div');
    categoryErrorContainer.classList.add('error-category-container');
    categorySelect.insertAdjacentElement('afterend', categoryErrorContainer);

    // Créer un bouton "Valider" pour soumettre le formulaire
    let addNewWorkButton = document.querySelector('.addNewWorkButton');
    if (!addNewWorkButton) {
        addNewWorkButton = document.createElement('button');
        addNewWorkButton.classList.add('addNewWorkButton');
        addNewWorkButton.innerHTML = 'Valider';
    }

    // Ajouter le bouton "Valider" au formulaire
    formContainer.appendChild(addNewWorkButton);

    // Ajouter un événement au bouton pour soumettre le formulaire
    addNewWorkButton.addEventListener('click', function() {
        addNewWork();
    });

    // Charger les catégories depuis l'API pour le champ catégorie
    document.addEventListener('DOMContentLoaded', () => {
        const categorySelect = document.getElementById('category');
        categorySelect.selectedIndex = -1;

        fetch('http://localhost:5678/api/categories/')
            .then(response => response.json())
            .then(data => {
                console.log('Catégories chargées depuis l\'API:', data);

                // Ajouter une option par défaut pour la catégorie
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Sélectionner une catégorie';
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

function addNewWork() {
    // Récupérer les éléments du formulaire
    const imageInput = document.querySelector('#image');
    const titleInput = document.querySelector('#title');
    const categorySelect = document.querySelector('#category');

    // Réinitialiser les messages d'erreur
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((errorMessage) => {
        errorMessage.remove();
    });

    // Vérification de la validité des champs
    let formIsValid = true;

    // Vérification du champ image
    if (!imageInput.files[0]) {
        formIsValid = false;
        const errorContainer = document.querySelector('.error-image-container');
        errorContainer.innerHTML = '';
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'Veuillez ajouter une image.';
        errorContainer.appendChild(errorMessage);
    }

    // Vérification du champ titre
    if (!titleInput.value.trim()) {
        formIsValid = false;
        const errorContainer = document.querySelector('.error-title-container');
        errorContainer.innerHTML = '';
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'Le titre est obligatoire.';
        errorContainer.appendChild(errorMessage);
    }

    // Vérification du champ catégorie
    if (!categorySelect.value) {
        formIsValid = false;
        const errorContainer = document.querySelector('.error-category-container');
        errorContainer.innerHTML = '';
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'Veuillez sélectionner une catégorie.';
        errorContainer.appendChild(errorMessage);
    }

    // Suppression des erreurs lorsque l'utilisateur modifie un champ
    imageInput.addEventListener('change', function() {
        const errorContainer = document.querySelector('.error-image-container');
        if (imageInput.files[0]) {
            errorContainer.innerHTML = '';
        }
    });

    titleInput.addEventListener('input', function() {
        const errorContainer = document.querySelector('.error-title-container');
        if (titleInput.value.trim()) {
            errorContainer.innerHTML = '';
        }
    });

    categorySelect.addEventListener('change', function() {
        const errorContainer = document.querySelector('.error-category-container');
        if (categorySelect.value) {
            errorContainer.innerHTML = '';
        }
    });

    // Si des erreurs sont présentes, on empêche la soumission du formulaire
    if (!formIsValid) {
        return;
    }

    // Si tous les champs sont valides, on soumet les données
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categorySelect.value);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("Données envoyées avec succès:", data);
    
        // Remplacer la modalContent par l'icône de validation animée
        const modalContent = document.querySelector('.modalContent');
        const successIcon = document.createElement('i');
        successIcon.classList.add('fa', 'fa-check-circle', 'success-icon', 'animate-check');
        modalContent.innerHTML = '';
        modalContent.appendChild(successIcon);
    
        // Afficher l'icône pendant 2 secondes, puis rediriger
        setTimeout(() => {
            // Réinitialiser le formulaire et fermer la modale
            resetFormFields();
            const modalOverlay = document.querySelector(".modalOverlay");
            modalOverlay.style.display = "none";
            document.body.classList.remove("no-scroll");
    
            // Rediriger vers la page principale
            window.location.href = "index.html";
        }, 1000);
    })    
    .catch(error => {
        console.error("Erreur lors de l'ajout du work:", error);
        alert("Une erreur est survenue lors de l'ajout du work.");
    });
}

function resetFormFields() {
    // Récupérer les éléments du formulaire
    const imageInput = document.querySelector('#image');
    const titleInput = document.querySelector('#title');
    const categorySelect = document.querySelector('#category');
    
    // Vérification de l'existence des éléments avant de les manipuler
    if (imageInput) {
        imageInput.value = '';
        imageInput.style.display = 'none';
    }

    if (titleInput) {
        titleInput.value = ''; // Réinitialise le champ titre
    }

    if (categorySelect) {
        // Réinitialise la sélection de la catégorie
        categorySelect.selectedIndex = 0;
    }

    // Supprimer tous les messages d'erreur affichés
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((errorMessage) => {
        errorMessage.remove();
    });

    // Réinitialiser la prévisualisation de l'image (si présente)
    const previewContainer = document.querySelector('#imagePreview');
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }

    // Réafficher les éléments masqués dans le conteneur d'image
    const addImageInput = document.querySelector('.addImageInput');
    if (addImageInput) {
        const icon = addImageInput.querySelector('i');
        const input = addImageInput.querySelector('input');
        const infoText = addImageInput.querySelector('p');
        const customButton = addImageInput.querySelector('.customAddPhotoButton');
        
        // Réafficher ces éléments (en cas de masquage lors de la sélection de l'image)
        if (icon) icon.style.display = 'block'; 
        if (input) input.style.display = 'block';
        if (infoText) infoText.style.display = 'block';
        if (customButton) customButton.style.display = 'block';
    }
}