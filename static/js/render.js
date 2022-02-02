function renderDateString(timestamp){
    let date = new Date(parseInt(timestamp));
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${(date.getHours() % 12) + 1}:${("00" + date.getMinutes()).slice(-2)} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

function renderGiph(postData){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

    gifContainer.href = "#!";

    gif.classList.add('card-img-top');

    gif.setAttribute('alt', 'Image from Giphy');
    gif.src = postData.giphy;

    gifContainer.appendChild(gif);

    return gifContainer;
}

function renderReactions(postData){
    let reactionBtns = [
        ['👍', 'thumbs_up'],
        ['👎', 'thumbs_down'],
        ['❤', 'heart']
    ].map(emoji => {
        let btn = document.createElement('button');
        btn.classList.add('btn');
        if(localStorage.uid && postData.reactions[emoji[1]].includes(localStorage.uid)) {
            btn.classList.add('btn-dark');
        }else{
            btn.classList.add('btn-light');
        }
        btn.textContent = `${postData.reactions[emoji[1]].length} ${emoji[0]}`;
        return btn;
    });

    return reactionBtns;
}

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
    commentsBtn.setAttribute('data-pid', postData.pid);
    commentsBtn.textContent = `Comments (${postData.comments.length})`;
    commentsBtn.addEventListener('click', commentsBtnHandler);
    postBody.appendChild(commentsBtn);

    return postBody;
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

function renderComments(postData){
    // comments
    let comments = postData.comments.map(renderComment);

    return comments;
}

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

    // reactions
    let reactionBtns = content.querySelectorAll(".modal-body > button");
    for(let i = 0; i < reactionBtns.length; i++) {
        reactionBtns[i].parentElement.removeChild(reactionBtns[i]);
    }

    reactionBtns = renderReactions(postData);
    Array.from(reactionBtns).forEach(button => {
        message.insertAdjacentElement('afterend', button);
    });
  
    // comments
    let comments = content.querySelectorAll(".comment");
    for(let i = 0; i < comments.length; i++) {
        comments[i].parentElement.removeChild(comments[i]);
    }

    let commentForm = document.getElementById("comment-form");
    comments = renderComments(postData);
    comments.forEach(comment => {
        commentForm.insertAdjacentElement('beforebegin', comment);
    });

    // form
    form.message.value = "";
}

function clearPagination(){
    let pageLinks = document.querySelectorAll("#pagination > ul > li.page-item");

    for(let i = 0; i < pageLinks.length; i++){
        pageLinks[i].className = "page-item";
        pageLinks[i].firstElementChild.removeAttribute("aria-disabled");
        pageLinks[i].removeAttribute("aria-current");
    }
}

function renderPagination(postsData, currentPage, perPage){
    let totalPages = Math.ceil(postsData.length / perPage);
    let pageItems = document.querySelectorAll("#pagination > ul > li.page-item");
    let prevBtn = pageItems[0];
    let nextBtn = pageItems[pageItems.length - 1];

    clearPagination();
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

function commentsBtnHandler(e){
    let pid = e.target.getAttribute('data-pid');
    getPostData(pid, renderSinglePost);
}

async function getPostData(pid, callback){
    let response = await fetch(`http://localhost:3000/posts/${pid}`);
    let data = await response.json();
    callback(data);
}

module.exports = {
    renderGiph, renderPostBody, renderComments, renderPagination
};
