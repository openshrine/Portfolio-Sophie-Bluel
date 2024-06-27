class Article {
    constructor(jsonArticle) {
        jsonArticle && Object.assign(this, jsonArticle);
    }
}

class ArticleManager {
    constructor(listArticle) {
        this.listArticle = listArticle;

    }
}


fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(jsonListArticle => {
        for (let jsonArticle of jsonListArticle) {
            let article = new Article(jsonArticle);
            document.querySelector(".gallery").innerHTML += `<div class="card article">
                                                            <img src="${article.imageUrl}" class="card-img">
                                                            <p class="card-title">${article.title}</p>
                                                            </div>`
        }
    });


let btnTous = "Tous";
let btnObjets = "Objets";
let btnAppartements = "Appartements";
let btnHotelsRestaurants = "Hôtels & Restaurants";

document.getElementById("h2").insertAdjacentHTML('beforeend', `<div id="buttons"><button onclick="fetchData('all')"id="btnTous">${btnTous}</button><button onclick="fetchData('objects')" id="btnObjets">${btnObjets}</button><button onclick="fetchData('apartments')"id="btnAppartements">${btnAppartements}</button><button onclick="fetchData('hotels')" id="btnHotelsRestaurants">${btnHotelsRestaurants}</button></div>`);







