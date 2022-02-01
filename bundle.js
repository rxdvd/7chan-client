(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { appendPost } = require("./render");

const APIKEY = "TLvi8tf9k2z6WmKQm73BO1RIXRoaZzmL";

const getAllPosts = async () => {
  try {
    const response = await fetch("http://localhost:3000/posts");
    const data = await response.json();
    setPost(data); // function that iterates through post data
  } catch (err) {
    console.error(err);
  }
};

function setPost(posts) {
  posts.forEach((post) => appendPost(post));
}

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

    const response = await fetch("http://localhost:3000/posts", options);

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
      `http://localhost:3000/posts/${pid}/comments`,
      options
    );

    const json = await response.json();

    appendComments(json); //create function that appends comments data in specified format created
  } catch (err) {
    console.error(err);
  }
};

const renderGif = (gifs) => {
  gifs.forEach((gif) => appendGif(gif));
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

const appendGif = (gif) => {
  let modalBody = document.querySelector("#giphy-body");
  const newImg = document.createElement("img");
  let gifUrl = gif.images.downsized.url;
  newImg.src = gifUrl;
  newImg.className = "giphy-preview mb-2";
  modalBody.insertAdjacentElement("afterbegin", newImg);
  const selectGif = document.querySelector(".giphy-preview.mb-2");
  selectGif.addEventListener("click", addGif);
};

const addGif = (e) => {
  console.log("gif url:", e.target.src);
  let gifThumnail = document.querySelector(".giphy-thumbnail");
  gifThumnail.style.display = "none";
  let gifUrl = e.target.src;
  let gifThumnailUrl = gifThumnail.src;
  gifThumnailUrl.value = gifUrl;
  gifThumnail.style.display = "block";
  console.log(gifThumnail);
  return gifThumnailUrl;
};

module.exports = {
  getAllPosts,
  submitPost,
  submitComment,
  getGiphs,
};

},{"./render":3}],2:[function(require,module,exports){
const { getGiphs, submitPost } = require("./helpers");

function init() {
  const postForm = document.querySelector("#post-form");
  const gifBtn = document.querySelector("#post-form #add-gif-btn");
  const gifSearch = document.querySelector("#giphy-search");

  gifSearch.addEventListener("submit", getGiphs);
  postForm.addEventListener("submit", submitPost);
  //   gifBtn.addEventListener("click", loadGiphy);
}

init();

},{"./helpers":1}],3:[function(require,module,exports){
function renderDateString(timestamp){
    let date = new Date(parseInt(timestamp));
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${(date.getHours() % 12) + 1} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

function renderPostHeader(postData, modal=false){
    let heading = document.createElement(modal ? "h5" : "h2");

    heading.classList.add("card-title");
    heading.textContent = postData.title;

    if(modal) {
        let header = document.createElement("div");
        let closeBtn = document.createElement("button");

        header.classList.add("modal-header", "border-0", "pb-0");
        heading.classList.replace("card-title", "modal-title");
        closeBtn.classList.add("btn-close");

        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('data-bs-dismiss', 'modal');
        closeBtn.setAttribute('aria-label', 'Close');

        header.appendChild(heading);
        header.appendChild(closeBtn);
        
        return header;
    }

    return heading;
}

function renderGiph(postData, modal=false){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

    gif.classList.add('card-img-top');
    if(modal) {
        gif.classList.add('mb-1');
    }

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

function renderPostBody(postData, modal=false){
    let postBody = document.createElement("div");
    postBody.classList.add("card-body");

    let time = document.createElement("div");
    time.classList.add("small", "text-muted");
    time.textContent = renderDateString(postData.timestamp);
    postBody.appendChild(time);

    let message = document.createElement("p");
    message.classList.add('card-text');
    message.textContent = postData.message;
    postBody.appendChild(message);

    let reactionBtns = renderReactions(postData);
    reactionBtns.forEach(postBody.appendChild);

    if(!modal){
        postBody.classList.replace("card-body", "modal-body");
        time.classList.add("mb-1", "text-end");
        message.classList.remove("card-text");

        let title = renderPostHeader(postData);
        postBody.insertBefore(message, title);

        let commentsBtn = document.createElement("button");
        commentsBtn.classList.add('btn', 'btn-outline-secondary');
        commentsBtn.setAttribute('href', '#!');
        commentsBtn.setAttribute('data-bs-toggle', 'modal');
        commentsBtn.setAttribute('data-bs-target', '#single-post');
        commentsBtn.textContent = `Comments (${postData.comments.length})`;
        postBody.appendChild(commentBtn);
    }

    return postBody;
}

function clearPosts(){
    let posts = document.querySelectorAll('.post');
    Array.from(posts).forEach(post => {
        post.parentElement.removeChlid(post);
    });
}

function appendPost(postData){
    const form = document.querySelector("#post-form");
    let post = document.createElement("div");
    let gif = postData.giphy && renderGiph(postData);
    let postBody = renderPostBody(postData);
    
    post.classList.add("post", "card", "mb-3");

    if(gif) {
        post.appendChild(gif);
    }

    post.appendChild(postBody);
    form.insertAdjacentElement('afterend', post);
}

function renderCommentsForm(){
    let form = document.createElement("form");

    let formBody = document.createElement("div");
    formBody.classList.add("mb-3");
    form.appendChild(formBody);

    let label = document.createElement("label");
    label.classList.add("form-label", "fw-bold");
    label.setAttribute("for", "comment-form-message");
    label.textContent = "Post a comment:";
    formBody.appendChild(label);

    let textarea = document.createElement("textarea");
    textarea.classList.add("form-control");
    textarea.id = "comment-form-message";
    textarea.name = "message";
    textarea.placeholder = "Leave a comment...";
    textarea.rows = "3";
    formBody.appendChild(textarea);

    let submitBtn = document.createElement("button");
    submitBtn.classList.add("btn", "btn-primary");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    form.appendChild(submitBtn);

    return form;
}

function renderComment(commentData){
    let commentContainer = document.createElement("div");

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
    let container = document.createElement("div");

    // header
    let header = document.createElement("h5");
    header.classList.add("modal-title", "mb-2");
    header.textContent = "Comments";
    container.appendChild(header);

    // comments
    let comments = postData.comments.map(renderComment);
    comments.forEach(container.appendChild);

    // form
    let commentForm = renderCommentsForm();
    container.appendChild(commentForm);
}

function clearPostModal(){
    const content = document.querySelector("#single-post .modal-content");
    content.innerHTML = "";
}

function appendSinglePost(postData){
    const content = document.querySelector("#single-post .modal-content");

    // modal header
    let header = renderPostHeader(postData, true);
    content.appendChild(header);

    // modal body
    let body = renderPostBody(postData, true);
    let gif = renderGiph(postData, true);

    body.insertAdjacentElement('afterbegin', gif);
    content.appendChild(body);

    // comments
    let comments = renderComments(postData);
    content.appendChild(comments);
}

module.exports = {
    appendPost, appendSinglePost, clearPosts, clearPostModal
};

},{}]},{},[2]);
