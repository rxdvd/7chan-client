(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
      title: e.target.value,
      message: e.target.value,
      giphy: e.target.value,
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
    gifs.forEach((gif) => appendGif(gif))

}

const getGiphs = async (e) => {
  e.preventDefault();
  const searchTerm = e.target.searchTerm.value.trim();
  let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=20&q=`;

  url = url.concat(searchTerm);
  const response = await fetch(url);
  const json = await response.json();
  const gifArr = json.data
  renderGif(gifArr)
  
};
const appendGif = (gif) => {

    const newImg = document.createElement("img");
    let gifUrl = gif.images.downsized.url
    newImg.src = gifUrl
    newImg.className = "giphy-preview mb-2"
    let modalBody = document.querySelector('#giphy-body')
    modalBody.insertAdjacentElement('afterbegin',newImg)
    

}

module.exports = {
  getAllPosts,
  submitPost,
  submitComment,
  getGiphs,
};

},{}],2:[function(require,module,exports){
const {getGiphs,submitPost} = require('./helpers')

function init() {
  const postForm = document.querySelector("#post-form");
  const gifBtn = document.querySelector("#post-form #add-gif-btn");
  const gifSearch = document.querySelector("#giphy-search");

  gifSearch.addEventListener("submit", getGiphs);

  postForm.addEventListener("submit", submitPost);
//   gifBtn.addEventListener("click", loadGiphy);
}

init();

},{"./helpers":1}]},{},[2]);
