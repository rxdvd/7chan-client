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
        
    })

})
