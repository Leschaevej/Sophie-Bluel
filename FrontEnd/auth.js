export { showLoginOverlay, loginForm, userLogin, logOut };

// Fonction pour afficher l'overlay de login
function showLoginOverlay() {
    const loginOverlay = document.querySelector('.loginOverlay');
    const loginLink = document.querySelector('.loginLink');

    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Afficher l'overlay de login
    loginLink.addEventListener('click', function(event) {
        event.stopPropagation();

        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
        loginOverlay.style.display = 'flex';
        window.scrollTo(0, 0);
    });

    // Fermer l'overlay si l'on clique en dehors
    loginOverlay.addEventListener('click', function(event) {
        if (event.target === loginOverlay) {
            loginOverlay.style.display = 'none';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    });
}

// Fonction pour afficher le formulaire de login
function loginForm() {
    const loginOverlay = document.querySelector('.loginOverlay');

    // Vérifier s'il y a déjà un formulaire et le supprimer avant d'en créer un nouveau
    const existingForm = document.querySelector('.loginFormContainer');
    if (existingForm) {
        existingForm.remove();
    }

    // Création du conteneur du formulaire
    const formContainer = document.createElement('div');
    formContainer.classList = 'loginFormContainer';

    // Création de l'en-tête du formulaire
    const h2 = document.createElement('h2');
    h2.textContent = 'Login';
    formContainer.appendChild(h2);

    // Création du formulaire
    const form = document.createElement('form');
    form.classList = 'loginForm';

    // Ajout du champ "Email"
    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'emailUser');
    emailLabel.textContent = 'Email';
    emailLabel.classList = 'loginLabel'
    form.appendChild(emailLabel);
    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.classList = 'loginEmail';
    emailInput.name = 'email';
    emailInput.required = true;
    form.appendChild(emailInput);

    // Ajout du champ "Mot de passe"
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.textContent = 'Mot de passe';
    passwordLabel.classList = 'loginLabel'
    form.appendChild(passwordLabel);
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.classList = 'loginPassword';
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
    errorParagraph.classList = 'loginError';
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
        loginButton.addEventListener("click", async function () {
            const email = document.querySelector(".loginEmail").value;
            const password = document.querySelector(".loginPassword").value;

            const errorMessage = document.querySelector(".loginError");
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            const loginData = { email, password };

            try {
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData)
                });

                if (!response.ok) {
                    throw new Error("Adresse mail ou mot de passe incorrecte");
                }

                const data = await response.json();
                sessionStorage.setItem("token", data.token);

                // Ajout de la barre d'édition
                const modeEditionBar = document.createElement('div');
                modeEditionBar.classList = 'modeEditionBar';
                const penIcon = document.createElement('i');
                penIcon.classList.add('fa-regular', 'fa-pen-to-square');
                modeEditionBar.appendChild(penIcon);
                const text = document.createElement('span');
                text.textContent = ' Mode édition';
                modeEditionBar.appendChild(text);
                document.documentElement.insertBefore(modeEditionBar, document.body);

                // Masquer uniquement les boutons des filtres
                document.querySelectorAll(".filter button").forEach(button => button.style.display = "none");
                const allButton = document.getElementById("tous")
                if (allButton) {
                    allButton.click();
                }
                
                // Mise à jour des liens de connexion
                document.querySelector(".loginLink").style.display = "none";
                document.querySelector(".logoutLink").style.display = "inline";
                document.querySelector(".openModalLink").style.display = "inline";

                document.querySelector(".logoutLink").addEventListener("click", logOut);
                closeLoginOverlay();

            } catch (error) {
                errorMessage.textContent = "Adresse mail ou mot de passe incorrecte";
                errorMessage.style.display = "block";
            }
        });
    }
}

// Fonction pour fermer l'overlay de login
function closeLoginOverlay() {
    const overlay = document.querySelector(".loginOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
}

// Fonction pour gérer la déconnexion de l'utilisateur
function logOut() {
    sessionStorage.removeItem("token");

    const modeEditionBar = document.querySelector('.modeEditionBar');
    if (modeEditionBar) {
        modeEditionBar.remove();
    }

    document.querySelector(".loginLink").style.display = "inline";
    document.querySelector(".logoutLink").style.display = "none";
    document.querySelector(".openModalLink").style.display = "none";

    // Réafficher les boutons des filtres après déconnexion
    document.querySelectorAll(".filter button").forEach(button => button.style.display = "inline-block");

    closeLoginOverlay();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}