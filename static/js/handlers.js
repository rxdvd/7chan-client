const { getAllPosts, submitPost, getGiphs } = require("./api");
const { getPaginationInfo, getFilterOption, setFilterOption } = require("./helpers");

function pageLoadHandler(page, perPage, sortBy){
    setFilterOption(sortBy);
    getAllPosts(page, perPage, sortBy);
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

    getAllPosts(pageInfo.page, pageInfo.perPage, getFilterOption());
    
    window.history.replaceState(
        pageInfo, 
        `Page ${pageInfo.page} - Coderunner`,
        `?page=${pageInfo.page}&perPage=${pageInfo.perPage}`
    );

    const form = document.querySelector("#post-form");
    form.nextSibling.scrollIntoView();
}

function postSortHandler(e){
    getAllPosts(
        1,
        getPaginationInfo().perPage,
        e.target.value
    );
}

module.exports = {
    postSubmitHandler,
    giphySearchHandler,
    pageLoadHandler,
    paginationBtnHandler,
    textareaHandler,
    postSortHandler
};
