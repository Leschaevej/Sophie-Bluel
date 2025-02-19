import { showLoginOverlay, loginForm, userLogin, logOut } from "./auth.js"; 
import { openModal, checkAuth, modalGallery, modalForm, } from "./modal.js";

let worksData =[];

// Fonction asynchrone pour générer les travaux à partir de l'API
async function generateWorks() {
    // Récupération des travaux depuis l'API
    const response = await fetch("http://localhost:5678/api/works/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Transformation des pièces en JSON
    worksData = await response.json();

    // Récupération de l'élément du DOM qui accueillera les travaux
    const sectionGallery = document.querySelector(".mainGallery");
    sectionGallery.innerHTML = '';

    // Boucle sur les travaux récupérés pour les afficher dans la galerie
    worksData.forEach(article => {

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("imageContainer");
        imageContainer.setAttribute("data-id", article.id);

        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        imageElement.alt = article.title;
        const nomElement = document.createElement("p");
        nomElement.innerText = article.title;

        imageContainer.appendChild(imageElement);
        imageContainer.appendChild(nomElement);
        sectionGallery.appendChild(imageContainer);        
    });
    modalGallery();
}

// Fonction pour générer les filtres
function generateFilter() {

    const sectionFilter = document.querySelector(".filter");

    // Création du bouton "Tous" pour afficher toutes les œuvres
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.addEventListener("click", function () {
        generateWorks();
        setActiveButton(allButton);
    });
    allButton.classList.add("active");

    // Création du bouton "Objets" pour filtrer les œuvres par catégorie "Objets"
    const objectButton = document.createElement("button");
    objectButton.innerText = "Objets";
    objectButton.addEventListener("click", function () {
        const filteredWorks = worksData.filter(works => works.category.name === "Objets");
        updateGallery(filteredWorks);
        setActiveButton(objectButton);
    });

    // Création du bouton "Appartements" pour filtrer les œuvres par catégorie "Appartements"
    const apartmentButton = document.createElement("button");
    apartmentButton.innerText = "Appartements";
    apartmentButton.addEventListener("click", function () {
        const filteredWorks = worksData.filter(works => works.category.name === "Appartements");
        updateGallery(filteredWorks);
        setActiveButton(apartmentButton);
    });

    // Création du bouton "Hotels & Restaurant" pour filtrer les œuvres par catégorie "Hotels & restaurants"
    const hotelAndRestaurantButton = document.createElement("button");
    hotelAndRestaurantButton.innerText = "Hotels & Restaurant";
    hotelAndRestaurantButton.addEventListener("click", function () {
        const filteredWorks = worksData.filter(works => works.category.name === "Hotels & restaurants");
        updateGallery(filteredWorks);
        setActiveButton(hotelAndRestaurantButton);
    });

    // Ajout des boutons créés dans la section des filtres
    sectionFilter.appendChild(allButton);
    sectionFilter.appendChild(objectButton);
    sectionFilter.appendChild(apartmentButton);
    sectionFilter.appendChild(hotelAndRestaurantButton);
}

// Fonction pour mettre à jour la galerie avec les œuvres filtrées
function updateGallery(filteredWorks) {
    const galleryContainer = document.querySelector('.mainGallery');
    galleryContainer.innerHTML = '';

    // Boucle pour afficher les œuvres filtrées dans la galerie
    filteredWorks.forEach(work => {
        const imageElement = document.createElement('div');
        imageElement.classList.add('image');
        imageElement.dataset.id = work.id;
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        imageElement.appendChild(img);
        galleryContainer.appendChild(imageElement);
    });
}

// Fonction pour gerer le bouton actif
function setActiveButton(selectedButton) {

    const buttons = document.querySelectorAll(".filter button");

    // Retirer la classe active de tous les boutons
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    // Ajouter la classe active au bouton sélectionné
    selectedButton.classList.add("active");
}


// Fonction pour créer le formulaire de contact
function contactForm() {
    const contactSection = document.querySelector('.contact');

    // Création des éléments du formulaire de contact
    const h2 = document.createElement('h2');
    h2.textContent = 'Contact';
    contactSection.appendChild(h2);
    const p = document.createElement('p');
    p.textContent = 'Vous avez un projet ? Discutons-en !';
    contactSection.appendChild(p);
    const form = document.createElement('form');
    form.action = '#';
    form.method = 'post';
    form.classList = 'contactForm';
    form.setAttribute('novalidate', 'true');

    // Création du champ nom
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name');
    nameLabel.textContent = 'Nom';
    nameLabel.classList = 'contactLabel';
    form.appendChild(nameLabel);
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.classList = 'contactName';
    nameInput.required = true;
    form.appendChild(nameInput);
    const nameErrorDiv = document.createElement('div');
    nameErrorDiv.classList = 'contactError';
    form.appendChild(nameErrorDiv);

    // Création du champ email
    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'email');
    emailLabel.textContent = 'Email';
    emailLabel.classList = 'contactLabel';
    form.appendChild(emailLabel);
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.classList = 'contactEmail';
    emailInput.required = true;
    form.appendChild(emailInput);
    const emailErrorDiv = document.createElement('div');
    emailErrorDiv.classList = 'contactError';
    form.appendChild(emailErrorDiv);

    // Création du champ message
    const messageLabel = document.createElement('label');
    messageLabel.setAttribute('for', 'message');
    messageLabel.textContent = 'Message';
    messageLabel.classList = 'contactLabel';
    form.appendChild(messageLabel);
    const messageTextArea = document.createElement('textarea');
    messageTextArea.name = 'message';
    messageTextArea.classList = 'contactMessage';
    messageTextArea.cols = 30;
    messageTextArea.rows = 10;
    messageTextArea.required = true;
    form.appendChild(messageTextArea);
    const messageErrorDiv = document.createElement('div');
    messageErrorDiv.classList = 'contactError';
    form.appendChild(messageErrorDiv);

     // Création du bouton
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Envoyer';
    submitButton.classList.add('contactButton');
    form.appendChild(submitButton);

    contactSection.appendChild(form);

    // Validation en temps réel pour le champ "Nom"
    nameInput.addEventListener('input', function() {
        const name = nameInput.value.trim();
        const namePattern = /^[a-zA-ZÀ-ÿ\s-]+$/;
        if (!name) {
            nameErrorDiv.textContent = 'Veuillez renseigner votre nom.';
        } else if (!namePattern.test(name)) {
            nameErrorDiv.textContent = 'Veuillez entrer un nom valide (lettres, accents, espaces et tirets seulement).';
        } else {
            nameErrorDiv.textContent = '';
        }
    });

    // Validation en temps réel pour le champ "Email"
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            emailErrorDiv.textContent = 'Veuillez renseigner votre email.';
        } else if (!emailPattern.test(email)) {
            emailErrorDiv.textContent = 'Veuillez entrer un email valide.';
        } else {
            emailErrorDiv.textContent = '';
        }
    });

    // Validation en temps réel pour le champ "Message"
    messageTextArea.addEventListener('input', function() {
        const message = messageTextArea.value.trim();
        if (!message) {
            messageErrorDiv.textContent = 'Le champ message est obligatoire.';
        } else if (message.length < 50) {
            messageErrorDiv.textContent = 'Le message doit comporter au moins 50 caractères.';
        } else {
            messageErrorDiv.textContent = '';
        }
    });

    // Vérification avant l'envoi du formulaire
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Valider les champs avant d'envoyer
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageTextArea.value.trim();
        let isValid = true;

        // Vérification des erreurs pour "Nom"
        if (!name || nameErrorDiv.textContent !== '') {
            isValid = false;
            nameErrorDiv.textContent = nameErrorDiv.textContent || 'Veuillez renseigner votre nom.';
        }

        // Vérification des erreurs pour "Email"
        if (!email || emailErrorDiv.textContent !== '') {
            isValid = false;
            emailErrorDiv.textContent = emailErrorDiv.textContent || 'Veuillez renseigner votre email.';
        }

        // Vérification des erreurs pour "Message"
        if (!message || message.length < 50 || messageErrorDiv.textContent !== '') {
            isValid = false;
            messageErrorDiv.textContent = messageErrorDiv.textContent || 'Le message doit comporter au moins 50 caractères.';
        }

        // Si tout est valide, ouvrir le client mail
        if (isValid) {
            const subject = encodeURIComponent("Nouveau message depuis le formulaire de contact");
            const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`);
            window.location.href = `mailto:leschaeve.jimmy@gmail.com?subject=${subject}&body=${body}`;
        }
    });

}

modalForm();
loginForm();
contactForm();
checkAuth();
openModal();
logOut();
userLogin();
showLoginOverlay();
generateFilter();
generateWorks();