function renderDateString(timestamp){
    let date = new Date(parseInt(timestamp));
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    let hours = date.getHours() % 12;
    if(hours === 0) hours = 12;
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${("00" + date.getMinutes()).slice(-2)} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

// Giphy
function renderPostGiph(postData){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

    gifContainer.href = "#!";

    gif.classList.add('card-img-top');

    gif.setAttribute('alt', 'Image from Giphy');
    gif.src = postData.giphy;

    gifContainer.appendChild(gif);

    return gifContainer;
}

function renderGiphyResult(gifData){
    let img = document.createElement("img");
    img.classList.add("giphy-preview", "mb-2");
    img.src = gifData.images.fixed_width_downsampled.url;
    img.addEventListener("click", giphClickHandler);
    return img;
}

function giphClickHandler(e){
  let selectedGif = e.target;
  const formImg = document.querySelector(".removable-gif > img");
  const giphyInput = document.querySelector("#giphy-input");

  formImg.src = selectedGif.src;
  giphyInput.value = selectedGif.src;

  formImg.parentElement.classList.remove("d-none");

  const closeBtn = document.querySelector("#giphy-body + .modal-footer > button");
  closeBtn.click();
};

// Reactions
function renderReactions(postData){
    let reactionBtns = [
        'thumbs_up', 'thumbs_down', 'heart'
    ].map(emoji => {
        return renderReactionBtn(postData, emoji);
    });

    return reactionBtns;
}

function renderReactionBtn(postData, emoji){
    let btn = document.createElement('button');
    btn.classList.add('btn');
    if(localStorage.uid && postData.reactions[emoji].includes(localStorage.uid)) {
        btn.classList.add('btn-dark');
    }else{
        btn.classList.add('btn-light');
    }
    btn.dataset.pid = postData.pid;
    btn.dataset.emoji = emoji;
    btn.addEventListener('click', reactionBtnHandler);

    let reactions = {
        thumbs_up: '👍',
        thumbs_down: '👎',
        heart: '❤'
    };
    btn.textContent = `${postData.reactions[emoji].length} ${reactions[emoji]}`;

    return btn;
}

function reactionBtnHandler(e){
    if(!localStorage.uid) {
        localStorage.uid = generateUID();
    }

    submitReaction(
        e.target.dataset.pid,
        e.target.dataset.emoji,
        localStorage.uid
    );
}

async function submitReaction(pid, emoji, uid){
    try {
        const reqBody = {
            emoji: emoji,
            uid: uid
        };

        const reqOptions = {
            method: "PATCH",
            body: JSON.stringify(reqBody),
            headers: { "Content-Type": "application/json" }
        };

        const response = await fetch(`${API_HOST}/posts/${pid}/emoji`, reqOptions);

        const data = await response.json();
        
        const reactionBtns = document.querySelectorAll(`.btn[data-pid='${pid}'][data-emoji='${emoji}']`);
        reactionBtns.forEach(btn => {
            let newBtn = renderReactionBtn(data, emoji);
            btn.parentElement.replaceChild(newBtn, btn);
        });
    } catch(err) {
        console.error(err);
    }
}

function generateUID(){
    let uid = "";
    while(uid.length < 10){
        uid += Math.floor(Math.random() * 10);
    }
    return uid;
}

// Single post display
function renderSinglePost(postData){
    const content = document.querySelector("#single-post .modal-content");
  
    // modal header
    let title = content.querySelector(".modal-header > .modal-title");
    title.textContent = postData.title;

    // gif
    let gif = content.querySelector("#single-post-gif");
    if(postData.giphy) {
        gif.src = postData.giphy;
        gif.classList.remove("d-none");
    } else {
        gif.classList.add("d-none");
    }
    
    // timestamp
    let timestamp = content.querySelector("#single-post-timestamp");
    timestamp.textContent = renderDateString(postData.timestamp);

    // message
    let message = content.querySelector("#single-post-msg");
    message.textContent = postData.message;

    // tags
    let tags = content.querySelector("#single-post-tags");
    tags.textContent = `Tags: ${postData.tags.join(", ")}`;

    // reactions
    let reactionBtns = content.querySelectorAll(".modal-body > button");
    for(let i = 0; i < reactionBtns.length; i++) {
        reactionBtns[i].parentElement.removeChild(reactionBtns[i]);
    }

    let commentsSection = tags.nextElementSibling;
    reactionBtns = renderReactions(postData);
    Array.from(reactionBtns).forEach(button => {
        commentsSection.insertAdjacentElement('beforebegin', button);
    });
  
    // comments
    let comments = content.querySelectorAll(".comment");
    for(let i = 0; i < comments.length; i++) {
        comments[i].parentElement.removeChild(comments[i]);
    }
    
    let commentForm = content.querySelector("#comment-form");
    commentForm.dataset.pid = postData.pid;

    let commentsHeader = commentForm.previousElementSibling;
    comments = postData.comments.map(renderComment);
    comments.forEach(comment => {
        commentsHeader.insertAdjacentElement('afterend', comment);
    });
}

function renderComment(commentData){
    let commentContainer = document.createElement("div");
    commentContainer.classList.add("comment");

    // timestamp
    let time = document.createElement("span");
    time.classList.add("comment-time", "small", "text-muted");
    time.textContent = renderDateString(commentData.timestamp);
    commentContainer.appendChild(time);

    // comment
    let commentBody = document.createElement("p");
    commentBody.classList.add("comment-body", "px-4");
    commentBody.textContent = commentData.comment;
    commentContainer.appendChild(commentBody);

    return commentContainer;
}

// Posts
function renderPostBody(postData){
    let postBody = document.createElement("div");
    postBody.classList.add("card-body");

    let time = document.createElement("div");
    time.classList.add("small", "text-muted");
    time.textContent = renderDateString(postData.timestamp);
    postBody.appendChild(time);

    let title = document.createElement("h2");
    title.classList.add("card-title");
    title.textContent = postData.title;
    postBody.appendChild(title);

    let message = document.createElement("p");
    message.classList.add('card-text');
    message.textContent = postData.message;
    postBody.appendChild(message);

    let reactionBtns = renderReactions(postData);
    reactionBtns.forEach(reaction => {
        postBody.appendChild(reaction);
    });

    let commentsBtn = document.createElement("button");
    commentsBtn.classList.add('btn', 'btn-outline-secondary');
    commentsBtn.setAttribute('href', '#!');
    commentsBtn.setAttribute('data-bs-toggle', 'modal');
    commentsBtn.setAttribute('data-bs-target', '#single-post');
    commentsBtn.dataset.pid = postData.pid;
    commentsBtn.textContent = `Comments (${postData.comments.length})`;
    commentsBtn.addEventListener('click', commentsBtnHandler);
    postBody.appendChild(commentsBtn);

    let tags = document.createElement("div");
    tags.classList.add("small", "text-muted", "text-end");
    tags.textContent = `Tags: ${postData.tags.join(", ")}`;
    postBody.appendChild(tags);

    return postBody;
}

function commentsBtnHandler(e){
    let pid = e.target.getAttribute('data-pid');
    getPostData(pid, renderSinglePost);
}

async function getPostData(pid, callback){
    let response = await fetch(`${API_HOST}/posts/${pid}`);
    let data = await response.json();
    callback(data);
}

module.exports = {
    renderPostGiph, renderGiphyResult, giphClickHandler, 
    renderPostBody, renderSinglePost, renderDateString,
    renderReactions, renderReactionBtn, reactionBtnHandler,
    generateUID, submitReaction, renderComment, getPostData
};
