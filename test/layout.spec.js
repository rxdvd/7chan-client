const fs = require('fs');
const html = fs.readFileSync(require.resolve('../public/index.html'), 'utf8');

describe('index.html', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    describe('head', () => {

    });

    describe('single post modal', () => {

    });

    describe('giphy modal', () => {

    });

    describe('nav bar', () => {

    });

    describe('header', () => {

    });

    describe('main content', () => {
        describe('info box', () => {

        });

        describe('post form', () => {

        });

        describe('posts', () => {

        });

        describe('pagination', () => {

        });
    });

    describe('footer', () => {

    });
});
