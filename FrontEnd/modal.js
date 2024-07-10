document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.getElementById("edit-button");
    const modal = document.getElementById("modal");
    const addPhotoModal = document.getElementById("add-photo-modal");
    const closeModal = document.querySelectorAll(".close");
    const addPhotoBtn = document.getElementById("add-photo-btn");
    const backArrow = document.querySelector(".back-arrow");
    const choosePhotoBtn = document.getElementById("choose-photo-btn");
    const photoUpload = document.getElementById("photo-upload");
    const previewImage = document.getElementById("preview-image");
    const validateBtn = document.getElementById("validate-btn");
    const photoTitle = document.getElementById("photo-title");
    const photoCategory = document.getElementById("photo-category");
    const addPhotoForm = document.getElementById("add-photo-form");

    editButton.addEventListener("click", () => {
        openModal(modal);
        loadGallery();
    });

    closeModal.forEach(close => {
        close.addEventListener("click", () => {
            closeModalFunc(modal);
            closeModalFunc(addPhotoModal);
        });
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModalFunc(modal);
        if (event.target === addPhotoModal) closeModalFunc(addPhotoModal);
    });

    addPhotoBtn.addEventListener("click", () => {
        openModal(addPhotoModal);
    });

    backArrow.addEventListener("click", () => {
        closeModalFunc(addPhotoModal);
        openModal(modal);
    });

    choosePhotoBtn.addEventListener("click", () => {
        photoUpload.click();
    });

    photoUpload.addEventListener("change", () => {
        const file = photoUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.style.display = "block";
                validateForm();
            };
            reader.readAsDataURL(file);
        }
    });

    photoTitle.addEventListener("input", validateForm);
    photoCategory.addEventListener("change", validateForm);

    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await addPhoto();
        closeModalFunc(addPhotoModal);
        openModal(modal);
        loadGallery();
    });

    function openModal(modalElement) {
        modalElement.style.display = "flex";
    }

    function closeModalFunc(modalElement) {
        modalElement.style.display = "none";
    }

    function validateForm() {
        const fileSelected = photoUpload.files.length > 0;
        const titleFilled = photoTitle.value.trim() !== "";
        const categorySelected = photoCategory.value !== "";
        validateBtn.disabled = !(fileSelected && titleFilled && categorySelected);
    }

    async function loadGallery() {
        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.innerHTML = "";
        const response = await fetch("http://localhost:5678/api/works");
        const articles = await response.json();
        articles.forEach(article => {
            const articleDiv = document.createElement("div");
            articleDiv.className = "modal-article";
            articleDiv.innerHTML = `
          <img src="${article.imageUrl}" class="card-img">
          <p class="card-title">${article.title}</p>
          <button class="delete-btn" data-id="${article.id}">🗑️</button>
        `;
            modalGallery.appendChild(articleDiv);
        });
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (event) => {
                const id = event.target.dataset.id;
                await deletePhoto(id);
                loadGallery();
            });
        });
    }

    async function deletePhoto(id) {
        await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE"
        });
        // Also remove from the main gallery
        const cardToDelete = document.querySelector(`.card[data-id='${id}']`);
        if (cardToDelete) cardToDelete.remove();
    }

    async function addPhoto() {
        const file = photoUpload.files[0];
        const title = photoTitle.value;
        const categoryId = photoCategory.value;
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("categoryId", categoryId);

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData
        });

        const newPhoto = await response.json();
        displayArticles([new Article(newPhoto)]);
    }
});
