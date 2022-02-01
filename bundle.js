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
function appendPost(postData){
    let post = document.createElement("div");
    let gifContainer, gif;
    
    post.className = "post card mb-3";
    
    if(postData.giphy) {
        gifContainer = document.createElement("a");
        gif = document.createElement("img");

        // gif attr

        gifContainer.appendChild(gif);
        post.appendChild(gifContainer);
    }

    let postBody = document.createElement("div");

    postBody.className = "card-body";

    let time = document.createElement("div");
    let title = document.createElement("h2");
    let message = document.createElement("p");
    let thumbsUpBtn = document.createElement("button");
    let thumbsDownBtn = document.createElement("button");
    let heartBtn = document.createElement("button");

    time.className = "small text-muted";
    title.className = "card-title";

    //to-do: 3 buttons and comments button
    
}

module.exports = {
    appendPost
};

},{}]},{},[2]);
