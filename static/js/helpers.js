const { renderGiph, renderPostBody, renderPagination } = require("./render");

function clearPosts(){
  let posts = document.querySelectorAll('.post');
  Array.from(posts).forEach(post => {
    post.parentElement.removeChild(post);
  });
}

function appendPost(postData){
  const form = document.querySelector("#post-form");
  let post = document.createElement("article");
  let gif = postData.giphy && renderGiph(postData);
  let postBody = renderPostBody(postData);
  
  post.classList.add("post", "card", "mb-3");

  if(gif) {
    post.appendChild(gif);
  }

  post.appendChild(postBody);
  form.insertAdjacentElement('afterend', post);
}

function setPost(posts, page, perPage) {
  clearPosts();
  
  let totalPages = Math.ceil(posts.length / perPage);
  if(page > totalPages) page = 1;

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
  return {
    page: parseInt(query.page) || 1,
    perPage: Math.max(1, parseInt(query.perPage)) || 5
  }
}

module.exports = {
  setPost, appendPost, renderGif, parseURLQuery, getPaginationInfo
};
