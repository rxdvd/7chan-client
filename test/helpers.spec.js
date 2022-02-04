/**
 * @jest-environment jsdom
 */

 const helpers = require("../static/js/helpers");

 describe('render functions', () => {
    const testData = {
        "pid": "6",
        "title": "Testing with jest",
        "message": "This is a post written for the purpose of testing the javascript that helps this site to function.",
            "giphy": "https://media0.giphy.com/media/r7riLSvkCAgSI/200w_d.gif?cid=5c258309bovvidfs0bsa9v66b0dmciomj7pxv53mz9jzg4xm&rid=200w_d.gif&ct=g", 
            "comments": [
                {
                    "cid": 0, 
                    "comment": "This is a test comment.", 
                    "timestamp": 1643899879866
            }
        ], 
        "reactions": { 
            "thumbs_up": ["4876359325"], 
            "thumbs_down": ["4876359325"], 
            "heart": [] 
        }, 
        "tags": [
            "jest", 
            "testing", 
            "javascript"
        ], 
        "timestamp": 1643899841132
    };

    describe('appendPost', () => {
        document.documentElement.innerHTML = '<div><div id="post-sort"></div></div>';
        helpers.appendPost(testData);
        let element = document.querySelector("#post-sort + article");

        it('appends <article> element', () => {
            expect(element).toBeTruthy();
        });

        it('<article> element has correct classes', () => {
            expect(element.classList).toMatchObject({
                '0': 'post',
                '1': 'card',
                '2': 'mb-3'
            });
        });

        it('<article> has 2 children', () => {
            expect(element.children).toHaveLength(2);
        });

        it('first child is <a> tag', () => {
            expect(element.children[0].tagName).toBe('A');
        });

        it('second child is <div> tag with class card-body', () => {
            expect(element.children[1].tagName).toBe('DIV');
            expect(element.children[1].classList.contains('card-body')).toBe(true);
        });
    });

    describe('clearPosts', () => {
        document.documentElement.innerHTML = '<div id="container"><div class="post"></div><div class="post"></div><div class="post"></div></div>';
        let container = document.querySelector("#container");
        helpers.clearPosts();

        it('removes all posts', () => {
            expect(container.children).toHaveLength(0);
        });
    });

    describe('sortPosts', () => {
        let stub = [
            {
                timestamp: 0,
                reactions: {
                    thumbs_up: [1, 2, 3],
                    thumbs_down: [2],
                    heart: []
                }
            },
            {
                timestamp: 1,
                reactions: {
                    thumbs_up: [1, 2, 3, 4],
                    thumbs_down: [1, 2, 3, 4],
                    heart: [1, 2, 3, 4]
                }
            },
            {
                timestamp: 2,
                reactions: {
                    thumbs_up: [1, 2],
                    thumbs_down: [1, 2, 3, 4],
                    heart: [1]
                }
            }
        ];
        it('sorts by newest', () => {
            helpers.sortPosts(stub, 'new');
            expect(stub[0].timestamp).toBe(2);
        });
        it('sorts by oldest', () => {
            helpers.sortPosts(stub, 'old');
            expect(stub[0].timestamp).toBe(0);
        });
        it('sorts by most reactions', () => {
            helpers.sortPosts(stub, 'emoji');
            expect(stub[0].timestamp).toBe(1);
        });
    });

    describe('filterPosts', () => {
        let posts = [
            { tags: [ "1", "2", "3" ] },
            { tags: [ "2", "3" ] },
            { tags: [ "3" ] }
        ];
        it('matches none if no posts contain every search tag', () => {
            document.documentElement.innerHTML = '<input id="post-filter" value="1,2,4"></div>';
            let output = helpers.filterPosts(posts);
            expect(output).toHaveLength(0);
        });

        it('matches posts with tags that contain a specified tag', () => {
            document.documentElement.innerHTML = '<input id="post-filter" value="2"></div>';
            let output = helpers.filterPosts(posts);
            expect(output).toHaveLength(2);
        });

        it('matches posts with multiple tags specified', () => {
            document.documentElement.innerHTML = '<input id="post-filter" value="2,3"></div>';
            let output = helpers.filterPosts(posts);
            expect(output).toHaveLength(2);
        });

        it('matches all posts if all posts have specified tag', () => {
            document.documentElement.innerHTML = '<input id="post-filter" value="3"></div>';
            let output = helpers.filterPosts(posts);
            expect(output).toHaveLength(3);
        });
    });

    describe('countReactions', () => {
        it('returns correct number of reactions', () => {
            let count = helpers.countReactions(testData);
            expect(count).toBe(2);
        });
    });

    describe('appendGif', () => {

    });

    describe('resetCommentForm', () => {
        it('clears comment form', () => {
            document.documentElement.innerHTML = '<form id="comment-form"><div><textarea name="message" value="12345"></textarea></div></form>';
            helpers.resetCommentForm();
            let textarea = document.querySelector('textarea');
            expect(textarea.value).toBe("");
        });
    });

    describe('updateCommentCount', () => {
        it('updates count to the correct number', () => {
            document.documentElement.innerHTML = '<button href="#!" data-pid="6"></button>';
            helpers.updateCommentCount(testData);
            let button = document.querySelector('button');
            expect(button.textContent).toBe(`Comments (${testData.comments.length})`);
        });
    });

    describe('clearPagination', () => {
        it('sets pagination links to the correct class and attributes', () => {
            document.documentElement.innerHTML = '<nav id="pagination"><ul><li class="page-item btn" aria-current="page"><a aria-disabled="true"></a></li><li class="page-item d-none"><a aria-disabled="true"></a></li><li class="page-item w-45"><a aria-disabled="true"></a></li><li class="page-item me-3"><a aria-disabled="true"></a></li><li class="page-item"><a aria-disabled="true"></a></li></ul></nav>';
            helpers.clearPagination();
            let pageLinks = document.querySelectorAll("#pagination > ul > li.page-item");
            pageLinks.forEach(link => {
                expect(link.hasAttribute('aria-current')).toBe(false);
                expect(link.firstElementChild.hasAttribute('aria-disabled')).toBe(false);
                expect(link.classList).toMatchObject({
                    '0': 'page-item'
                });
            });
        });
    });

    describe('updatePagination', () => {
        const postsData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        beforeEach(() => {
            document.documentElement.innerHTML = '<nav id="pagination" aria-label="Pagination"><ul class="pagination justify-content-center my-4"><li class="page-item disabled"><a class="page-link" aria-disabled="true" data-page="0">Prev</a></li><li class="page-item active" aria-current="page"><a class="page-link" data-page="1">1</a></li><li class="page-item d-none"><a class="page-link" data-page="2">2</a></li><li class="page-item d-none"><a class="page-link" data-page="3">3</a></li><li class="page-item d-none"><a class="page-link" data-page="4">4</a></li><li class="page-item d-none"><a class="page-link" data-page="5">5</a></li><li class="page-item"><a class="page-link" id="Next_page"data-page="2">Next</a></li></ul></nav>';
        });

        it('displays correct numbers for beginning of pages', () => {
            helpers.updatePagination(postsData, 2, 1);
            let items = document.querySelectorAll('li.page-item');
            let expectedPages = [1, 2, 3, 4, 5];
            for(let i = 1; i <= 5; i++){
                expect(items[i].textContent).toBe(expectedPages[i - 1].toString());
                expect(items[i].firstElementChild.dataset.page).toBe(expectedPages[i - 1].toString());
            }
        });

        it('displays correct numbers for end of pages', () => {
            helpers.updatePagination(postsData, 14, 1);
            let items = document.querySelectorAll('li.page-item');
            let expectedPages = [11, 12, 13, 14, 15];
            for(let i = 1; i <= 5; i++){
                expect(items[i].textContent).toBe(expectedPages[i - 1].toString());
                expect(items[i].firstElementChild.dataset.page).toBe(expectedPages[i - 1].toString());
            }
        });

        it('current page has correct class and attributes', () => {
            helpers.updatePagination(postsData, 3, 3);
            let items = document.querySelectorAll('li.page-item');
            expect(items[3].classList.contains("active")).toBe(true);
            expect(items[3].getAttribute("aria-current")).toBe("page");
        });

        it('blank pages are hidden', () => {
            helpers.updatePagination(postsData, 1, 5);
            let items = document.querySelectorAll('li.page-item');
            expect(items[4].classList.contains("d-none")).toBe(true);
        });

        it('prev is disabled if on first page', () => {
            helpers.updatePagination(postsData, 1, 5);
            let items = document.querySelectorAll('li.page-item');
            expect(items[0].classList.contains("disabled")).toBe(true);
            expect(items[0].firstElementChild.getAttribute("aria-disabled")).toBe("true");
        });

        it('prev link has correct text', () => {
            helpers.updatePagination(postsData, 3, 5);
            let items = document.querySelectorAll('li.page-item');
            expect(items[0].textContent).toBe("Prev");
        });

        it('next is disabled if on last page', () => {
            helpers.updatePagination(postsData, 3, 5);
            let items = document.querySelectorAll('li.page-item');
            expect(items[6].classList.contains("disabled")).toBe(true);
            expect(items[6].firstElementChild.getAttribute("aria-disabled")).toBe("true");
        });

        it('next link has correct text', () => {
            helpers.updatePagination(postsData, 3, 5);
            let items = document.querySelectorAll('li.page-item');
            expect(items[6].textContent).toBe("Next");
        });
    });

    describe('getPaginationInfo', () => {
        beforeEach(() => {
            delete window.location;
            window.location = Object.create(window);
            window.location.search = '?';
        });
        it('correct defaults', () => {
            document.documentElement.innerHTML = '<input type="hidden" id="post-sort-select" value="new">';
            let output = helpers.getPaginationInfo();
            expect(output).toMatchObject({
                page: 1,
                perPage: 5,
                sortBy: 'new'
            });
        });

        it('changes with input element', () => {
            document.documentElement.innerHTML = '<input type="hidden" id="post-sort-select" value="old">';
            let output = helpers.getPaginationInfo();
            expect(output).toMatchObject({
                page: 1,
                perPage: 5,
                sortBy: 'old'
            });
        });

        it('sets page according to url query', () => {
            window.location = {
                search: '?page=2'
            };
            document.documentElement.innerHTML = '<input type="hidden" id="post-sort-select" value="new">';
            let output = helpers.getPaginationInfo();
            expect(output).toMatchObject({
                page: 2,
                perPage: 5,
                sortBy: 'new'
            });
        });

        it('sets page according to url query', () => {
            window.location = {
                search: '?perPage=2'
            };
            document.documentElement.innerHTML = '<input type="hidden" id="post-sort-select" value="new">';
            let output = helpers.getPaginationInfo();
            expect(output).toMatchObject({
                page: 1,
                perPage: 2,
                sortBy: 'new'
            });
        });

        it('sets sortBy according to url query', () => {
            window.location = {
                search: '?sortBy=emoji'
            };
            document.documentElement.innerHTML = '<input type="hidden" id="post-sort-select" value="new">';
            let output = helpers.getPaginationInfo();
            expect(output).toMatchObject({
                page: 1,
                perPage: 5,
                sortBy: 'emoji'
            });
        });
    });

    describe('parseURLQuery', () => {
        beforeEach(() => {
            delete window.location;
            window.location = Object.create(window);
            window.location.search = '?';
        });
        it.each([
            ['?foo=1&bar=5&baz=5', {foo: '1', bar: '5', baz: '5'}],
            ['?', ''],
            ['?foo=36', {foo: '36'}],
            ['?foo=3&bar=4&baz=7', {foo: '3', bar: '4', baz: '7'}],
            ['?bar=1&baz=test', {bar: '1', baz: 'test'}],
        ])('%s -> %p', (query, obj) => {
            window.location.search = query;
            let output = helpers.parseURLQuery();
            expect(JSON.stringify(output)).toBe(JSON.stringify(obj));
        });
    });
 });
