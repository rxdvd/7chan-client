(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { 
    setPost, appendPost, setGif, sortPosts, 
    filterPosts, updateCommentCount, resetCommentForm 
} = require("./helpers");

const { renderSinglePost } = require("./render");

const getAllPosts = async (opts) => {
    try {
        const response = await fetch("https://coderunner-blog.herokuapp.com/posts");
        let data = await response.json();
        sortPosts(data, opts.sortBy);
        data = filterPosts(data);
        setPost(data, opts.page, opts.perPage); // function that iterates through post data
    } catch (err) {
        console.error(err);
    }
};

const submitPost = async (e) => {
    e.preventDefault();
    
    const form = e.target
    let tags = e.target.tags.value;
    tags = tags.length ? tags.split(",").map(tag => tag.trim()) : [];

    try {
        const postData = {
            title: e.target.title.value,
            message: e.target.message.value,
            giphy: e.target.giphy.value,
            tags: tags
        };

        const options = {
            method: "POST",
            body: JSON.stringify(postData),
            headers: { "Content-Type": "application/json" },
        };

        const response = await fetch("https://coderunner-blog.herokuapp.com/posts", options);

        const json = await response.json();

        appendPost(json); 
        form.reset()
    } catch (err) {
        console.error(err);
    }
};

const submitComment = async (pid, comment) => {
    try {
        const commentData = {
            comment: comment
        };

        const options = {
            method: "POST",
            body: JSON.stringify(commentData),
            headers: { "Content-Type": "application/json" }
        };
    
        const response = await fetch(
            `https://coderunner-blog.herokuapp.com/posts/${pid}/comments`,
            options
        );
    
        const json = await response.json();
    
        resetCommentForm();
        renderSinglePost(json);
        updateCommentCount(json);
        
    } catch (err) {
        console.error(err);
    }
};

const APIKEY = "TLvi8tf9k2z6WmKQm73BO1RIXRoaZzmL";
const getGiphs = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.searchTerm.value.trim();
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=20&q=`;
  
    url = url.concat(searchTerm);
    const response = await fetch(url);
    const json = await response.json();
    const gifArr = json.data;
    let modalBody = document.querySelector("#giphy-body");
    modalBody.innerHTML = ''
    setGif(gifArr);
    
};

module.exports = {
    getAllPosts, submitPost, submitComment, getGiphs
};

},{"./helpers":3,"./render":5}],2:[function(require,module,exports){
const { getAllPosts, submitPost, submitComment, getGiphs } = require("./api");
const { getPaginationInfo, updateHistory } = require("./helpers");

function pageLoadHandler(){
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

},{"./api":1,"./helpers":3}],3:[function(require,module,exports){
const { renderPostGiph, renderPostBody, renderGiphyResult } = require("./render");

// Posts
function setPost(posts, page, perPage) {
  clearPosts();
  
  let totalPages = Math.ceil(posts.length / perPage);
  if(page > totalPages || page < 1) page = 1;

  posts
    .slice((page - 1) * perPage, page * perPage)
    .forEach(appendPost);

  clearPagination();
  updatePagination(posts, page, perPage);
}

function appendPost(postData){
  let post = document.createElement("article");
  let gif = postData.giphy && renderPostGiph(postData);
  let postBody = renderPostBody(postData);
  
  post.classList.add("post", "card", "mb-3");

  if(gif) {
    post.appendChild(gif);
  }

  post.appendChild(postBody);

  const sortBy = document.querySelector("#post-sort");
  sortBy.insertAdjacentElement('afterend', post);
}

function clearPosts(){
  let posts = document.querySelectorAll('.post');
  Array.from(posts).forEach(post => {
    post.parentElement.removeChild(post);
  });
}

function sortPosts(posts, sortBy){
  posts.sort((a, b) => {
    switch(sortBy){
      case 'old':
        return b.timestamp - a.timestamp;
      case 'emoji':
        return countReactions(a) - countReactions(b);
    }
    return a.timestamp - b.timestamp;
  });
}

function filterPosts(posts){
  const filter = document.querySelector("#post-filter");
  if(!filter.value.length) return posts;

  const tags = filter.value.split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length);
    
  return posts.filter(post => {
    // match all
    for(let i = 0; i < tags.length; i++){
      if(!post.tags.includes(tags[i])){
        return false;
      }
    }
    return true;
  });
}

function countReactions(postData){
  let count = 0;
  for(let emoji in postData.reactions) {
    count += postData.reactions[emoji].length;
  }
  return count;
}

// Giphy
const setGif = (gifs) => {
  gifs.forEach((gif) => appendGif(gif));
};

const appendGif = (gif) => {
  const modalBody = document.querySelector("#giphy-body");
  const newImg = renderGiphyResult(gif);
  modalBody.insertAdjacentElement("afterbegin", newImg);
};

// Comments
function resetCommentForm(){
  const commentForm = document.querySelector("#comment-form");
  commentForm.reset();
}

function updateCommentCount(postData){
  const commentBtn = document.querySelector(`button[href='#!'][data-pid='${postData.pid}']`);
  commentBtn.textContent = `Comments (${postData.comments.length})`;
}

// Pagination
function clearPagination(){
  let pageLinks = document.querySelectorAll("#pagination > ul > li.page-item");

  for(let i = 0; i < pageLinks.length; i++){
      pageLinks[i].className = "page-item";
      pageLinks[i].firstElementChild.removeAttribute("aria-disabled");
      pageLinks[i].removeAttribute("aria-current");
  }
}

function updatePagination(postsData, currentPage, perPage){
  let totalPages = Math.ceil(postsData.length / perPage);
  let pageItems = document.querySelectorAll("#pagination > ul > li.page-item");
  let prevBtn = pageItems[0];
  let nextBtn = pageItems[pageItems.length - 1];

  currentPage = parseInt(currentPage);

  // prev
  if (currentPage === 1) {
    prevBtn.classList.add("disabled");
    prevBtn.firstElementChild.setAttribute('aria-disabled', 'true');
  }
  prevBtn.firstElementChild.dataset.page = currentPage - 1;

  // next
  if (currentPage === totalPages) {
    nextBtn.classList.add("disabled");
    nextBtn.firstElementChild.setAttribute('aria-disabled', 'true');
  }
  nextBtn.firstElementChild.dataset.page = currentPage + 1;

  // pages
  let startPage = Math.min(Math.max(1, totalPages - 4), Math.max(1, currentPage - 2));

  for(let i = 1; i < pageItems.length - 1; i++){
    let pageBtn = pageItems[i];

    if(i === currentPage) {
      pageBtn.classList.add("active");
      pageBtn.setAttribute('aria-current', 'page');
    }

    let pageNumber = startPage + i - 1;

    if(pageNumber > totalPages) {
      pageBtn.classList.add("d-none");
    }
    pageBtn.firstElementChild.textContent = pageNumber;
    pageBtn.firstElementChild.dataset.page = pageNumber;
  }
}

function getPaginationInfo(){
  let query = parseURLQuery();
  let sort = document.querySelector("#post-sort-select");
  return {
    page: parseInt(query.page) || 1,
    perPage: Math.max(1, parseInt(query.perPage)) || 5,
    sortBy: query.sortBy || sort.value
  }
}

// Misc.
function parseURLQuery(){
  let query = location.search.slice(1);
  
  // handle empty query
  if(!query) {
    return "";
  }

  let splitQuery = query.split('&').map(keyValue => keyValue.split("=").map(decodeURIComponent));

  let parsedQuery = {};
  splitQuery.forEach(keyValue => {
    if(keyValue.length === 2) {
      parsedQuery[keyValue[0]] = keyValue[1].replace(/\+/g, ' ');
    }
  });

  return parsedQuery;
}

function updateHistory(pageInfo){
  window.history.replaceState(
    pageInfo, 
    `Page ${pageInfo.page} - Coderunner`,
    `?page=${pageInfo.page}&perPage=${pageInfo.perPage}`
  );
}

module.exports = {
  setPost, appendPost, setGif, parseURLQuery, 
  getPaginationInfo, sortPosts, filterPosts, 
  updateHistory, updateCommentCount, resetCommentForm
};

},{"./render":5}],4:[function(require,module,exports){
const { 
  pageLoadHandler, giphySearchHandler, postSubmitHandler, 
  commentSubmitHandler, paginationBtnHandler, textareaHandler, 
  postSortHandler, postFilterHandler, giphRemoveHandler 
} = require("./handlers");

const { getPaginationInfo } = require("./helpers");

function init() {
  const postForm = document.querySelector("#post-form");
  postForm.addEventListener("submit", postSubmitHandler);

  const gifSearch = document.querySelector("#giphy-search");
  gifSearch.addEventListener("submit", giphySearchHandler);

  const gifRemoveBtn = document.querySelector("#gif-remove-btn");
  gifRemoveBtn.addEventListener('click', giphRemoveHandler);

  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    textarea.addEventListener('keyup', textareaHandler);
  });

  const commentForm = document.querySelector("#comment-form");
  commentForm.addEventListener('submit', commentSubmitHandler);

  const sortBy = document.querySelector("#post-sort-select");
  sortBy.value = getPaginationInfo().sortBy;
  sortBy.addEventListener('change', postSortHandler);

  const filter = document.querySelector("#post-filter");
  filter.addEventListener('keypress', postFilterHandler);

  const pageBtns = document.querySelectorAll("#pagination > ul > li > a");
  pageBtns.forEach(pageBtn => {
    pageBtn.addEventListener('click', paginationBtnHandler);
  });

  pageLoadHandler();
}

init();

},{"./handlers":2,"./helpers":3}],5:[function(require,module,exports){
function renderDateString(timestamp){
    let date = new Date(parseInt(timestamp));
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    let hours = date.getHours() % 12;
    if(hours === 0) hours = 12;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${("00" + date.getMinutes()).slice(-2)} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

// Giphy
function renderPostGiph(postData){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

    gifContainer.href = "#!";

    gif.classList.add('card-img-top');

    gif.setAttribute('alt', 'Image from Giphy');
    gif.src = postData.giphy;

    gifContainer.appendChild(gif);

    return gifContainer;
}

function renderGiphyResult(gifData){
    let img = document.createElement("img");
    img.classList.add("giphy-preview", "mb-2");
    img.src = gifData.images.fixed_width_downsampled.url;
    img.addEventListener("click", giphClickHandler);
    return img;
}

function giphClickHandler(e){
  let selectedGif = e.target;
  const formImg = document.querySelector(".removable-gif > img");
  const giphyInput = document.querySelector("#giphy-input");

  formImg.src = selectedGif.src;
  giphyInput.value = selectedGif.src;

  formImg.parentElement.classList.remove("d-none");

  const closeBtn = document.querySelector("#giphy-body + .modal-footer > button");
  closeBtn.click();
};

// Reactions
function renderReactions(postData){
    let reactionBtns = [
        'thumbs_up', 'thumbs_down', 'heart'
    ].map(emoji => {
        return renderReactionBtn(postData, emoji);
    });

    return reactionBtns;
}

function renderReactionBtn(postData, emoji){
    let btn = document.createElement('button');
    btn.classList.add('btn');
    if(localStorage.uid && postData.reactions[emoji].includes(localStorage.uid)) {
        btn.classList.add('btn-dark');
    }else{
        btn.classList.add('btn-light');
    }
    btn.dataset.pid = postData.pid;
    btn.dataset.emoji = emoji;
    btn.addEventListener('click', reactionBtnHandler);

    let reactions = {
        thumbs_up: '👍',
        thumbs_down: '👎',
        heart: '❤'
    };
    btn.textContent = `${postData.reactions[emoji].length} ${reactions[emoji]}`;

    return btn;
}

function reactionBtnHandler(e){
    if(!localStorage.uid) {
        localStorage.uid = generateUID();
    }

    submitReaction(
        e.target.dataset.pid,
        e.target.dataset.emoji,
        localStorage.uid
    );
}

async function submitReaction(pid, emoji, uid){
    try {
        const reqBody = {
            emoji: emoji,
            uid: uid
        };

        const reqOptions = {
            method: "PATCH",
            body: JSON.stringify(reqBody),
            headers: { "Content-Type": "application/json" }
        };

        const response = await fetch(`https://coderunner-blog.herokuapp.com/posts/${pid}/emoji`, reqOptions);

        const data = await response.json();
        
        const reactionBtns = document.querySelectorAll(`.btn[data-pid='${pid}'][data-emoji='${emoji}']`);
        reactionBtns.forEach(btn => {
            let newBtn = renderReactionBtn(data, emoji);
            btn.parentElement.replaceChild(newBtn, btn);
        });
    } catch(err) {
        console.error(err);
    }
}

