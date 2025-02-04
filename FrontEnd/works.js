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

// Fonction pour gerer la page login
function loginOverlay() {

    // Récupère les elements
    const loginOverlay = document.getElementById('loginOverlay');
    const loginLink = document.getElementById('loginLink'); 
    const homeLink = document.getElementById('homeLink'); 

    // Variables pour gérer le défilement et la largeur de la barre de défilement
    let scrollPosition = 0;
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Ajoute un événement au clic sur le lien de connexion
    loginLink.addEventListener('click', function(event) {
        event.stopPropagation();

        // Force la page a remonter et empeche le defilement
        scrollPosition = window.scrollY;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
        loginOverlay.style.display = 'flex';
    });

    // Fonction pour fermer l'overlay de connexion
    function closeLoginOverlay() {
        loginOverlay.style.display = 'none';
        document.body.style.overflow = ''; 
        document.body.style.paddingRight = '';
    }

    // Ferme l'overlay quand on clique a coter
    loginOverlay.addEventListener('click', function(event) {
        if (event.target === loginOverlay) {
            closeLoginOverlay();
        }
    });

    // Ferme également l'overlay quand onclique dans le header
    homeLink.addEventListener('click', function() {
        closeLoginOverlay();
    });
}

function userLogin() {
    // Ecoute l'envoie du formulaire
    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        console.log("Formulaire soumis");

        // Récupère les valeurs des champs email et mot de passe
        const email = document.getElementById("emailUser").value;
        const password = document.getElementById("password").value;
        console.log("Données envoyées :", { email, password });

        // Crée un objet contenant les informations de connexion
        const loginData = {
            email: email,
            password: password
        };

        try {
            // Récupération des données depuis l'API
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            // Vérifie si la réponse est correcte
            if (!response.ok) {
                throw new Error("Erreur de connexion. Vérifiez vos identifiants.");
            }

            // Traite la réponse
            const data = await response.json();
            console.log("Connexion réussie :", data);

            // Stocke les logs dans localStorage
            let logs = JSON.parse(localStorage.getItem("logs")) || [];
            logs.push({ time: new Date().toLocaleString(), message: "Connexion réussie", data: data });
            localStorage.setItem("logs", JSON.stringify(logs));

            // Stocke le token dans localStorage
            localStorage.setItem("token", data.token);

            // Redirige l'utilisateur vers la page d'accueil après une connexion réussie
            window.location.href = "index.html"; 

        } catch (error) {

            console.error("Erreur :", error.message);

            // Stocke l'erreur dans localStorage
            let logs = JSON.parse(localStorage.getItem("logs")) || [];
            logs.push({ time: new Date().toLocaleString(), message: "Erreur : " + error.message }); // Ajoute un log d'erreur
            localStorage.setItem("logs", JSON.stringify(logs)); // Sauvegarde les logs d'erreur dans localStorage

            // Affiche une alerte pour informer l'utilisateur de l'erreur
            alert(error.message);
        }
    });

    // Afficher les logs existants au chargement de la page
    window.addEventListener("load", function() {

        // Récupère les logs stockés dans localStorage
        let logs = JSON.parse(localStorage.getItem("logs")) || [];

        // Afficher les logs
        console.log("Historique des logs :", logs);
        logs.forEach(log => {
            console.log(`${log.message}`, log.data || "");
        });
    });
}

userLogin();
loginOverlay();
generateFilter();
generateWorks();