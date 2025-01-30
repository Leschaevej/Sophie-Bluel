if (works === null) {
    // Récupération des projet depuis l'API
    const reponse = await fetch("http://localhost:5678/api/works/")
    works = await reponse.json()
    // Transformation des projet en JSON
    const valeurWorks = JSON.stringify(works)
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("works", valeurWorks)
} else {
    works = JSON.parse(works);
}

function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {

        const article = works[i]
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionGallery = document.querySelector(".gallery")
        // Création d’une balise dédiée un projet
        const worksElement = document.createElement ("article")
        worksElement.dataset.id = works[i].id
        // Création des balises 
        const imageElemnt = document.createElement("img")
        imageElemnt.src = article.image
        const nomElement = document.createElement("p")
        nomElement.innerText = article.nom
        // On rattache la balise article a la section gallery
        sectionGallery.appendChild(worksElement)
        worksElement.appendChild(imageElemnt)
        worksElement.appendChild(nomElement)
    }
}

generateWorks(works);