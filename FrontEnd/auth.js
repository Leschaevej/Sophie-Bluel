export { showLoginOverlay, loginForm, userLogin, logOut };

// Fonction pour afficher l'overlay de connexion
function showLoginOverlay() {
    // Récupérer les éléments nécessaires à l'affichage de l'overlay
    const loginOverlay = document.getElementById('loginOverlay');
    const loginLink = document.getElementById('loginLink');
    const homeLink = document.getElementById('homeLink');

    // Variables pour gérer le défilement et la largeur de la barre de défilement
    let scrollPosition = 0;
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Ajouter un événement au clic sur le lien de connexion
    loginLink.addEventListener('click', function(event) {
        event.stopPropagation();

        // Empêcher le défilement et forcer la page à remonter
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

    // Fermer l'overlay quand on clique à côté de celui-ci
    loginOverlay.addEventListener('click', function(event) {
        if (event.target === loginOverlay) {
            closeLoginOverlay();
        }
    });

    // Fermer l'overlay aussi lorsqu'on clique sur le lien "homeLink"
    homeLink.addEventListener('click', function() {
        closeLoginOverlay();
    });
}

// Fonction pour générer le formulaire de connexion
function loginForm() {
    // Obtenir la référence de la section "loginOverlay"
    const loginOverlay = document.getElementById('loginOverlay');

    // Créer une div pour contenir le formulaire
    const formContainer = document.createElement('div');
    formContainer.id = 'formContainer';

    // Créer un titre h2 en dehors de la div
    const h2 = document.createElement('h2');
    h2.textContent = 'Login';
    formContainer.appendChild(h2);

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
    emailInput.required = true;
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
    passwordInput.required = true;
    form.appendChild(passwordInput);

    // Créer et ajouter le bouton de soumission
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.classList.add('loginButton');
    submitButton.textContent = 'Se connecter';
    form.appendChild(submitButton);

    // Créer et ajouter un paragraphe pour afficher les erreurs
    const errorParagraph = document.createElement('p');
    errorParagraph.id = 'loginError';
    form.appendChild(errorParagraph);

    // Ajouter le formulaire à la div
    formContainer.appendChild(form);

    // Ajouter la div contenant le formulaire au "loginOverlay"
    loginOverlay.appendChild(formContainer);
}

function userLogin() {
    // Ajouter un événement "click" sur le bouton de connexion
    const loginButton = document.querySelector(".loginButton");

    if (loginButton) {
        loginButton.addEventListener("click", async function() {
            // Récupérer les valeurs des champs email et mot de passe
            const email = document.getElementById("emailUser").value;
            const password = document.getElementById("password").value;

            // Cacher les messages d'erreur
            const errorMessage = document.getElementById("loginError");
            errorMessage.style.display = "none";

            // Créer un objet contenant les informations de connexion
            const loginData = { email, password };

            // Ajouter un logo de check (par exemple : coche verte)
            const formContainer = document.getElementById("formContainer");
            
            // Vider le contenu de la div formContainer
            formContainer.innerHTML = '';

            // Créer le logo de check
            const checkLogo = document.createElement('i');
            checkLogo.classList.add('fa', 'fa-check-circle', 'success-icon', 'animate-check');
            checkLogo.id = "checkLogo";

            // Ajouter le logo de check à la div formContainer
            formContainer.appendChild(checkLogo);

            // Masquer le bouton de connexion pendant le chargement
            loginButton.style.display = "none";

            try {
                // Récupérer les données depuis l'API
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginData)
                });

                // Vérifier si la réponse est correcte
                if (!response.ok) {
                    throw new Error("Email ou mot de passe incorrect");
                }

                // Traiter la réponse
                const data = await response.json();
                console.log("Connexion réussie :", data);

                // Stocker les logs dans localStorage
                let logs = JSON.parse(localStorage.getItem("logs")) || [];
                logs.push({ time: new Date().toLocaleString(), message: "Connexion réussie", data: data });
                localStorage.setItem("logs", JSON.stringify(logs));

                // Stocker le token dans sessionStorage
                sessionStorage.setItem("token", data.token);

                // Afficher le logo de check pendant 2 secondes
                setTimeout(() => {
                    // Fermer l'overlay de connexion après succès
                    closeLoginOverlay();

                    // Rediriger l'utilisateur vers la page d'accueil après 1 secondes
                    window.location.href = "index.html";
                }, 1000);

            } catch (error) {
                console.error("Erreur :", error.message || "Une erreur est survenue");

                // Stocker l'erreur dans localStorage
                let logs = JSON.parse(localStorage.getItem("logs")) || [];
                logs.push({ time: new Date().toLocaleString(), message: "Erreur : " + (error.message || "Email ou mot de passe incorrect") });
                localStorage.setItem("logs", JSON.stringify(logs));

                // Afficher l'erreur sous le formulaire
                errorMessage.textContent = error.message || "Email ou mot de passe incorrect";
                errorMessage.style.display = "block";
            } finally {
                // Masquer le logo de check et réafficher le bouton de connexion après 1 secondes
                setTimeout(() => {
                    checkLogo.style.display = "none";
                    loginButton.style.display = "inline";
                }, 1000);
            }
        });
    }
}

// Fonction pour fermer l'overlay de connexion
function closeLoginOverlay() {
    const overlay = document.getElementById("loginOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

// Fonction pour gérer la déconnexion de l'utilisateur
function logOut () {
    document.addEventListener("DOMContentLoaded", function () {
        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");
        const openModalLink = document.getElementById("openModalLink");

        // Vérifier si l'utilisateur est authentifié
        function checkAuth() {
            const token = sessionStorage.getItem("token");

            if (token) {
                // Si l'utilisateur est connecté
                loginLink.style.display = "none";
                logoutLink.style.display = "inline";
                openModalLink.style.display = "inline";
            } else {
                // Si l'utilisateur est déconnecté
                loginLink.style.display = "inline";
                logoutLink.style.display = "none";
                openModalLink.style.display = "none";
            }
        }

        // Vérifier l'authentification dès le chargement de la page
        checkAuth();

        // Ajouter un événement pour se déconnecter
        logoutLink.addEventListener("click", function () {
            sessionStorage.removeItem("token");
            checkAuth();
        });
    });
}