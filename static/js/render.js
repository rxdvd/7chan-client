function renderDateString(date){
    let months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${(date.getHours() % 12) + 1} ${date.getHours() > 11 ? 'PM' : 'AM'}`;
}

function renderGiph(postData){
    let gifContainer = document.createElement("a");
    let gif = document.createElement("img");

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
        return btn;
    });

    return reactionBtns;
}

function renderPostBody(postData){
    let postBody = document.createElement("div");
    let time = document.createElement("div");
    let title = document.createElement("h2");
    let message = document.createElement("p");
    let reactionBtns = renderReactions(postData);
    let commentsBtn = document.createElement("button");

    postBody.classList.add("card-body");
    time.classList.add("small", "text-muted");
    title.classList.add("card-title");
    message.classList.add('card-text');
    commentsBtn.classList.add('btn', 'btn-outline-secondary');

    commentsBtn.setAttribute('href', '#!');
    commentsBtn.setAttribute('data-bs-toggle', 'modal');
    commentsBtn.setAttribute('data-bs-target', '#single-post');

    time.textContent = renderDateString(new Date(postData.time));
    title.textContent = postData.title;
    message.textContent = postData.message;
    commentsBtn.textContent = `Comments (${postData.comments.length})`;

    postBody.appendChild(time);
    postBody.appendChild(title);
    postBody.appendChild(message);
    reactionBtns.forEach(postBody.appendChild);
    postBody.appendChild(commentBtn);

    return postBody;
}

function appendPost(postData){
    const form = document.querySelector("#post-form");
    let post = document.createElement("div");
    let gif = postData.giphy && renderGiph(postData);
    let postBody = renderPostBody(postData);
    
    post.classList.add("post", "card", "mb-3");

    if(gif) {
        post.appendChild(gif);
    }

    post.appendChild(postBody);
    form.insertAdjacentElement('afterend', post);
}

module.exports = {
    appendPost
};
