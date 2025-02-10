export { showLoginOverlay, loginForm, userLogin, logOut };

// Fonction pour gerer la page login
function showLoginOverlay() {
    // Récupère les éléments
    const loginOverlay = document.getElementById('loginOverlay');
    const loginLink = document.getElementById('loginLink');
    const homeLink = document.getElementById('homeLink');

    // Variables pour gérer le défilement et la largeur de la barre de défilement
    let scrollPosition = 0;
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Ajoute un événement au clic sur le lien de connexion
    loginLink.addEventListener('click', function(event) {
        event.stopPropagation();

        // Force la page à remonter et empêche le défilement
        scrollPosition = window.scrollY;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
        loginOverlay.style.display = 'flex';  // Affiche l'overlay
    });

    // Fonction pour fermer l'overlay de connexion
    function closeLoginOverlay() {
        loginOverlay.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    // Ferme l'overlay quand on clique à côté
    loginOverlay.addEventListener('click', function(event) {
        if (event.target === loginOverlay) {
            closeLoginOverlay();
        }
    });

    // Ferme également l'overlay quand on clique dans le header
    homeLink.addEventListener('click', function() {
        closeLoginOverlay();
    });
}

function loginForm() {
    // Obtenez la référence de la section "loginOverlay"
const loginOverlay = document.getElementById('loginOverlay');

// Créer le titre h2
const h2 = document.createElement('h2');
h2.textContent = 'Login';
loginOverlay.appendChild(h2);

// Créer le formulaire
const form = document.createElement('form');
form.id = 'loginForm';

// Créer et ajouter le champ "E-mail"
const emailLabel = document.createElement('label');
emailLabel.setAttribute('for', 'emailUser');
emailLabel.textContent = 'E-mail';
form.appendChild(emailLabel);

const emailInput = document.createElement('input');
emailInput.type = 'text';
emailInput.id = 'emailUser';
emailInput.name = 'email';
emailInput.required = true;  // Marquer comme requis
form.appendChild(emailInput);

// Créer et ajouter le champ "Mot de passe"
const passwordLabel = document.createElement('label');
passwordLabel.setAttribute('for', 'password');
passwordLabel.textContent = 'Mot de passe';
form.appendChild(passwordLabel);

const passwordInput = document.createElement('input');
passwordInput.type = 'password';
passwordInput.id = 'password';
passwordInput.name = 'password';
passwordInput.required = true;  // Marquer comme requis
form.appendChild(passwordInput);

// Créer et ajouter le bouton de soumission
const submitButton = document.createElement('button');
submitButton.type = 'button';
submitButton.classList.add('loginButton');
submitButton.textContent = 'Se connecter';
form.appendChild(submitButton);

// Créer et ajouter un élément pour afficher les erreurs
const errorParagraph = document.createElement('p');
errorParagraph.id = 'loginError';
form.appendChild(errorParagraph);

// Ajouter le formulaire à la section "loginOverlay"
loginOverlay.appendChild(form);

}

function userLogin() {
    // Ajoute un événement "click" sur le bouton de connexion
    const loginButton = document.querySelector(".loginButton");

    if (loginButton) {
        loginButton.addEventListener("click", async function() {
            // Récupère les valeurs des champs email et mot de passe
            const email = document.getElementById("emailUser").value;
            const password = document.getElementById("password").value;

            // Gère le message d'erreur
            const errorMessage = document.getElementById("loginError");
            errorMessage.style.display = "none"; // Cache l'ancienne erreur

            // Crée un objet contenant les informations de connexion
            const loginData = { email, password };

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
                    throw new Error("Email ou mot de passe incorrect");
                }

                // Traite la réponse
                const data = await response.json();
                console.log("Connexion réussie :", data);

                // Stocke les logs dans localStorage
                let logs = JSON.parse(localStorage.getItem("logs")) || [];
                logs.push({ time: new Date().toLocaleString(), message: "Connexion réussie", data: data });
                localStorage.setItem("logs", JSON.stringify(logs));

                // Stocke le token dans sessionStorage
                sessionStorage.setItem("token", data.token);

                // Ferme l'overlay de connexion après la réussite de la connexion
                closeLoginOverlay();

                // Redirige l'utilisateur vers la page d'accueil après une connexion réussie
                window.location.href = "index.html";

            } catch (error) {
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
    }
}


// Fonction pour fermer l'overlay
function closeLoginOverlay() {
    const overlay = document.getElementById("loginOverlay");
    if (overlay) {
        overlay.style.display = "none";  // Cache l'overlay de connexion
    }
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