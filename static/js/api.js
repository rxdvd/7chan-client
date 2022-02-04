const { 
    setPost, appendPost, setGif, sortPosts, 
    filterPosts, updateCommentCount, resetCommentForm 
} = require("./helpers");

const { renderSinglePost } = require("./render");

const getAllPosts = async (opts) => {
    try {
        const response = await fetch("https://coderunner-blog.herokuapp.com/posts");
        let data = await response.json();
        sortPosts(data, opts.sortBy);
        data = filterPosts(data);
        setPost(data, opts.page, opts.perPage); 
    } catch (err) {
        console.error(err);
    }
};

const submitPost = async (e) => {
    e.preventDefault();
    
    const form = e.target
    let tags = e.target.tags.value;
    tags = tags.length ? tags.split(",").map(tag => tag.trim()) : [];

    try {
        const postData = {
            title: e.target.title.value,
            message: e.target.message.value,
            giphy: e.target.giphy.value,
            tags: tags
        };

        const options = {
            method: "POST",
            body: JSON.stringify(postData),
            headers: { "Content-Type": "application/json" },
        };

        const response = await fetch("https://coderunner-blog.herokuapp.com/posts", options);

        const json = await response.json();

        appendPost(json); 
        form.reset()
    } catch (err) {
        console.error(err);
    }
};

const submitComment = async (pid, comment) => {
    try {
        const commentData = {
            comment: comment
        };

        const options = {
            method: "POST",
            body: JSON.stringify(commentData),
            headers: { "Content-Type": "application/json" }
        };
    
        const response = await fetch(
            `https://coderunner-blog.herokuapp.com/posts/${pid}/comments`,
            options
        );
    
        const json = await response.json();
    
        resetCommentForm();
        renderSinglePost(json);
        updateCommentCount(json);
        
    } catch (err) {
        console.error(err);
    }
};

const APIKEY = "TLvi8tf9k2z6WmKQm73BO1RIXRoaZzmL";
const getGiphs = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.searchTerm.value.trim();
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=20&q=`;
  
    url = url.concat(searchTerm);
    const response = await fetch(url);
    const json = await response.json();
    const gifArr = json.data;
    let modalBody = document.querySelector("#giphy-body");
    modalBody.innerHTML = ''
    setGif(gifArr);
    
};

module.exports = {
    getAllPosts, submitPost, submitComment, getGiphs
};
