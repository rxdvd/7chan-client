
function init(){
    const postForm = document.querySelector("#post-form");
    const gifBtn = document.querySelector("#post-form #add-gif-btn");

    postForm.addEventListener('submit', submitForm);
    gifBtn.addEventListener('click', loadGiphy);
}

// init();
