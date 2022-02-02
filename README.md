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

## Design & Implementation

To design the web client we first found reference material by looking for websites with a similar purpose to our project goal and then came up with layout ideas drawing from those references.

### References

<!-- list of reference websites -->

### Technologies

* HTML
* CSS ([Bootstrap 🔗](https://getbootstrap.com/))
* JavaScript

### Layout

<!-- put design images here -->

## Changelog

* Remaining character count under message input fields.
* Sort posts by newest, oldest, most reactions.

## Fixed Bugs

- [x] Date display on posts showing the wrong time.
- [x] New posts display in the wrong order.
- [x] Sorting by oldest and newest shows posts in reverse order.

## Pitfalls & Discoveries

<!-- things you didn't know how to do, how you solved it i.e. any time you had to google -->

## Remaining Bugs



## Improvements & Future Features



## License

[ISC License 🔗](https://www.isc.org/licenses/)
