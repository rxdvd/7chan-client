const { appendPost } = require("./render");

const APIKEY = "TLvi8tf9k2z6WmKQm73BO1RIXRoaZzmL"
const getAllPosts = async () => {
  try {
    const response = await fetch("http://localhost:3000/posts");
    const data = await response.json();
    setPost(data); // function that iterates through post data
  } catch (err) {
    console.error(err);
  }
};

function setPost(posts) {
    posts.forEach((post) => appendPost(post));
}

const submitPost = async (e) => {
    e.preventDefault();
  
    try {

      const postData = {
        title: e.target.title.value,
        message: e.target.message.value,  
        giphy: e.target.giphy.value,
      };
  
      const options = {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      };
  
      const response = await fetch("http://localhost:3000/posts", options);
  
      const json = await response.json();
  
      appendPost(json); //create function that appends data in specified format created
    } catch (err) {
      console.error(err);
    }
};

const submitComment = async (e) => {
    e.preventDefault();

    // pass post id through and use as url param 
    const pid= e.target.value
    try {

      const commentData = {
        message: e.target.value,  
        time: e.target.value, // create function that get time of request
      };
  
      const options = {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: { "Content-Type": "application/json" },
      };
  
      const response = await fetch(`http://localhost:3000/posts/${pid}/comments`, options);
  
      const json = await response.json();
  
      appendComments(json); //create function that appends comments data in specified format created
    } catch (err) {
      console.error(err);
    }
};





const getGiphs = async (e) => {
    e.preventDefault();
    console.log(e)
    // const gifInput = document.querySelector("#giphy-search")
    // console.log(gifInput.value)
    // let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}`

}

module.exports =  {
    getAllPosts,
    submitPost,
    submitComment,
    getGiphs
}
