export { openModal, checkAuth, modalGallery, modalForm,};

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
}

function showPhotoForm() {
    const modalGallery = document.querySelector(".galleryContainer");
    const modalForm = document.querySelector(".formContainer");
    const backButton = document.querySelector(".backButton");

    if (modalGallery && modalForm) {
        modalGallery.style.display = "none";
        modalForm.style.display = "flex";
    }

    if (backButton) backButton.style.display = "block";

    backButton.addEventListener('click', function() {
        if (modalGallery && modalForm) {
            modalGallery.style.display = "flex";
            modalForm.style.display = "none";
        }

        if (backButton) backButton.style.display = "none";

        // Réinitialiser les champs du formulaire lorsque le backButton est cliqué
        resetFormFields();
    });
}

function modalGallery() {
    // Sélectionne le conteneur de la galerie dans la modale
    const modalGallery = document.querySelector(".galleryContainer");
    modalGallery.innerHTML = '';

    // Crée le titre h2
    const galleryTitle = document.createElement('h2');
    galleryTitle.textContent = "Galerie photo";
    modalGallery.appendChild(galleryTitle);

    // Crée un conteneur pour les images
    const galleryContainer = document.createElement('div');
    galleryContainer.className = "modalGallery";

    // Appel fetch pour récupérer les œuvres depuis l'API
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            data.forEach(work => {
                // Crée un conteneur pour chaque image
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';

                // Crée l'image et ajoute l'ID dans le data-id
                const img = document.createElement('img');
                img.src = work.imageUrl;
                img.alt = work.title;
                img.dataset.workId = work.id;

                // Ajoute l'image au conteneur
                imageContainer.appendChild(img);

                // Crée un bouton de suppression pour chaque image
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                imageContainer.appendChild(deleteButton);

                // Ajoute l'image au container principal
                galleryContainer.appendChild(imageContainer);

                // Gérer la suppression de l'image
                deleteButton.addEventListener('click', function() {
                    const workId = img.dataset.workId;
                    deleteWorks(workId, imageContainer);
                });
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des œuvres:', error);
        });

    // Ajoute le wrapper des images dans la modale
    modalGallery.appendChild(galleryContainer);

    // Créer le bouton "Ajouter une photo" dans la galerie
    let showFormButton = document.querySelector('.showFormButton');
    if (!showFormButton) {
        showFormButton = document.createElement('button');
        showFormButton.classList.add('showFormButton');
        showFormButton.innerHTML = 'Ajouter une photo';
    }

    // Ajouter le bouton "Ajouter une photo" dans la modalGallery
    if (!modalGallery.contains(showFormButton)) {
        modalGallery.appendChild(showFormButton);
    }

    // Ajouter un événement pour afficher le formulaire d'ajout de photo
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

    // Supprimer l'œuvre de l'API
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Work supprimé avec succès");

            // Retirer l'élément de la galerie modale
            imageContainer.remove(); 

            // Rafraîchir la galerie modale
            modalGallery(); // Rafraîchit la galerie de la modale

            // Rafraîchir la galerie principale
            const mainGallery = document.querySelector(".gallery");

            if (mainGallery) {
                mainGallery.innerHTML = '';  // Réinitialise la galerie principale

                // Re-fetch des œuvres et mise à jour de la galerie principale
                fetch('http://localhost:5678/api/works')
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(work => {
                            const imageContainer = document.createElement('div');
                            imageContainer.classList.add('image-container');
                            
                            // Créer et ajouter l'image
                            const img = document.createElement('img');
                            img.src = work.imageUrl;
                            img.alt = work.title;
                            imageContainer.appendChild(img);

                            // Créer et ajouter le titre ou autre contenu sous l'image
                            const p = document.createElement('p');
                            p.textContent = work.title;  // Assure-toi que `work.title` est bien ce que tu veux afficher
                            imageContainer.appendChild(p);

                            // Ajouter l'élément à la galerie principale
                            mainGallery.appendChild(imageContainer);
                        });
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des œuvres pour la galerie principale:', error);
                    });
            } else {
                console.error('Galerie principale non trouvée !');
            }
        } else {
            console.error("Erreur lors de la suppression du work");
            alert("Une erreur est survenue lors de la suppression du work.");
        }
    })
    .catch(error => {
        console.error("Erreur de requête :", error);
        alert("Une erreur est survenue lors de la suppression du work.");
    });
}


