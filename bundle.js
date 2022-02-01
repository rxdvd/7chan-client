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
  modalBody.innerHTML = "";
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
let selectedGif = e.target;
  const thumbnailParent = document.querySelector(".removable-gif")
  thumbnailParent.innerHTML = ""
  thumbnailParent.appendChild(selectedGif)
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
function renderDateString(date){
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${(date.getHours() % 12) + 1} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

function renderGiph(postData){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

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
    let time = document.createElement("div");
    let title = document.createElement("h2");
    let message = document.createElement("p");
    let reactionBtns = renderReactions(postData);
    let commentsBtn = document.createElement("button");

    postBody.classList.add("card-body");
    time.classList.add("small", "text-muted");
    title.classList.add("card-title");
    message.classList.add('card-text');
    commentsBtn.classList.add('btn', 'btn-outline-secondary');

    commentsBtn.setAttribute('href', '#!');
    commentsBtn.setAttribute('data-bs-toggle', 'modal');
    commentsBtn.setAttribute('data-bs-target', '#single-post');

    time.textContent = renderDateString(new Date(postData.time));
    title.textContent = postData.title;
    message.textContent = postData.message;
    commentsBtn.textContent = `Comments (${postData.comments.length})`;

    postBody.appendChild(time);
    postBody.appendChild(title);
    postBody.appendChild(message);
    reactionBtns.forEach(postBody.appendChild);
    postBody.appendChild(commentBtn);

    return postBody;
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

// function renderSinglePost(postData){
//     const singlePost = document.querySelector("#single-post");

// }

module.exports = {
    appendPost
};

},{}]},{},[2]);
