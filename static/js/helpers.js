const { renderGiph, renderPostBody, renderPagination } = require("./render");

function clearPosts(){
  let posts = document.querySelectorAll('.post');
  Array.from(posts).forEach(post => {
    post.parentElement.removeChild(post);
  });
}

function appendPost(postData){
  let post = document.createElement("article");
  let gif = postData.giphy && renderGiph(postData);
  let postBody = renderPostBody(postData);
  
  post.classList.add("post", "card", "mb-3");

  if(gif) {
    post.appendChild(gif);
  }

  post.appendChild(postBody);

  const sortBy = document.querySelector("#post-sort");
  sortBy.insertAdjacentElement('afterend', post);
}

function countReactions(postData){
  let count = 0;
  for(let emoji in postData.reactions) {
    count += postData.reactions[emoji].length;
  }
  return count;
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

function setPost(posts, page, perPage) {
  clearPosts();
  
  let totalPages = Math.ceil(posts.length / perPage);
  if(page > totalPages || page < 1) page = 1;

  posts
    .slice((page - 1) * perPage, page * perPage)
    .forEach(appendPost);

  renderPagination(posts, page, perPage);
}

const renderGif = (gifs) => {
  gifs.forEach((gif) => appendGif(gif));
};

const appendGif = (gif) => {
  let modalBody = document.querySelector("#giphy-body");
  const newImg = document.createElement("img");
  let gifUrl = gif.images.fixed_width_downsampled.url;
  newImg.src = gifUrl;
  newImg.className = "giphy-preview mb-2";
  modalBody.insertAdjacentElement("afterbegin", newImg);
  newImg.addEventListener("click", addGif);
};

const addGif = (e) => {
  let selectedGif = e.target;
  const thumbnailParent = document.querySelector(".removable-gif")
  thumbnailParent.innerHTML = ""
  thumbnailParent.appendChild(selectedGif)
  const giphyInput = document.querySelector("#giphy-input");
  giphyInput.value = selectedGif.src;
};

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

function getPaginationInfo(){
  let query = parseURLQuery();
  let sort = document.querySelector("#post-sort-select");
  return {
    page: parseInt(query.page) || 1,
    perPage: Math.max(1, parseInt(query.perPage)) || 5,
    sortBy: query.sortBy || sort.value
  }
}

function updateHistory(pageInfo){
  window.history.replaceState(
    pageInfo, 
    `Page ${pageInfo.page} - Coderunner`,
    `?page=${pageInfo.page}&perPage=${pageInfo.perPage}`
  );
}

module.exports = {
  setPost, appendPost, renderGif, parseURLQuery, getPaginationInfo, sortPosts, filterPosts, updateHistory
};
