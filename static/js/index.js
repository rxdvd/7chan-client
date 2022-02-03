const { pageLoadHandler, giphySearchHandler, postSubmitHandler, paginationBtnHandler, textareaHandler, postSortHandler, postFilterHandler, giphRemoveHandler } = require("./handlers");
const { getPaginationInfo } = require("./helpers");

function init() {
  const gifSearch = document.querySelector("#giphy-search");
  gifSearch.addEventListener("submit", giphySearchHandler);

  const postForm = document.querySelector("#post-form");
  postForm.addEventListener("submit", postSubmitHandler);

  const gifRemoveBtn = document.querySelector("#gif-remove-btn");
  gifRemoveBtn.addEventListener('click', giphRemoveHandler);

  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    textarea.addEventListener('keyup', textareaHandler);
  });

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
