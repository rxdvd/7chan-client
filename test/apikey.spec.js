/**
* @jest-environment jsdom
*/
const fs = require("fs");
const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');
const { getGiphs } = require("../static/js/api");


beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
})

afterEach(() => {
  fetch.mockClear();
})

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve( () => {  }),
  })
);
  
test('it makes a request to the giphy Api', async () => {
    const fakeEvent = {
    preventDefault: jest.fn(),
    target: {
     searchTerm: {value: 'test_word_exit_abc_123'}
      }
     }
    const giphysent = await getGiphs(fakeEvent);
    expect(fetch).toHaveBeenCalledTimes(1);
});
