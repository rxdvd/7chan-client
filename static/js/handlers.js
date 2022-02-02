const { getAllPosts, submitPost, getGiphs, } = require("./api");

function pageLoadHandler(e){
    getAllPosts();
}

function postSubmitHandler(e){
    submitPost(e);
}

function giphySearchHandler(e){
    getGiphs(e);
}



module.exports = {
    postSubmitHandler,
    giphySearchHandler,
    pageLoadHandler
};
