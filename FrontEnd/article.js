class Article{
    constructor(jsonArticle){
        jsonArticle && Object.assign(this, jsonArticle);
    }
    
}