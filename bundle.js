(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { setPost, appendPost, renderGif } = require("./helpers");

const APIKEY = "TLvi8tf9k2z6WmKQm73BO1RIXRoaZzmL";

const getAllPosts = async () => {
    try {
        const response = await fetch("https://coderunner-blog.herokuapp.com/posts");
        const data = await response.json();
        setPost(data); // function that iterates through post data
    } catch (err) {
        console.error(err);
    }
};

const submitPost = async (e) => {
    e.preventDefault();
  
    try {
        const postData = {
            title: e.target.title.value,
            message: e.target.message.value,
            giphy: e.target.giphy.value,
        };

        const options = {
            method: "POST",
            body: JSON.stringify(postData),
            headers: { "Content-Type": "application/json" },
        };

        const response = await fetch("https://coderunner-blog.herokuapp.com/posts", options);

        const json = await response.json();

        appendPost(json); //create function that appends data in specified format created
    } catch (err) {
        console.error(err);
    }
};

const submitComment = async (e) => {
    e.preventDefault();
  
    // pass post id through and use as url param
    const pid = e.target.value;
    try {
        const commentData = {
            message: e.target.value,
            time: e.target.value, // create function that get time of request
        };
    
        const options = {
            method: "POST",
            body: JSON.stringify(commentData),
            headers: { "Content-Type": "application/json" },
        };
    
        const response = await fetch(
            `https://coderunner-blog.herokuapp.com/posts/${pid}/comments`,
            options
        );
    
        const json = await response.json();
    
        appendComments(json); //create function that appends comments data in specified format created
    } catch (err) {
        console.error(err);
    }
};

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
    renderGif(gifArr);
    
};

module.exports = {
    getAllPosts,
    submitPost,
    submitComment,
    getGiphs
}

},{"./helpers":3}],2:[function(require,module,exports){
const { getAllPosts, submitPost, getGiphs } = require("./api");

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

},{"./api":1}],3:[function(require,module,exports){
const { renderGiph, renderPostBody } = require("./render");

function clearPosts(){
  let posts = document.querySelectorAll('.post');
  Array.from(posts).forEach(post => {
    post.parentElement.removeChild(post);
  });
}

function appendPost(postData){
  const form = document.querySelector("#post-form");
  let post = document.createElement("article");
  let gif = postData.giphy && renderGiph(postData);
  let postBody = renderPostBody(postData);
  
  post.classList.add("post", "card", "mb-3");

  if(gif) {
    post.appendChild(gif);
  }

  post.appendChild(postBody);
  form.insertAdjacentElement('afterend', post);
}

function setPost(posts) {
  clearPosts();
  posts.forEach((post) => appendPost(post));
}

const renderGif = (gifs) => {
  gifs.forEach((gif) => appendGif(gif));
};

const appendGif = (gif) => {
  let modalBody = document.querySelector("#giphy-body");
  const newImg = document.createElement("img");
  let gifUrl = gif.images.fixed_width_downsampled.url;
  newImg.src = gifUrl;
  newImg.className = "giphy-preview mb-2";
  modalBody.insertAdjacentElement("afterbegin", newImg);
  newImg.addEventListener("click", addGif);
};

const addGif = (e) => {
  let selectedGif = e.target;
  const thumbnailParent = document.querySelector(".removable-gif")
  thumbnailParent.innerHTML = ""
  thumbnailParent.appendChild(selectedGif)
  const giphyInput = document.querySelector("#giphy-input");
  giphyInput.value = selectedGif.src;
};

module.exports = {
  setPost, appendPost, renderGif
};

},{"./render":5}],4:[function(require,module,exports){
const { pageLoadHandler, giphySearchHandler, postSubmitHandler } = require("./handlers");

function init() {
  const postForm = document.querySelector("#post-form");
  const gifBtn = document.querySelector("#post-form #add-gif-btn");
  const gifSearch = document.querySelector("#giphy-search");

  gifSearch.addEventListener("submit", giphySearchHandler);
  postForm.addEventListener("submit", postSubmitHandler);
  //   gifBtn.addEventListener("click", loadGiphy);

  pageLoadHandler();
}

init();

},{"./handlers":2}],5:[function(require,module,exports){
function renderDateString(timestamp){
    let date = new Date(parseInt(timestamp));
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${(date.getHours() % 12) + 1}:${("00" + date.getMinutes()).slice(-2)} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

function renderGiph(postData){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

    gifContainer.href = "#!";

    gif.classList.add('card-img-top');

    gif.setAttribute('alt', 'Image from Giphy');
    gif.src = postData.giphy;

    gifContainer.appendChild(gif);

    return gifContainer;
}

function renderReactions(postData){
    let reactionBtns = [
        ['👍', 'thumbs_up'],
        ['👎', 'thumbs_down'],
        ['❤', 'heart']
    ].map(emoji => {
        let btn = document.createElement('button');
        btn.classList.add('btn');
        if(localStorage.uid && postData.reactions[emoji[1]].includes(localStorage.uid)) {
            btn.classList.add('btn-dark');
        }else{
            btn.classList.add('btn-light');
        }
        btn.textContent = `${postData.reactions[emoji[1]].length} ${emoji[0]}`;
        return btn;
    });

    return reactionBtns;
}

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
    commentsBtn.setAttribute('data-pid', postData.pid);
    commentsBtn.textContent = `Comments (${postData.comments.length})`;
    commentsBtn.addEventListener('click', commentsBtnHandler);
    postBody.appendChild(commentsBtn);

    return postBody;
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

function renderComments(postData){
    // comments
    let comments = postData.comments.map(renderComment);

    return comments;
}

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

    // reactions
    let reactionBtns = content.querySelectorAll(".modal-body > button");
    for(let i = 0; i < reactionBtns.length; i++) {
        reactionBtns[i].parentElement.removeChild(reactionBtns[i]);
    }

    reactionBtns = renderReactions(postData);
    Array.from(reactionBtns).forEach(button => {
        message.insertAdjacentElement('afterend', button);
    });
  
    // comments
    let comments = content.querySelectorAll(".comment");
    for(let i = 0; i < comments.length; i++) {
        comments[i].parentElement.removeChild(comments[i]);
    }

    let commentForm = document.getElementById("comment-form");
    comments = renderComments(postData);
    comments.forEach(comment => {
        commentForm.insertAdjacentElement('beforebegin', comment);
    });

    // form
    form.message.value = "";
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
    renderGiph, renderPostBody, renderComments
};

},{}]},{},[4]);
