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
    const uploadSection = document.querySelector(".upload-section");

    let selectedImage = null;

    editButton.addEventListener("click", () => {
        modal.style.display = "flex";
        loadGallery();
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    closeAddPhotoModal.addEventListener("click", () => {
        addPhotoModal.style.display = "none";
    });

    backArrow.addEventListener("click", () => {
        addPhotoModal.style.display = "none";
        modal.style.display = "flex";
    });

    addPhotoButton.addEventListener("click", () => {
        modal.style.display = "none";
        addPhotoModal.style.display = "flex";
    });

    choosePhotoButton.addEventListener("click", () => {
        photoUpload.click();
    });

    photoUpload.addEventListener("change", () => {
        const file = photoUpload.files[0];
        if (file) {
            selectedImage = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadSection.innerHTML = "";

                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.maxWidth = "100px";
                img.style.display = "block";
                img.style.margin = "0 auto";
                uploadSection.appendChild(img);

                checkFormValidity();
            };
            reader.readAsDataURL(file);
        }
    });

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

    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
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
                addPhotoModal.style.display = "none";
                resetAddPhotoModal();
                modal.style.display = "flex";
                loadGallery();
            } else {
                alert("Erreur lors de l'ajout de la photo.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    });

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

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        } else if (event.target === addPhotoModal) {
            addPhotoModal.style.display = "none";
        }
    });

    function resetAddPhotoModal() {
        selectedImage = null;
        previewImage.style.display = "none";
        uploadSection.innerHTML = `
            <div class="upload-icon"><i class="fa-regular fa-image" style="color: #d6d9dc;"></i></div>
            <input type="file" id="photo-upload" style="display:none;" />
            <button id="choose-photo-btn">+ Ajouter Photo</button>
        `;
        document.getElementById("photo-title").value = "";
        document.getElementById("photo-category").value = "";
        validateButton.disabled = true;

        const newChoosePhotoButton = document.getElementById("choose-photo-btn");
        newChoosePhotoButton.addEventListener("click", () => {
            photoUpload.click();
        });

        const newPhotoUpload = document.getElementById("photo-upload");
        newPhotoUpload.addEventListener("change", () => {
            const file = newPhotoUpload.files[0];
            if (file) {
                selectedImage = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadSection.innerHTML = "";
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.maxWidth = "100px";
                    img.style.display = "block";
                    img.style.margin = "0 auto";
                    uploadSection.appendChild(img);
                    checkFormValidity();
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
