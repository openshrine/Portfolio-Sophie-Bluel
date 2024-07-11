document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.getElementById("edit-button");
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector("#modal .close");
    const addPhotoButton = document.getElementById("add-photo-btn");
    const addPhotoModal = document.getElementById("add-photo-modal");
    const closeAddPhotoModal = document.querySelector("#add-photo-modal .close");
    const backArrow = document.querySelector("#add-photo-modal .back-arrow");
    const choosePhotoButton = document.getElementById("choose-photo-btn");
    const photoUpload = document.getElementById("photo-upload");
    const previewImage = document.getElementById("preview-image");
    const validateButton = document.getElementById("validate-btn");
    const addPhotoForm = document.getElementById("add-photo-form");

    let selectedImage = null;

    // Ouvrir la modale de gestion des travaux
    editButton.addEventListener("click", () => {
        modal.style.display = "flex";
        loadGallery();
    });

    // Fermer la modale de gestion des travaux
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fermer la modale d'ajout de photo
    closeAddPhotoModal.addEventListener("click", () => {
        addPhotoModal.style.display = "none";
    });

    // Retourner à la modale de gestion des travaux
    backArrow.addEventListener("click", () => {
        addPhotoModal.style.display = "none";
        modal.style.display = "flex";
    });

    // Ouvrir la modale d'ajout de photo
    addPhotoButton.addEventListener("click", () => {
        modal.style.display = "none";
        addPhotoModal.style.display = "flex";
    });

    // Sélectionner une photo
    choosePhotoButton.addEventListener("click", () => {
        photoUpload.click();
    });

    // Afficher l'image sélectionnée
    photoUpload.addEventListener("change", () => {
        const file = photoUpload.files[0];
        if (file) {
            selectedImage = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        }
    });

    // Vérifier la validité du formulaire d'ajout de photo
    addPhotoForm.addEventListener("input", checkFormValidity);

    function checkFormValidity() {
        const title = document.getElementById("photo-title").value;
        const category = document.getElementById("photo-category").value;
        if (selectedImage && title && category) {
            validateButton.disabled = false;
        } else {
            validateButton.disabled = true;
        }
    }

    // Soumettre le formulaire d'ajout de photo
    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("photo-title").value;
        const category = document.getElementById("photo-category").value;
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("image", selectedImage);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                const newWork = await response.json();
                articleManager.listArticle.push(newWork);
                displayArticles(articleManager.listArticle);
                modal.style.display = "flex";
                addPhotoModal.style.display = "none";
            } else {
                alert("Erreur lors de l'ajout de la photo.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    });

    // Charger et afficher les travaux dans la modale
    async function loadGallery() {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.innerHTML = "";
        works.forEach((work) => {
            const workElement = document.createElement("div");
            workElement.classList.add("work-item");
            workElement.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}" class="work-img" />
                <button class="delete-work" data-id="${work.id}"><i class="fa-regular fa-trash-can" style="color: #ffffff;"></i></button>
            `;
            modalGallery.appendChild(workElement);

            workElement.querySelector(".delete-work").addEventListener("click", async () => {
                const workId = work.id;
                try {
                    const deleteResponse = await fetch(`http://localhost:5678/api/works/${workId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (deleteResponse.ok) {
                        articleManager.listArticle = articleManager.listArticle.filter((article) => article.id !== workId);
                        displayArticles(articleManager.listArticle);
                        loadGallery();
                    } else {
                        alert("Erreur lors de la suppression de la photo.");
                    }
                } catch (error) {
                    console.error("Erreur:", error);
                    alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
                }
            });
        });
    }

    // Fermer les modales en cliquant à l'extérieur
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        } else if (event.target === addPhotoModal) {
            addPhotoModal.style.display = "none";
        }
    });
});
