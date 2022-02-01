function renderDateString(timestamp){
    let date = new Date(parseInt(timestamp));
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${(date.getHours() % 12) + 1}:${("00" + date.getMinutes()).slice(-2)} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

function renderPostHeader(postData, modal=false){
    let heading = document.createElement(modal ? "h5" : "h2");

    heading.classList.add("card-title");
    heading.textContent = postData.title;

    if(modal) {
        let header = document.createElement("div");
        let closeBtn = document.createElement("button");

        header.classList.add("modal-header", "border-0", "pb-0");
        heading.classList.replace("card-title", "modal-title");
        closeBtn.classList.add("btn-close");

        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('data-bs-dismiss', 'modal');
        closeBtn.setAttribute('aria-label', 'Close');

        header.appendChild(heading);
        header.appendChild(closeBtn);
        
        return header;
    }

    return heading;
}

function renderGiph(postData, modal=false){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

    gifContainer.href = "#!";

    gif.classList.add('card-img-top');
    if(modal) {
        gif.classList.add('mb-1');
    }

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

function renderPostBody(postData, modal=false){
    let postBody = document.createElement("div");
    postBody.classList.add("card-body");

    let time = document.createElement("div");
    time.classList.add("small", "text-muted");
    time.textContent = renderDateString(postData.timestamp);
    postBody.appendChild(time);

    let message = document.createElement("p");
    message.classList.add('card-text');
    message.textContent = postData.message;
    postBody.appendChild(message);

    let reactionBtns = renderReactions(postData);
    reactionBtns.forEach(reaction => {
        postBody.appendChild(reaction);
    });

    if(modal){
        postBody.classList.replace("card-body", "modal-body");
        time.classList.add("mb-1", "text-end");
        message.classList.remove("card-text");
    } else {
        let title = renderPostHeader(postData);
        postBody.insertBefore(title, message);

        let commentsBtn = document.createElement("button");
        commentsBtn.classList.add('btn', 'btn-outline-secondary');
        commentsBtn.setAttribute('href', '#!');
        commentsBtn.setAttribute('data-bs-toggle', 'modal');
        commentsBtn.setAttribute('data-bs-target', '#single-post');
        commentsBtn.setAttribute('data-pid', postData.pid);
        commentsBtn.textContent = `Comments (${postData.comments.length})`;
        commentsBtn.addEventListener('click', commentsBtnHandler);
        postBody.appendChild(commentsBtn);
    }

    return postBody;
}

function renderCommentsForm(){
    let form = document.createElement("form");

    let formBody = document.createElement("div");
    formBody.classList.add("mb-3");
    form.appendChild(formBody);

    let label = document.createElement("label");
    label.classList.add("form-label", "fw-bold");
    label.setAttribute("for", "comment-form-message");
    label.textContent = "Post a comment:";
    formBody.appendChild(label);

    let textarea = document.createElement("textarea");
    textarea.classList.add("form-control");
    textarea.id = "comment-form-message";
    textarea.name = "message";
    textarea.placeholder = "Leave a comment...";
    textarea.rows = "3";
    formBody.appendChild(textarea);

    let submitBtn = document.createElement("button");
    submitBtn.classList.add("btn", "btn-primary");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    form.appendChild(submitBtn);

    return form;
}

function renderComment(commentData){
    let commentContainer = document.createElement("div");

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
    let container = document.createElement("div");
    container.classList.add("pt-3");

    // header
    let header = document.createElement("h5");
    header.classList.add("modal-title", "mb-2");
    header.textContent = "Comments";
    container.appendChild(header);

    // comments
    let comments = postData.comments.map(renderComment);
    comments.forEach(comment => {
        container.appendChild(comment);
    });

    // form
    let commentForm = renderCommentsForm();
    container.appendChild(commentForm);

    return container;
}

function clearPostModal(){
    const content = document.querySelector("#single-post .modal-content");
    content.innerHTML = "";
}

function showSinglePost(postData){
    clearPostModal();
  
    const content = document.querySelector("#single-post .modal-content");
  
    // modal header
    let header = renderPostHeader(postData, true);
    content.appendChild(header);
  
    // modal body
    let body = renderPostBody(postData, true);
    let gif = renderGiph(postData, true);
  
    body.insertAdjacentElement('afterbegin', gif);
    content.appendChild(body);
  
    // comments
    let comments = renderComments(postData);
    body.appendChild(comments);
}

function commentsBtnHandler(e){
    let pid = e.target.getAttribute('data-pid');
    getPostData(pid, showSinglePost);
}

async function getPostData(pid, callback){
    let response = await fetch(`http://localhost:3000/posts/${pid}`);
    let data = await response.json();
    callback(data);
}

module.exports = {
    renderGiph, renderPostBody, renderPostHeader, renderComments
};
