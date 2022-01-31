function appendPost(postData){
    let post = document.createElement("div");
    let gifContainer, gif;
    
    post.className = "post card mb-3";
    
    if(postData.giphy) {
        gifContainer = document.createElement("a");
        gif = document.createElement("img");

        // gif attr

        gifContainer.appendChild(gif);
        post.appendChild(gifContainer);
    }

    let postBody = document.createElement("div");

    postBody.className = "card-body";

    let time = document.createElement("div");
    let title = document.createElement("h2");
    let message = document.createElement("p");

    time.className = "small text-muted";
    title.className = "card-title";

    //to-do: 3 buttons and comments button
    
}
