/**
 * @jest-environment jsdom
 */

const render = require("../static/js/render");
const giphyData = require("./giphy_sample.json");

describe.skip('render functions', () => {
    const testData = {
        "pid": 6,
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
                expect(element.classList).toMatchObject({
                    '0': 'btn',
                    '1': 'btn-light'
                });
            });
        });

        describe('submitReaction', () => {
            beforeEach(() => {
                document.documentElement.innerHTML = '<div><button class="btn" data-pid="6" data-emoji="thumbs_up"></button></div>';
                render.submitReaction(testData, 'thumbs_up', testData.reactions['thumbs_up'][0]);
            });

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve(testData),
                })
            );

            it('makes request to add/remove reaction', () => {
                expect(global.fetch).toHaveBeenCalled();
            });
        });
    });
});
