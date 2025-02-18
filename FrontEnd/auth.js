export { showLoginOverlay, loginForm, userLogin, logOut };

// Fonction pour afficher l'overlay de login
function showLoginOverlay() {
    
    const loginOverlay = document.getElementById('loginOverlay');
    const loginLink = document.getElementById('loginLink');
    const homeLink = document.getElementById('homeLink');

    let scrollPosition = 0;
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Écouteur pour afficher l'overlay de login
    loginLink.addEventListener('click', function(event) {
        event.stopPropagation();

        scrollPosition = window.scrollY;
        document.body.style.paddingRight = `${scrollbarWidth}px`;  
        document.body.style.overflow = 'hidden';
        loginOverlay.style.display = 'flex';
    });

    // Fonction pour fermer l'overlay de login
    function closeLoginOverlay() {
        loginOverlay.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    // Écouteur pour fermer l'overlay si on clique en dehors de l'overlay
    loginOverlay.addEventListener('click', function(event) {
        if (event.target === loginOverlay) {
            closeLoginOverlay();
        }
    });

     // Ferme l'overlay lorsque l'utilisateur clique sur le lien "Accueil"
    homeLink.addEventListener('click', function() {
        closeLoginOverlay();
    });
}

// Fonction pour afficher le formulaire de login
function loginForm() {

    const existingForm = document.getElementById('formContainer');
    if (existingForm) {
        return;
    }

    const loginOverlay = document.getElementById('loginOverlay');

    // Création du conteneur du formulaire
    const formContainer = document.createElement('div');
    formContainer.id = 'formContainer';

    // Création de l'en-tête du formulaire
    const h2 = document.createElement('h2');
    h2.textContent = 'Login';
    formContainer.appendChild(h2);

    // Création du formulaire
    const form = document.createElement('form');
    form.id = 'loginForm';

    // Ajout du champ "Email"
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

    // Ajout du champ "Mot de passe"
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

    // Bouton de soumission du formulaire
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.classList.add('loginButton');
    submitButton.textContent = 'Se connecter';
    form.appendChild(submitButton);

    // Zone d'erreur pour afficher les messages d'erreur
    const errorParagraph = document.createElement('p');
    errorParagraph.id = 'loginError';
    form.appendChild(errorParagraph);

    // Ajout du formulaire au conteneur
    formContainer.appendChild(form);

    // Ajout du formulaire à l'overlay
    loginOverlay.appendChild(formContainer);
}

// Fonction pour gérer la connexion de l'utilisateur
function userLogin() {
    const loginButton = document.querySelector(".loginButton");

    if (loginButton) {
        loginButton.addEventListener("click", async function() {

            const email = document.getElementById("emailUser").value;
            const password = document.getElementById("password").value;
            const errorMessage = document.getElementById("loginError");
            errorMessage.style.display = "none";
            errorMessage.textContent = "";
            const loginData = { email, password };

            try {
                
                // Envoie une requête POST pour vérifier les informations de connexion
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginData)
                });

                if (!response.ok) {
                    throw new Error("Adresse mail ou mot de passe incorrecte");
                }

                // Si la connexion est réussie
                const data = await response.json();

                // Sauvegarde le token dans la session
                sessionStorage.setItem("token", data.token);

                // Réinitialisation du formulaire et de l'overlay
                const formContainer = document.getElementById("formContainer");
                formContainer.innerHTML = '';
                loginButton.style.display = "none";
                closeLoginOverlay();
                document.body.style.overflow = '';

                // Création de la barre de mode édition
                const modeEditionBar = document.createElement('div');
                modeEditionBar.classList = 'modeEditionBar';
                const penIcon = document.createElement('i');
                penIcon.classList.add('fa-regular', 'fa-pen-to-square');
                modeEditionBar.appendChild(penIcon);
                const text = document.createElement('span');
                text.textContent = ' Mode édition';
                modeEditionBar.appendChild(text);
                const html = document.documentElement;
                html.insertBefore(modeEditionBar, document.body);


                // Mise à jour de l'affichage des liens de connexion
                const loginLink = document.getElementById("loginLink");
                const logoutLink = document.getElementById("logoutLink");
                const openModalLink = document.getElementById("openModalLink");
                loginLink.style.display = "none";
                logoutLink.style.display = "inline";
                openModalLink.style.display = "inline";

            } catch (error) {
                // Gestion des erreurs
                errorMessage.textContent = "Adresse mail ou mot de passe incorrecte";
                errorMessage.style.display = "block";
            }
        });
    }
}


// Fonction pour fermer l'overlay de login
function closeLoginOverlay() {
    const overlay = document.getElementById("loginOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
    document.body.style.paddingRight = '';
}

// Fonction pour gérer la déconnexion de l'utilisateur
function logOut () {
    document.addEventListener("DOMContentLoaded", function () {
        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");
        const openModalLink = document.getElementById("openModalLink");

        // Vérification si l'utilisateur est connecté
        function checkAuth() {
            const token = sessionStorage.getItem("token");

            if (token) {
                loginLink.style.display = "none";
                logoutLink.style.display = "inline";
                openModalLink.style.display = "inline";

                // Affichage de la barre de mode édition si l'utilisateur est connecté
                const modeEditionBar = document.getElementById('modeEditionBar');
                if (!modeEditionBar) {
                    const modeEditionBar = document.createElement('div');
                    modeEditionBar.classList = 'modeEditionBar';
                    modeEditionBar.textContent = 'Mode édition';

                    // Insérer la barre avant le body
                    const html = document.documentElement;
                    html.insertBefore(modeEditionBar, document.body);
                }
            } else {
                // Si l'utilisateur n'est pas connecté
                loginLink.style.display = "inline";
                logoutLink.style.display = "none";
                openModalLink.style.display = "none";

                // Supprime la barre de mode édition
                const modeEditionBar = document.querySelector('.modeEditionBar');
                if (modeEditionBar) {
                    modeEditionBar.remove();
                }
            }
        }

        checkAuth();

        // Écouteur pour gérer la déconnexion
        logoutLink.addEventListener("click", function () {
            sessionStorage.removeItem("token");
            checkAuth();

            const formContainer = document.getElementById("formContainer");
            if (formContainer) {
                formContainer.remove();
            }

            loginForm();

            // Réinitialisation des champs du formulaire
            const emailInput = document.getElementById("emailUser");
            const passwordInput = document.getElementById("password");
            emailInput.value = '';
            passwordInput.value = '';
            document.getElementById("loginError").style.display = 'none';
            const loginButton = document.querySelector(".loginButton");
            loginButton.style.display = "inline";

            userLogin();
        });
    });
}