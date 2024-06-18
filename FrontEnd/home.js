fetch("http://localhost:5678/api/works")
.then( data => data.json())
.then( jsonListArticle => {
    for(let jsonArticle of jsonListArticle){
        let article = new Article(jsonArticle);
        document.querySelector(".gallery").innerHTML += `<div class="card article">
                                                            <img src="${article.imageUrl}" class="card-img">
                                                            <p class="card-title">${article.title}</p>
                                                        </div>`
    }
});
 