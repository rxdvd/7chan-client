/**
* @jest-environment jsdom
*/
const fs = require("fs");
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

global.fetch = require('jest-fetch-mock');

const { getGiphs } = require("../static/js/api");

console.log(typeof getGiphs)

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve( () => json),
  })
);
  

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
  api = require('../static/js/api')
  helper = require('../static/js/helpers')
})

  beforeEach(() => {
    fetch.mockClear();
  });

test('it makes a request to the giphy Api', async () => {


          const fakeEvent = {
          preventDefault: jest.fn(),
          target: {
             searchTerm: {value: 'hello'}
         }
     }
    
      const giphysent = await getGiphs(fakeEvent);

      expect(fetch).toHaveBeenCalledTimes(1);
 });
