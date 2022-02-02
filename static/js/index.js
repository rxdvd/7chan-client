const { pageLoadHandler, giphySearchHandler, postSubmitHandler, paginationBtnHandler, textareaHandler } = require("./handlers");
const { getPaginationInfo } = require("./helpers");

function init() {
  const postForm = document.querySelector("#post-form");
  const gifBtn = document.querySelector("#post-form #add-gif-btn");
  const gifSearch = document.querySelector("#giphy-search");
  const pageBtns = document.querySelectorAll("#pagination > ul > li > a");

  gifSearch.addEventListener("submit", giphySearchHandler);
  postForm.addEventListener("submit", postSubmitHandler);
  //   gifBtn.addEventListener("click", loadGiphy);

  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    textarea.addEventListener('keyup', textareaHandler);
  });

  pageBtns.forEach(pageBtn => {
    pageBtn.addEventListener('click', paginationBtnHandler);
  });
  
  const pageInfo = getPaginationInfo();
  pageLoadHandler(pageInfo.page, pageInfo.perPage);
}

init();