function modalForm() {
    // Obtenez la référence de la div "formContainer"
    const formContainer = document.querySelector('.formContainer');

    // Créer le titre h2
    const h2 = document.createElement('h2');
    h2.textContent = 'Ajout photo';
    formContainer.appendChild(h2);

    // Créer le conteneur du formulaire
    const modalFormContainer = document.createElement('div');
    modalFormContainer.classList.add('modalForm');
    formContainer.appendChild(modalFormContainer);

    // Créer la div pour l'ajout de l'image
    const addImageInput = document.createElement('div');
    addImageInput.classList.add('addImageInput');
    modalFormContainer.appendChild(addImageInput);

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
                const customButton = addImageInput.querySelector('.customAddPhotoButton'); // Sélectionner le bouton
    
                if (icon) icon.style.display = 'none';
                if (input) input.style.display = 'none';
                if (infoText) infoText.style.display = 'none';
                if (customButton) customButton.style.display = 'none'; // Cacher le bouton
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

    // Ajout du conteneur d'erreur pour l'image
    const imageErrorContainer = document.createElement('div');
    imageErrorContainer.classList.add('error-image-container');
    addImageInput.insertAdjacentElement('afterend', imageErrorContainer);

    // Ajouter le texte
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

    // Ajout du conteneur d'erreur pour le titre
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

    // Ajout du conteneur d'erreur pour la catégorie
    const categoryErrorContainer = document.createElement('div');
    categoryErrorContainer.classList.add('error-category-container');
    categorySelect.insertAdjacentElement('afterend', categoryErrorContainer);

    // Créer un bouton "Ajouter le work" dans la formContainer
    let addNewWorkButton = document.querySelector('.addNewWorkButton');
    if (!addNewWorkButton) {
        addNewWorkButton = document.createElement('button');
        addNewWorkButton.classList.add('addNewWorkButton');
        addNewWorkButton.innerHTML = 'Valider';
    }

    // Ajouter le bouton "Ajouter le work" dans la div formContainer
    formContainer.appendChild(addNewWorkButton);

    // Ajouter un événement au bouton pour soumettre le formulaire
    addNewWorkButton.addEventListener('click', function() {
        addNewWork(); // Appeler la fonction pour soumettre le formulaire
    });

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

function addNewWork() {
    // Récupérer les éléments
    const imageInput = document.querySelector('#image');
    const imageInputDiv = document.querySelector('.addImageInput');  // La div contenant le champ image
    const titleInput = document.querySelector('#title');
    const categorySelect = document.querySelector('#category');

    // Réinitialiser les messages d'erreur avant la validation
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((errorMessage) => {
        errorMessage.remove();  // Retirer tous les messages d'erreur existants
    });

    // Vérification des champs
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

    // Ajouter un event listener pour le champ "image" pour supprimer l'erreur quand l'image est sélectionnée
    imageInput.addEventListener('change', function() {
        const errorContainer = document.querySelector('.error-image-container');
        if (imageInput.files[0]) {
            errorContainer.innerHTML = '';  // Supprimer le message d'erreur si une image est choisie
        }
    });

    // Ajouter un event listener pour le champ "titre" pour supprimer l'erreur quand le titre est saisi
    titleInput.addEventListener('input', function() {
        const errorContainer = document.querySelector('.error-title-container');
        if (titleInput.value.trim()) {
            errorContainer.innerHTML = '';  // Supprimer le message d'erreur si le titre est saisi
        }
    });

    // Ajouter un event listener pour le champ "catégorie" pour supprimer l'erreur quand une catégorie est sélectionnée
    categorySelect.addEventListener('change', function() {
        const errorContainer = document.querySelector('.error-category-container');
        if (categorySelect.value) {
            errorContainer.innerHTML = '';  // Supprimer le message d'erreur si une catégorie est sélectionnée
        }
    });

    // Si les champs sont invalides, on ne soumet pas le formulaire
    if (!formIsValid) {
        return;
    }

    // Si tous les champs sont valides, on soumet le formulaire
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
        alert("Le work a été ajouté avec succès !");

        // Réinitialiser les champs
        resetFormFields();

        // Fermer la modale
        const modalOverlay = document.querySelector(".modalOverlay");
        modalOverlay.style.display = "none";
        document.body.classList.remove("no-scroll");

        // Rediriger vers la page principale
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error("Erreur lors de l'ajout du work:", error);
        alert("Une erreur est survenue lors de l'ajout du work.");
    });
}

function resetFormFields() {
    const imageInput = document.querySelector('#image');
    const titleInput = document.querySelector('#title');
    const categorySelect = document.querySelector('#category');
    
    // Réinitialiser les champs du formulaire
    imageInput.value = '';  // Réinitialiser le champ image
    titleInput.value = '';  // Réinitialiser le champ titre
    categorySelect.selectedIndex = -1;  // Réinitialiser la sélection de catégorie

    // Réinitialiser les messages d'erreur
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((errorMessage) => {
        errorMessage.remove();  // Retirer les messages d'erreur existants
    });

    // Réinitialiser la prévisualisation de l'image
    const previewContainer = document.querySelector('#imagePreview');
    if (previewContainer) {
        previewContainer.innerHTML = '';  // Vider la prévisualisation
    }

    // Réafficher les éléments masqués dans .addImageInput
    const icon = document.querySelector('.addImageInput i');
    const input = document.querySelector('.addImageInput input');
    const infoText = document.querySelector('.addImageInput p');
    const customButton = document.querySelector('.addImageInput .customAddPhotoButton');
    
    if (icon) icon.style.display = 'block';
    if (input) input.style.display = 'block';
    if (infoText) infoText.style.display = 'block';
    if (customButton) customButton.style.display = 'block';

    // Appliquer display: none; sur input[type="file"] pour masquer le champ
    if (imageInput) {
        imageInput.style.display = 'none'; // Cacher le champ de fichier
    }

   // Réinitialiser le champ de catégorie pour qu'il affiche "Sélectionner une catégorie"
   if (categorySelect) {
       categorySelect.selectedIndex = 0; // Remet l'option "Sélectionner une catégorie" comme sélectionnée
   }
}