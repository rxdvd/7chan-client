const { renderPostGiph, renderPostBody, renderGiphyResult } = require("./render");

// Posts
function setPost(posts, page, perPage) {
  clearPosts();
  
  let totalPages = Math.ceil(posts.length / perPage);
  if(page > totalPages || page < 1) page = 1;

  posts
    .slice((page - 1) * perPage, page * perPage)
    .forEach(appendPost);

  clearPagination();
  updatePagination(posts, page, perPage);
}

function appendPost(postData){
  let post = document.createElement("article");
  let gif = postData.giphy && renderPostGiph(postData);
  let postBody = renderPostBody(postData);
  
  post.classList.add("post", "card", "mb-3");

  if(gif) {
    post.appendChild(gif);
  }

  post.appendChild(postBody);

  const sortBy = document.querySelector("#post-sort");
  sortBy.insertAdjacentElement('afterend', post);
}

function clearPosts(){
  let posts = document.querySelectorAll('.post');
  Array.from(posts).forEach(post => {
    post.parentElement.removeChild(post);
  });
}

function sortPosts(posts, sortBy){
  posts.sort((a, b) => {
    switch(sortBy){
      case 'old':
        return b.timestamp - a.timestamp;
      case 'emoji':
        return countReactions(a) - countReactions(b);
    }
    return a.timestamp - b.timestamp;
  });
}

function filterPosts(posts){
  const filter = document.querySelector("#post-filter");
  if(!filter.value.length) return posts;

  const tags = filter.value.split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length);
    
  return posts.filter(post => {
    // match all
    for(let i = 0; i < tags.length; i++){
      if(!post.tags.includes(tags[i])){
        return false;
      }
    }
    return true;
  });
}

function countReactions(postData){
  let count = 0;
  for(let emoji in postData.reactions) {
    count += postData.reactions[emoji].length;
  }
  return count;
}

// Giphy
const setGif = (gifs) => {
  gifs.forEach((gif) => appendGif(gif));
};

const appendGif = (gif) => {
  const modalBody = document.querySelector("#giphy-body");
  const newImg = renderGiphyResult(gif);
  modalBody.insertAdjacentElement("afterbegin", newImg);
};

// Comments
function resetCommentForm(){
  const commentForm = document.querySelector("#comment-form");
  commentForm.reset();
}

function updateCommentCount(postData){
  const commentBtn = document.querySelector(`button[href='#!'][data-pid='${postData.pid}']`);
  commentBtn.textContent = `Comments (${postData.comments.length})`;
}

// Pagination
function clearPagination(){
  let pageLinks = document.querySelectorAll("#pagination > ul > li.page-item");

  for(let i = 0; i < pageLinks.length; i++){
      pageLinks[i].className = "page-item";
      pageLinks[i].firstElementChild.removeAttribute("aria-disabled");
      pageLinks[i].removeAttribute("aria-current");
  }
}

function updatePagination(postsData, currentPage, perPage){
  let totalPages = Math.ceil(postsData.length / perPage);
  let pageItems = document.querySelectorAll("#pagination > ul > li.page-item");
  let prevBtn = pageItems[0];
  let nextBtn = pageItems[pageItems.length - 1];

  currentPage = parseInt(currentPage);

  // prev
  if (currentPage === 1) {
    prevBtn.classList.add("disabled");
    prevBtn.firstElementChild.setAttribute('aria-disabled', 'true');
  }
  prevBtn.firstElementChild.dataset.page = currentPage - 1;

  // next
  if (currentPage === totalPages) {
    nextBtn.classList.add("disabled");
    nextBtn.firstElementChild.setAttribute('aria-disabled', 'true');
  }
  nextBtn.firstElementChild.dataset.page = currentPage + 1;

  // pages
  let startPage = Math.min(Math.max(1, totalPages - 4), Math.max(1, currentPage - 2));

  for(let i = 1; i < pageItems.length - 1; i++){
    let pageBtn = pageItems[i];

    if(i === currentPage) {
      pageBtn.classList.add("active");
      pageBtn.setAttribute('aria-current', 'page');
    }

    let pageNumber = startPage + i - 1;

    if(pageNumber > totalPages) {
      pageBtn.classList.add("d-none");
    }
    pageBtn.firstElementChild.textContent = pageNumber;
    pageBtn.firstElementChild.dataset.page = pageNumber;
  }
}

function getPaginationInfo(){
  let query = parseURLQuery();
  let sort = document.querySelector("#post-sort-select");
  return {
    page: parseInt(query.page) || 1,
    perPage: Math.max(1, parseInt(query.perPage)) || 5,
    sortBy: query.sortBy || sort.value
  }
}

// Misc.
function parseURLQuery(){
  let query = location.search.slice(1);
  
  // handle empty query
  if(!query) {
    return "";
  }

  let splitQuery = query.split('&').map(keyValue => keyValue.split("=").map(decodeURIComponent));

  let parsedQuery = {};
  splitQuery.forEach(keyValue => {
    if(keyValue.length === 2) {
      parsedQuery[keyValue[0]] = keyValue[1].replace(/\+/g, ' ');
    }
  });

  return parsedQuery;
}

function updateHistory(pageInfo){
  window.history.replaceState(
    pageInfo, 
    `Page ${pageInfo.page} - Coderunner`,
    `?page=${pageInfo.page}&perPage=${pageInfo.perPage}`
  );
}

module.exports = {
  setPost, appendPost, setGif, parseURLQuery, 
  getPaginationInfo, sortPosts, filterPosts, 
  updateHistory, updateCommentCount, resetCommentForm
};
