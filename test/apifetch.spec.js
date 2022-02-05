/**
* @jest-environment jsdom
*/
const fs = require("fs");
const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');
const { getGiphs } = require("../static/js/api");

const APIKEY = "TLvi8tf9k2z6WmKQm73BO1RIXRoaZzmL";
let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=20&q=`;


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(() => { }),
  })
);

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
})

afterEach(() => {
  fetch.mockClear();
})

describe('api fetch request', () => {

    test('it makes a fetch request to the giphy Api', async () => {
      const fakeEvent = {
      preventDefault: jest.fn(),
      target: {
      searchTerm: {value: 'hello'}
        }
      }

      let url_called = url + 'hello';

      const giphysent = await getGiphs(fakeEvent);

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('it makes a fetch request with the correct url', async () => {
      const fakeEvent = {
      preventDefault: jest.fn(),
      target: {
      searchTerm: {value: 'hello'}
        }
      }

      let url_called = url + 'hello';
      const giphysent = await getGiphs(fakeEvent);

      expect(fetch).toHaveBeenCalledWith(url_called);
    });

});
