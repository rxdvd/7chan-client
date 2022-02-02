const { pageLoadHandler, giphySearchHandler, postSubmitHandler, paginationBtnHandler, textareaHandler, postFilterHandler } = require("./handlers");
const { getPaginationInfo } = require("./helpers");

function init() {
  const gifSearch = document.querySelector("#giphy-search");
  gifSearch.addEventListener("submit", giphySearchHandler);

  const postForm = document.querySelector("#post-form");
  postForm.addEventListener("submit", postSubmitHandler);

  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    textarea.addEventListener('keyup', textareaHandler);
  });

  const filter = document.querySelector("#post-filter-select");
  filter.addEventListener('change', postFilterHandler);

  const pageBtns = document.querySelectorAll("#pagination > ul > li > a");
  pageBtns.forEach(pageBtn => {
    pageBtn.addEventListener('click', paginationBtnHandler);
  });
  
  const pageInfo = getPaginationInfo();
  pageLoadHandler(pageInfo.page, pageInfo.perPage, pageInfo.sortBy);
}

init();
