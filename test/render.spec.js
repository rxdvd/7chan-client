/**
 * @jest-environment jsdom
 */

const render = require("../static/js/render");
const giphyData = require("./giphy_sample.json");

describe.skip('render functions', () => {
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

    describe('renderDateString', () => {
        it.each([
            [1412559405989, "October 6, 2014 1:36 AM"],
            [1101707166800, "November 29, 2004 5:46 AM"],
            [561700178392, "October 20, 1987 3:49 AM"],
            [1244374527221, "June 7, 2009 11:35 AM"],
            [846911688426, "November 2, 1996 5:14 AM"],
            [1345713325961, "August 23, 2012 9:15 AM"],
            [1131330583265, "November 7, 2005 2:29 AM"],
            [969651372471, "September 22, 2000 7:36 PM"],
            [testData.timestamp, "February 3, 2022 2:50 PM"],
            [testData.comments[0].timestamp, "February 3, 2022 2:51 PM"]
        ])('%i -> %s', (time, output) => {
            const dateString = render.renderDateString(time);
            expect(dateString).toBe(output);
        });
    });

    describe('generateUID', () => {
        let output = [];
        for(let i = 0; i < 10; i++){
            output.push(render.generateUID());
        }

        it.each(output)('returns a string of length 10', (string) => {
            expect(string).toHaveLength(10);
        });

        it.each(output)('returns a string containing only numeric characters', (string) => {
            expect(Number(string)).not.toBeNaN();
        });
    });

    describe('Giphy', () => {
        describe('renderPostGiph', () => {
            let element = render.renderPostGiph(testData);

            it('<a> element returned', () => {
                expect(element.tagName).toBe('A');
            });

            it('return element has href of #!', () => {
                expect(element.getAttribute('href')).toBe('#!');
            });

            it('return element has single child', () => {
                expect(element.children.length).toBe(1);
            });

            it('return element has child of <img>', () => {
                expect(element.children[0].tagName).toBe('IMG');
            });

            it('<img> child has class card-img-top', () => {
                expect(element.children[0].classList.contains('card-img-top')).toBe(true);
            });

            it('<img> child has alt of Image from Giphy', () => {
                expect(element.children[0].alt).toBe('Image from Giphy');
            });
        });

        describe('renderGiphyResult', () => {
            let element = render.renderGiphyResult(giphyData.data[0]);

            it('<img> element returned', () => {
                expect(element.tagName).toBe('IMG');
            });

            it('return element has correct classes', () => {
                expect(element.classList.contains('giphy-preview')).toBe(true);
                expect(element.classList.contains('mb-2')).toBe(true);
            });

            it('return element has correct src', () => {
                expect(element.src).toBe(giphyData.data[0].images.fixed_width_downsampled.url);
            });
        });

        describe('giphClickHandler', () => {
            const mockEvent = {
                target: {
                    src: giphyData.data[0].images.fixed_width_downsampled.url
                }
            };
            document.documentElement.innerHTML = '<div class="removable-gif"><img></div><input id="giphy-input"><div id="giphy-body"></div><div class="modal-footer"><button onClick="mockHandler()"></button></div>';
            const closeBtn = document.querySelector("#giphy-body + .modal-footer > button");
            closeBtn.click = jest.fn();
            render.giphClickHandler(mockEvent);

            it('close button clicked', () => {
                expect(closeBtn.click).toHaveBeenCalled();
            });

            it('form image has correct src', () => {
                const formImg = document.querySelector(".removable-gif > img");
                expect(formImg.src).toBe(mockEvent.target.src);
            });

            it('form image not hidden', () => {
                const imgContainer = document.querySelector(".removable-gif");
                expect(imgContainer.classList.contains('d-none')).toBe(false);
            });

            it('form input has correct value', () => {
                const giphyInput = document.querySelector("#giphy-input");
                expect(giphyInput.value).toBe(mockEvent.target.src);
            });
        });
    });

    describe('Reactions', () => {
        describe('renderReactions', () => {
            let elements = render.renderReactions(testData);

            it('array returned', () => {
                expect(Array.isArray(elements)).toBe(true);
            });
        });

        describe('renderReactionBtn', () => {
            let element = render.renderReactionBtn(testData, 'thumbs_up');

            it('returns <button> element', () => {
                expect(element.tagName).toBe('BUTTON');
            });

            it('button has correct data-pid attribute', () => {
                expect(element.dataset.pid).toBe('6');
            });

            it('button has correct data-emoji attribute', () => {
                expect(element.dataset.emoji).toBe('thumbs_up');
            });

            it('button has correct textContent', () => {
                expect(element.textContent).toBe('1 👍');
            });

            it('button has correct classes for empty localStorage', () => {
                global.localStorage.removeItem('uid');
                expect(element.classList).toMatchObject({
                    '0': 'btn',
                    '1': 'btn-light'
                });
            });

            it('button has correct classes for valid localStorage', () => {
                global.localStorage.uid = testData.reactions['thumbs_up'][0];
                let element = render.renderReactionBtn(testData, 'thumbs_up');
                expect(element.classList).toMatchObject({
                    '0': 'btn',
                    '1': 'btn-dark'
                });
            });
        });

        describe('submitReaction', () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve(testData),
                })
            );
            render.submitReaction(testData, 'thumbs_up', testData.reactions['thumbs_up'][0]);

            it('makes request to add/remove reaction', () => {
                expect(global.fetch).toHaveBeenCalled();
            });
        });

        describe('reactionBtnHandler', () => {
            let mockEvent = {
                target: {
                    dataset: {
                        pid: "6",
                        emoji: "thumbs_up"
                    }
                }
            };
            render.reactionBtnHandler(mockEvent);

            it('generates localStorage.uid if it does not exist', () => {
                expect(global.localStorage.uid).toBeTruthy();
            });
        });
    });

    describe('renderSinglePost', () => {
        let content;

        beforeEach(() => {
            document.documentElement.innerHTML = '<div id="single-post" class="modal fade" tabindex="-1" style="display: none;" aria-hidden="true"><div class="modal-dialog modal-dialog-scrollable"><div class="modal-content"><div class="modal-header border-0 pb-0"><h5 class="modal-title"></h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><a href="#!"><img class="card-img-top mb-3 d-none" id="single-post-gif" src="" alt="Image from Giphy"></a><div class="small text-muted mb-1 text-end" id="single-post-timestamp">February 3, 2022 5:56 PM</div><p id="single-post-msg"></p><div id="single-post-tags" class="small text-muted mb-2">Tags: javascript</div><button class="btn btn-light" data-pid="1" data-emoji="thumbs_up">0 👍</button><button class="btn btn-light" data-pid="1" data-emoji="thumbs_down">0 👎</button><button class="btn btn-light" data-pid="1" data-emoji="heart">0 ❤</button><div class="pt-3"><h5 class="modal-title mb-2">Comments</h5><div class="comment"><span class="comment-time small text-muted">February 3, 2022 5:56 PM</span><p class="comment-body px-4">test</p></div><form id="comment-form" data-pid="1"><div class="mb-3"><label for="comment-form-message" class="form-label fw-bold">Post a comment:</label><textarea class="form-control" id="comment-form-message" name="message" placeholder="Leave a comment..." rows="3"></textarea><div class="small text-muted">415 characters remaining</div></div><button type="submit" class="btn btn-primary">Submit</button></form></div></div></div></div></div>';
            render.renderSinglePost(testData);
            content = document.querySelector("#single-post .modal-content");
        });

        it('title is correct', () => {
            let title = content.querySelector(".modal-header > .modal-title");
            expect(title.textContent).toBe(testData.title);
        });

        it('gif has correct src', () => {
            let gif = content.querySelector("#single-post-gif");
            expect(gif.src).toBe(testData.giphy);
        });

        it('gif has correct class for truthy giphy property', () => {
            let gif = content.querySelector("#single-post-gif");
            expect(gif.classList.contains('d-none')).toBe(false);
        });

        it('gif has correct class for falsy giphy property', () => {
            let gif = content.querySelector("#single-post-gif");
            let falsyGif = testData;
            falsyGif.giphy = "";
            render.renderSinglePost(falsyGif);
            expect(gif.classList.contains('d-none')).toBe(true);
        });

        it('timestamp is correct', () => {
            let timestamp = content.querySelector("#single-post-timestamp");
            expect(timestamp.textContent).toBe("February 3, 2022 2:50 PM");
        });

        it('message is correct', () => {
            let message = content.querySelector("#single-post-msg");
            expect(message.textContent).toBe(testData.message);
        });

        it('tags are correct', () => {
            let tags = content.querySelector("#single-post-tags");
            expect(tags.textContent).toBe(`Tags: ${testData.tags.join(", ")}`);
        });

        it('reactions have correct data-pid attribute', () => {
            let reactionBtns = content.querySelectorAll(".modal-body > button");
            reactionBtns.forEach(btn => {
                expect(btn.dataset.pid).toBe("6");
            });
        });

        it('reactions have correct data-emoji attribute', () => {
            let reactionBtns = content.querySelectorAll(".modal-body > button");
            for(let i = 0; i < 3; i++){
                expect(reactionBtns[i].dataset.emoji).toBe([
                    'thumbs_up', 'thumbs_down', 'heart'
                ][i]);
            }
        });

        it('reactions have correct textContent', () => {
            let reactionBtns = content.querySelectorAll(".modal-body > button");
            // encodeURIComponent turns emoji into readable characters
            expect(encodeURIComponent(reactionBtns[0].textContent)).toBe(encodeURIComponent('1 👍'));
            expect(encodeURIComponent(reactionBtns[1].textContent)).toBe(encodeURIComponent('1 👎'));
            expect(encodeURIComponent(reactionBtns[2].textContent)).toBe(encodeURIComponent('0 ❤'));
        });

        it('number of comments is correct', () => {
            let comments = content.querySelectorAll(".comment");
            expect(comments).toHaveLength(1);
        });

        it('comment form has correct data-pid attribute', () => {
            let commentForm = content.querySelector("#comment-form");
            expect(commentForm.dataset.pid).toBe(testData.pid);
        });
    });

    describe('renderComment', () => {
        let comment = render.renderComment(testData.comments[0]);

        it('returns <div> tag', () => {
            expect(comment.tagName).toBe('DIV');
        });

        it('return element has correct class', () => {
            expect(comment.classList.contains("comment")).toBe(true);
        });

        it('return element has two children', () => {
            expect(comment.children).toHaveLength(2);
        });

        it('first child is <span> tag', () => {
            expect(comment.children[0].tagName).toBe('SPAN');
        });

        it('<span> has correct classes', () => {
            expect(comment.children[0].classList).toMatchObject({
                '0': 'comment-time',
                '1': 'small',
                '2': 'text-muted'
            });
        });

        it('<span> has correct textContent', () => {
            expect(comment.children[0].textContent).toBe("February 3, 2022 2:51 PM");
        });

        it('second child is <p> tag', () => {
            expect(comment.children[1].tagName).toBe('P');
        });

        it('<p> has correct classes', () => {
            expect(comment.children[1].classList).toMatchObject({
                '0': 'comment-body',
                '1': 'px-4'
            });
        });

        it('<p> has correct textContent', () => {
            expect(comment.children[1].textContent).toBe(testData.comments[0].comment);
        });
    });

    describe('renderComment', () => {
        let post = render.renderPostBody(testData);

        it('returns <div> tag', () => {
            expect(post.tagName).toBe('DIV');
        });

        it('return element has correct class', () => {
            expect(post.classList.contains("card-body")).toBe(true);
        });

        it('return element has six children', () => {
            expect(post.children).toHaveLength(8);
        });

        it('first child is <div> tag', () => {
            expect(post.children[0].tagName).toBe('DIV');
        });

        it('<div> has correct classes', () => {
            expect(post.children[0].classList).toMatchObject({
                '0': 'small',
                '1': 'text-muted'
            });
        });

        it('<div> has correct textContent', () => {
            expect(post.children[0].textContent).toBe("February 3, 2022 2:50 PM");
        });

        it('second child is <h2> tag', () => {
            expect(post.children[1].tagName).toBe('H2');
        });

        it('<h2> has correct classes', () => {
            expect(post.children[1].classList).toMatchObject({
                '0': 'card-title'
            });
        });

        it('<h2> has correct textContent', () => {
            expect(post.children[1].textContent).toBe(testData.title);
        });

        it('third child is <p> tag', () => {
            expect(post.children[2].tagName).toBe('P');
        });

        it('<p> has correct classes', () => {
            expect(post.children[2].classList).toMatchObject({
                '0': 'card-text'
            });
        });

        it('<p> has correct textContent', () => {
            expect(post.children[2].textContent).toBe(testData.message);
        });

        it('child 4, 5, 6, 7 are <button> tags', () => {
            expect(post.children[3].tagName).toBe('BUTTON');
            expect(post.children[4].tagName).toBe('BUTTON');
            expect(post.children[5].tagName).toBe('BUTTON');
            expect(post.children[6].tagName).toBe('BUTTON');
        });

        it('7th child <button> has correct classes', () => {
            expect(post.children[6].classList).toMatchObject({
                '0': 'btn',
                '1': 'btn-outline-secondary'
            });
        });

        it('7th child <button> has correct attributes', () => {
            expect(post.children[6].getAttribute('href')).toBe('#!');
            expect(post.children[6].getAttribute('data-bs-toggle')).toBe('modal');
            expect(post.children[6].getAttribute('data-bs-target')).toBe('#single-post');
            expect(post.children[6].dataset.pid).toBe(testData.pid);
        });

        it('7th child <button> has correct textContent', () => {
            expect(post.children[6].textContent).toBe(`Comments (${testData.comments.length})`);
        });

        it('8th child is <div> tag', () => {
            expect(post.children[7].tagName).toBe('DIV');
        });

        it('8th child <div> has correct classes', () => {
            expect(post.children[7].classList).toMatchObject({
                '0': 'small',
                '1': 'text-muted',
                '2': 'text-end'
            });
        });

        it('8th child <div> has correct textContent', () => {
            expect(post.children[7].textContent).toBe(`Tags: ${testData.tags.join(", ")}`);
        });
    });

    describe('getPostData', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(testData),
            })
        );
        let callback = jest.fn();
        render.getPostData(testData.pid, callback);

        it('makes request to get post data', () => {
            expect(global.fetch).toHaveBeenCalled();
        });

        it('invokes callback', () => {
            expect(callback).toHaveBeenCalled();
        });
    });
});
