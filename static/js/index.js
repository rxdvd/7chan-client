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
