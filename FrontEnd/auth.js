export { loginOverlay, userLogin, logOut };

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

        // Gére le message d'erreur
        const errorMessage = document.getElementById("loginError");
        errorMessage.style.display = "none";

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
                throw new Error("");
            }

            // Traite la réponse
            const data = await response.json();
            console.log("Connexion réussie :", data);

            // Stocke les logs dans localStorage
            let logs = JSON.parse(localStorage.getItem("logs")) || [];
            logs.push({ time: new Date().toLocaleString(), message: "Connexion réussie", data: data });
            localStorage.setItem("logs", JSON.stringify(logs));

            // Stocke le token dans localStorage
            sessionStorage.setItem("token", data.token);

            // Redirige l'utilisateur vers la page d'accueil après une connexion réussie
            window.location.href = "index.html"; 

        }catch (error) {
            console.error("Erreur :", error.message || "Une erreur est survenue");
        
            // Stocke l'erreur dans localStorage
            let logs = JSON.parse(localStorage.getItem("logs")) || [];
            logs.push({ time: new Date().toLocaleString(), message: "Erreur : " + (error.message || "Email ou mot de passe incorrect") });
            localStorage.setItem("logs", JSON.stringify(logs));
        
            // Affiche l'erreur sous le formulaire
            errorMessage.textContent = error.message || "Email ou mot de passe incorrect";
            errorMessage.style.display = "block";
        }
        
    });

    // Afficher les logs existants au chargement de la page
    window.addEventListener("load", function() {

        // Récupère les logs stockés dans localStorage
        let logs = JSON.parse(localStorage.getItem("logs")) || [];

        console.log("Historique des logs :");
        logs.forEach(log => {
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] ${log.message}`, log.data || "");
        });
    });

    window.addEventListener("beforeunload", function () {
        localStorage.removeItem("token"); // Supprime le token à la fermeture ou au rechargement de la page
    });
}

function logOut () {
    document.addEventListener("DOMContentLoaded", function () {
        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");
        const openModalLink = document.getElementById("openModalLink");
    
        function checkAuth() {
            const token = sessionStorage.getItem("token");
    
            if (token) {
                // L'utilisateur est connecté
                loginLink.style.display = "none";
                logoutLink.style.display = "inline";
                openModalLink.style.display = "inline"; // Afficher le lien "Modifier"
            } else {
                // L'utilisateur est déconnecté
                loginLink.style.display = "inline";
                logoutLink.style.display = "none";
                openModalLink.style.display = "none"; // Masquer le lien "Modifier"
            }
        }
    
        // Vérifier l'authentification au chargement
        checkAuth();
    
        // Ajout de l'événement pour se déconnecter
        logoutLink.addEventListener("click", function () {
            sessionStorage.removeItem("token");
            checkAuth();  // Re-vérifier l'état de connexion après la déconnexion
        });
    }); 
}

