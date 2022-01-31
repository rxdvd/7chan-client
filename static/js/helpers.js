

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
        title: e.target.value,
        message: e.target.value,  
        giphy: e.target.value,
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

const submitcomment = async (e) => {
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
