const {getGiphs,submitPost} = require('./helpers')

function init() {
  const postForm = document.querySelector("#post-form");
  const gifBtn = document.querySelector("#post-form #add-gif-btn");
  const gifSearch = document.querySelector("#giphy-search");

  gifSearch.addEventListener("submit", getGiphs);

  postForm.addEventListener("submit", submitPost);
  gifBtn.addEventListener("click", loadGiphy);
}

init();
