const { getAllPosts, submitPost, submitComment, getGiphs } = require("./api");
const { getPaginationInfo, updateHistory } = require("./helpers");

function pageLoadHandler(e){
    getAllPosts(getPaginationInfo());
}

function postSubmitHandler(e){
    submitPost(e);
}

function commentSubmitHandler(e){
    e.preventDefault();
    const pid = e.target.dataset.pid;
    const message = e.target.message.value;
    submitComment(pid, message);
}

function giphySearchHandler(e){
    getGiphs(e);
}

function giphRemoveHandler(e){
    const input = document.querySelector("#giphy-input");
    input.src = "";
    e.target.parentElement.classList.add("d-none");
}

function textareaHandler(e){
    const remaining = e.target.nextElementSibling;
    remaining.textContent = `${420 - e.target.value.length} characters remaining`;
}

function postSortHandler(e){
    let pageInfo = {
        ...getPaginationInfo(),
        page: 1,
        sortBy: e.target.value
    };
    getAllPosts(pageInfo);
    updateHistory(pageInfo);
}

function postFilterHandler(e){
    if(e.key === 'Enter'){
        e.preventDefault();
        pageLoadHandler();
    }
}

function paginationBtnHandler(e){
    let pageInfo = {
        ...getPaginationInfo(),
        page: e.target.dataset.page
    };

    getAllPosts(pageInfo);
    updateHistory(pageInfo);

    const sortBy = document.querySelector("#post-sort");
    sortBy.scrollIntoView();
}

module.exports = {
    postSubmitHandler, giphySearchHandler, pageLoadHandler,
    paginationBtnHandler, textareaHandler, postSortHandler,
    postFilterHandler, giphRemoveHandler, commentSubmitHandler
};
