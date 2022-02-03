/**
* @jest-environment jsdom
*/

const fs = require("fs");
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');
let api;

describe.skip('handlers', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        api = require('../static/js/api')
        handlers = require('../static/js/handlers')
    })

    afterEach(() => {
        fetch.resetMocks();
    })

    
    test("hello" , () => {

    })


})
