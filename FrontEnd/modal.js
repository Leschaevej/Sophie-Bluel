export { openModal, checkAuth };

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
}

// Fonction pour gérer l'ouverture et la fermeture de la modale
function openModal() {
    const openModalLink = document.getElementById("openModalLink");
    const modalOverlay = document.getElementById("modalOverlay");
    const closeModalButton = document.getElementById("closeModal");

    // Ouvrir la modale lorsque l'utilisateur clique sur "Modifier"
    openModalLink.addEventListener("click", function(event) {
        event.preventDefault();
        modalOverlay.style.display = "flex";
    });

    // Fermer la modale lorsqu'on clique sur le bouton "X"
    closeModalButton.addEventListener("click", function() {
        modalOverlay.style.display = "none";
    });

    // Fermer la modale si l'utilisateur clique en dehors de la zone de contenu
    modalOverlay.addEventListener("click", function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = "none";
        }
    });
}

