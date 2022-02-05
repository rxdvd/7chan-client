# coderunner-client

<!-- badges -->
[![ISC license](https://img.shields.io/badge/License-ISC-blue.svg)](https://www.isc.org/licenses/)
[![GitHub latest commit](https://img.shields.io/github/last-commit/rxdvd/coderunner-client.svg)](https://github.com/rxdvd/coderunner-client/commit/)
[![GitHub forks](https://img.shields.io/github/forks/rxdvd/coderunner-client.svg)](https://github.com/rxdvd/coderunner-client)

Client-side for group project working on an anonymous community journaling website.

## Installation & Usage

1. Clone this repo using `git clone`
2. Enter the directory `cd coderunner-client`
3. Install dependencies `npm install`
   
* `npm start` to run the server using [`python http.server`](https://docs.python.org/3/library/http.server.html#http-server-cli)
* `npm test` to run tests contained in `test/` directory
* `npm run coverage` to check test coverage
* `npm run dev` to run the server with [`watchify`](https://www.npmjs.com/package/watchify) and `python http.server`
* `npm run bundle` to build a javascript bundle using [`browserify`](https://www.npmjs.com/package/browserify)

### Deployment

This client is currently deployed at https://coderunners.netlify.app/

## Project Goal

Build a website where users can anonymously post journal entries for other people to see, comment on and react to using emojis.

### Other Requirements:

* Message character limit
* Add gifs to messages using giphy

![gif of site in action](assets/hommer.gif)

## Design & Implementation

To design the web client we first found reference material by looking for websites with a similar purpose to our project goal and then came up with layout ideas drawing from those references.

### References

* [Everyday Sexism Project 🔗](https://everydaysexism.com/)
* [Twitter 🔗](https://twitter.com/)
* [Reddit 🔗](https://www.reddit.com/)
* [The Guardian 🔗](https://www.theguardian.com/)

### Technologies

* HTML
* CSS ([Bootstrap 🔗](https://getbootstrap.com/))
* JavaScript
* [Browserify 🔗](https://browserify.org/)
* [Jest 🔗](https://jestjs.io/)

### Layout

![Figma Design](assets/figma.png)

Design made using [Figma 🔗](https://www.figma.com/)

## Changelog

* Remaining character count under message input fields.
* Sort posts by newest, oldest, most reactions.
* Searchable tags on posts containing keywords
* Can remove selected gif after selecting.

## Fixed Bugs

- [x] Date display on posts showing the wrong time.
- [x] New posts display in the wrong order.
- [x] Sorting by oldest and newest shows posts in reverse order.
- [x] Changing page doesn't scroll to top of page.
- [x] Selecting a gif makes it disappear.
- [x] Emoji reactions on single post display in reverse order.
- [x] Posting a comment doesn't update comment count.
- [x] Text area can be resized.
- [x] Line breaks not showing up on posts and comments.

## Pitfalls & Discoveries

* Could not get the GIF previews in the search box to stack properly. The aim was for them to be tiled in a masonry style layout but it wasn't able to work in way such that elements could simply be appended and stacked automatically.
* You cannot pass the `.appendChild` method of an element directly into a function as the callback argument, it throws an illegal invocation error.
* Learned about new methods to make manipulating the DOM easier including `Element.insertAdjacentElement` and `Element.replaceChild`.
* An issue occurred where the JavaScript files being required were returning undefined. It turns out that the order that files are required is important for Browserify and functions cannot be required from files which require the file that it is being required from. This essentially gives the required file it's own scope in relation to the "parent".
* Putting a newline character `\n` into the `.textContent` of an element doesn't show the newline by default. The CSS property `white-space: pre;` must be set for those newlines to show.

#### Testing: Pitfalls & Discoveries

* Since an API request involves two promises, to test an API fetch request it is neccessary to define a mocked fetch function that handles both promises.

## Remaining Bugs

- [ ] The form for submitting a post doesn't reset properly after posting a message.
- [ ] Blank posts can be submitted but will be rejected by server.
- [ ] Blank comments can be posted.
- [ ] User ID number collision is still technically possible.

## Improvements & Future Features

* Expand the search feature to not only search tags but message content.
* Have the Giphy pop-up show trending GIFs on first load.
* Live post updates so new posts can be shown without having to refresh the page.

## License

[ISC License 🔗](https://www.isc.org/licenses/)
