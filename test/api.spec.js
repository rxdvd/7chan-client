/**
* @jest-environment jsdom
*/

const fs = require("fs");
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');
let api;

describe('api', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        api = require('../static/js/api')
        helper = require('../static/js/helpers')
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    describe('requests', () => {
        describe('get requests ', () => {

            test('it makes a get request to /posts', () => {
                api.getAllPosts()
                expect(fetch.mock.calls[0][0]).toMatch(/posts$/)
            })
        });

        describe('submitCountry', () => {

            test('it makes a post request to /posts with the post data', () => {
                
                let tag = 'javascript,html'
                const fakeSubmitEvent = {
                    preventDefault: jest.fn(),
                    target: {
                       title: {value: "Homer moment"},
                       message: {value: "Forgetting to add a script tag"},
                       giphy: {value: "https://media1.giphy.com/media/3ohs7KViF6rA4aan5u/200w_d.gif?cid=5c258309odg19h07wee91w9syplshaerqrquny81f4yi26y8&rid=200w_d.gif&ct=g"},
                       tags: {value: tag}
                    }
                };


                api.submitPost(fakeSubmitEvent);
                expect(fetch.mock.calls[0][1]).toHaveProperty('method', 'POST');
                expect(fetch.mock.calls[0][1]).toHaveProperty('body', JSON.stringify({title: "Homer moment",
                message: "Forgetting to add a script tag",
                giphy: "https://media1.giphy.com/media/3ohs7KViF6rA4aan5u/200w_d.gif?cid=5c258309odg19h07wee91w9syplshaerqrquny81f4yi26y8&rid=200w_d.gif&ct=g",
                tags: ["javascript","html"]}));

            })
        })

        describe('submit comment', () => {

            test("it should submit a comment", () => {

                const fakeComment = "test comment"
            
                
                api.submitComment(3,fakeComment)
                expect(fetch.mock.calls[0][1]).toHaveProperty('method', 'POST');
                expect(fetch.mock.calls[0][1]).toHaveProperty('body', JSON.stringify({comment: "test comment"}))
            })

        })

        describe('api calls to have been called', () => {
            test('it makes a request to /posts', () => {
                api.getAllPosts()
                expect(fetch).toHaveBeenCalled();
            })

            test.skip('it makes a request to the giphy Api', () => {

                
                const fakeEvent = {
                    preventDefault: jest.fn(),
                    target: {
                        searchTerm: {value: 'hello'}
                    }
                }
                api.getGiphs(fakeEvent)
                expect(fetch).toHaveBeenCalled();
            })
        })

    })

})
