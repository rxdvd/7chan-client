const { getAllPosts, submitPost, getGiphs } = require("./api");
const { getPaginationInfo } = require("./helpers");

function pageLoadHandler(page, perPage){
    getAllPosts(page, perPage);
}

function textareaHandler(e){
    const remaining = e.target.nextElementSibling;
    remaining.textContent = `${420 - e.target.value.length} characters remaining`;
}

function postSubmitHandler(e){
    submitPost(e);
}

function giphySearchHandler(e){
    getGiphs(e);
}

function paginationBtnHandler(e){
    let pageInfo = {
        page: e.target.dataset.page,
        perPage: getPaginationInfo().perPage
    };

    getAllPosts(pageInfo.page, pageInfo.perPage);
    
    window.history.replaceState(
        pageInfo, 
        `Page ${pageInfo.page} - Coderunner`,
        `?page=${pageInfo.page}&perPage=${pageInfo.perPage}`
    );

    const form = document.querySelector("#post-form");
    form.nextSibling.scrollIntoView();
}

module.exports = {
    postSubmitHandler,
    giphySearchHandler,
    pageLoadHandler,
    paginationBtnHandler,
    textareaHandler
};
