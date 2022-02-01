const { renderGiph, renderPostBody } = require("./render");

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

function setPost(posts) {
  clearPosts();
  posts.forEach((post) => appendPost(post));
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
  setPost, appendPost, renderGif
};
