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

    // Extraction des catégories uniques des travaux
    const categories = worksData.map(works => works.category);
    const uniqueCategories = [...new Set(categories)];
    console.log(uniqueCategories);
    // Récupération de l'élément du DOM qui accueillera les travaux
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';

    // Boucle sur les travaux récupérées pour les afficher dans la galerie
    worksData.forEach(article => {
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

// Fonction pour ajouter la classe active au bouton cliqué
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

// Fonction pour gérer l'affichage du formulaire de connexion
function setupLogin() {
    document.getElementById('loginLink').addEventListener('click', function() {
        document.getElementById('loginOverlay').style.display = 'flex'; // Afficher l'overlay
    });

    document.getElementById('loginOverlay').addEventListener('click', function(event) {
        if (event.target === document.getElementById('loginOverlay')) {
            document.getElementById('loginOverlay').style.display = 'none'; // Fermer si on clique sur le fond
        }
    });

};

setupLogin();
generateFilter();
generateWorks();