function generateUID(){
    let uid = "";
    while(uid.length < 10){
        uid += Math.floor(Math.random() * 10);
    }
    return uid;
}

// Single post display
function renderSinglePost(postData){
    const content = document.querySelector("#single-post .modal-content");
  
    // modal header
    let title = content.querySelector(".modal-header > .modal-title");
    title.textContent = postData.title;

    // gif
    let gif = content.querySelector("#single-post-gif");
    if(postData.giphy) {
        gif.src = postData.giphy;
        gif.classList.remove("d-none");
    } else {
        gif.classList.add("d-none");
    }
    
    // timestamp
    let timestamp = content.querySelector("#single-post-timestamp");
    timestamp.textContent = renderDateString(postData.timestamp);

    // message
    let message = content.querySelector("#single-post-msg");
    message.textContent = postData.message;

    // tags
    let tags = content.querySelector("#single-post-tags");
    tags.textContent = `Tags: ${postData.tags.join(", ")}`;

    // reactions
    let reactionBtns = content.querySelectorAll(".modal-body > button");
    for(let i = 0; i < reactionBtns.length; i++) {
        reactionBtns[i].parentElement.removeChild(reactionBtns[i]);
    }

    let commentsSection = tags.nextElementSibling;
    reactionBtns = renderReactions(postData);
    Array.from(reactionBtns).forEach(button => {
        commentsSection.insertAdjacentElement('beforebegin', button);
    });
  
    // comments
    let comments = content.querySelectorAll(".comment");
    for(let i = 0; i < comments.length; i++) {
        comments[i].parentElement.removeChild(comments[i]);
    }
    
    let commentForm = content.querySelector("#comment-form");
    commentForm.dataset.pid = postData.pid;

    let commentsHeader = commentForm.previousElementSibling;
    comments = postData.comments.map(renderComment);
    comments.forEach(comment => {
        commentsHeader.insertAdjacentElement('afterend', comment);
    });
}

