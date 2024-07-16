
class Article {
    constructor(jsonArticle) {
        jsonArticle && Object.assign(this, jsonArticle);
    }
}

class ArticleManager {
    constructor(listArticle) {
        this.listArticle = listArticle;
    }


    filterByCategory(categoryId) {
        if (categoryId === "all") {
            return this.listArticle;
        } else {
            return this.listArticle.filter(article => article.categoryId == categoryId);
        }
    }
}


let articleManager;

fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(jsonListArticle => {
        const articles = jsonListArticle.map(jsonArticle => new Article(jsonArticle));
        articleManager = new ArticleManager(articles);
        displayArticles(articles);
    });


function displayArticles(articles) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (let article of articles) {
        gallery.innerHTML += `<div class="card article">
                                <img src="${article.imageUrl}" class="card-img">
                                <p class="card-title">${article.title}</p>
                              </div>`;
    }
}



document.querySelectorAll(".filters button").forEach(button => {
    button.addEventListener("click", (event) => {
        document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");
        const filter = event.target.getAttribute("data-filter");
        fetch(`http://localhost:5678/api/works?filter=${filter}`)
            .then(response => response.json())
            .then(articles => displayArticles(articles));
    });
});

