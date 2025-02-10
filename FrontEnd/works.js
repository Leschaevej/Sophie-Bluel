import { showLoginOverlay, loginForm, userLogin, logOut } from "./auth.js"; 
import { openModal, checkAuth, modalGallery, modalForm, addNewWork } from "./modal.js"; 

let worksData =[];
// works.js

document.addEventListener('DOMContentLoaded', function () {
    // Code qui s'exécute après le chargement du DOM.
});

// Autres fonctions et logique du script


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

    // Extraction des catégories uniques des travaux
    const categories = worksData.map(works => works.category);
    const uniqueCategories = [...new Set(categories)];
    console.log(uniqueCategories);

    // Récupération de l'élément du DOM qui accueillera les travaux
    const sectionGallery = document.querySelector(".gallery");
    const modal = document.querySelector(".modalGallery");

    // Vider la galerie et la modal avant de les remplir
    sectionGallery.innerHTML = '';

    // Boucle sur les travaux récupérées pour les afficher dans la galerie
    worksData.forEach(article => {
        // Création d’une balise dédiée pour l'article
        const worksElement = document.createElement("article");
        worksElement.dataset.id = article.id;

        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        imageElement.alt = article.title;
        const nomElement = document.createElement("p");
        nomElement.innerText = article.title;

        // Ajout des éléments créés dans l'élément article
        worksElement.appendChild(imageElement);
        worksElement.appendChild(nomElement);

        // Ajout de l'élément article à la galerie
        sectionGallery.appendChild(worksElement);        
    });
    modalGallery();
}

// Fonction pour générer les filtres
function generateFilter() {

    // Récupération de l'élément DOM qui contient les filtres
    const sectionFilter = document.querySelector(".filter");

    // Création du bouton "Tous" pour afficher toutes les œuvres
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.addEventListener("click", function () {
        console.log('Affichage de toutes les œuvres');
        generateWorks();
        setActiveButton(allButton);
    });

    // Ajouter le bouton "Tous" comme actif par défaut
    allButton.classList.add("active");

    // Création du bouton "Objets" pour filtrer les œuvres par catégorie "Objets"
    const objectButton = document.createElement("button");
    objectButton.innerText = "Objets";
    objectButton.addEventListener("click", function () {
        console.log('Filtre: Objets');
        const filteredWorks = worksData.filter(works => works.category.name === "Objets");
        updateGallery(filteredWorks);
        setActiveButton(objectButton);
    });

    // Création du bouton "Appartements" pour filtrer les œuvres par catégorie "Appartements"
    const apartmentButton = document.createElement("button");
    apartmentButton.innerText = "Appartements";
    apartmentButton.addEventListener("click", function () {
        console.log('Filtre: Appartements');
        const filteredWorks = worksData.filter(works => works.category.name === "Appartements");
        updateGallery(filteredWorks);
        setActiveButton(apartmentButton);
    });

    // Création du bouton "Hotels & Restaurant" pour filtrer les œuvres par catégorie "Hotels & restaurants"
    const hotelAndRestaurantButton = document.createElement("button");
    hotelAndRestaurantButton.innerText = "Hotels & Restaurant";
    hotelAndRestaurantButton.addEventListener("click", function () {
        console.log('Filtre: Hotels & restaurants');
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

// Fonction pour mettre à jour la galerie avec les travaux filtrées
function updateGallery(filteredWorks) {

    // Récupération de l'élément du DOM qui accueillera les travaux
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';

    // Boucle sur les œuvres filtrées pour les afficher
    filteredWorks.forEach(article => {
        
        // Création d’une balise dédiée
        const worksElement = document.createElement("article");
        worksElement.dataset.id = article.id;

        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        imageElement.alt = article.title;
        const nomElement = document.createElement("p");
        nomElement.innerText = article.title;

        // Ajout des éléments créés dans l'élément article
        worksElement.appendChild(imageElement);
        worksElement.appendChild(nomElement);

        // Ajout de l'élément article à la galerie
        sectionGallery.appendChild(worksElement);
    });
}

function setActiveButton(selectedButton) {

    // Sélectionner tous les boutons
    const buttons = document.querySelectorAll(".filter button");

    // Retirer la classe active de tous les boutons
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    // Ajouter la classe active au bouton sélectionné
    selectedButton.classList.add("active");
    console.log(`${selectedButton.innerText} est actif`);
}

function contactForm() {
    
    // Obtenez la section avec l'id "contact"
    const contactSection = document.getElementById('contact');

    // Créer le titre h2
    const h2 = document.createElement('h2');
    h2.textContent = 'Contact';
    contactSection.appendChild(h2);

    // Ajouter un paragraphe de description
    const p = document.createElement('p');
    p.textContent = 'Vous avez un projet ? Discutons-en !';
    contactSection.appendChild(p);

    // Créer le formulaire
    const form = document.createElement('form');
    form.action = '#';
    form.method = 'post';

    // Créer et ajouter le champ "Nom"
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name');
    nameLabel.textContent = 'Nom';
    form.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.id = 'name';
    form.appendChild(nameInput);

    // Créer et ajouter le champ "Email"
    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'email');
    emailLabel.textContent = 'Email';
    form.appendChild(emailLabel);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.id = 'email';
    form.appendChild(emailInput);

    // Créer et ajouter le champ "Message"
    const messageLabel = document.createElement('label');
    messageLabel.setAttribute('for', 'message');
    messageLabel.textContent = 'Message';
    form.appendChild(messageLabel);

    const messageTextArea = document.createElement('textarea');
    messageTextArea.name = 'message';
    messageTextArea.id = 'message';
    messageTextArea.cols = 30;
    messageTextArea.rows = 10;
    form.appendChild(messageTextArea);

    // Créer et ajouter le bouton d'envoi (bouton de type "button")
    const submitButton = document.createElement('button');
    submitButton.type = 'button'; // Spécifie que c'est un bouton, pas un bouton de soumission
    submitButton.textContent = 'Envoyer'; // Texte du bouton

    // Ajouter la classe contactButton au bouton
    submitButton.classList.add('contactButton');

    // Ajouter un événement de clic pour envoyer le formulaire
    submitButton.addEventListener('click', function() {
        // Ici, tu peux ajouter une fonction pour gérer l'envoi du formulaire
        // Exemple : envoyer le formulaire via une requête AJAX ou valider les champs avant l'envoi
        if (form.checkValidity()) {
            // Si le formulaire est valide, tu peux l'envoyer par exemple avec fetch
            alert('Formulaire envoyé !');
        } else {
            alert('Veuillez remplir tous les champs correctement.');
        }
    });

    form.appendChild(submitButton);  // Ajouter le bouton d'envoi au formulaire

    // Ajouter le formulaire à la section "contact"
    contactSection.appendChild(form);
}

addNewWork();
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