function renderComment(commentData){
    let commentContainer = document.createElement("div");
    commentContainer.classList.add("comment");

    // timestamp
    let time = document.createElement("span");
    time.classList.add("comment-time", "small", "text-muted");
    time.textContent = renderDateString(commentData.timestamp);
    commentContainer.appendChild(time);

    // comment
    let commentBody = document.createElement("p");
    commentBody.classList.add("comment-body", "px-4");
    commentBody.textContent = commentData.comment;
    commentContainer.appendChild(commentBody);

    return commentContainer;
}

// Posts
function renderPostBody(postData){
    let postBody = document.createElement("div");
    postBody.classList.add("card-body");

    let time = document.createElement("div");
    time.classList.add("small", "text-muted");
    time.textContent = renderDateString(postData.timestamp);
    postBody.appendChild(time);

    let title = document.createElement("h2");
    title.classList.add("card-title");
    title.textContent = postData.title;
    postBody.appendChild(title);

    let message = document.createElement("p");
    message.classList.add('card-text');
    message.textContent = postData.message;
    postBody.appendChild(message);

    let reactionBtns = renderReactions(postData);
    reactionBtns.forEach(reaction => {
        postBody.appendChild(reaction);
    });

    let commentsBtn = document.createElement("button");
    commentsBtn.classList.add('btn', 'btn-outline-secondary');
    commentsBtn.setAttribute('href', '#!');
    commentsBtn.setAttribute('data-bs-toggle', 'modal');
    commentsBtn.setAttribute('data-bs-target', '#single-post');
    commentsBtn.dataset.pid = postData.pid;
    commentsBtn.textContent = `Comments (${postData.comments.length})`;
    commentsBtn.addEventListener('click', commentsBtnHandler);
    postBody.appendChild(commentsBtn);

    let tags = document.createElement("div");
    tags.classList.add("small", "text-muted", "text-end");
    tags.textContent = `Tags: ${postData.tags.join(", ")}`;
    postBody.appendChild(tags);

    return postBody;
}

function commentsBtnHandler(e){
    let pid = e.target.getAttribute('data-pid');
    getPostData(pid, renderSinglePost);
}

async function getPostData(pid, callback){
    let response = await fetch(`https://coderunner-blog.herokuapp.com/posts/${pid}`);
    let data = await response.json();
    callback(data);
}

module.exports = {
    renderPostGiph, renderGiphyResult, giphClickHandler, 
    renderPostBody, renderSinglePost, renderDateString,
    renderReactions, renderReactionBtn, reactionBtnHandler,
    generateUID, submitReaction
};

},{}]},{},[4]);
