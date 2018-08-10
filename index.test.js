const { expect } = require('chai');
const { assert } = require('chai');
const cleanData = require('./index.js');
global.$ = require('jquery');


describe('index.js', () => {
  describe('search', () => {
    it('fetch gets called', () => {
      window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          results: 'return results',
        })
      }));
      expect(window.fetch).not.toHaveBeenCalled();
      search();
      expect(window.fetch).toBeCalled();
    });
  })

  describe('cleanData', () => {
    it('formats data', () => {
      const data = {
        cod: 200,
        cnt: 40,
        list: [{temp: 20, dt_txt: '2018-08-10 21:00:00'}, {temp: 20, dt_txt: '2018-08-11 20:00:00'}, {temp: 20, dt_txt: '2018-08-11 21:00:00'}]
      }
      const expected = {
        '2018-08-10': [{temp: 20, dt_txt: '2018-08-10 21:00:00'}],
        '2018-08-11': [{temp: 20, dt_txt: '2018-08-11 20:00:00'}, {temp: 20, dt_txt: '2018-08-11 21:00:00'}]
      }

      expect(cleanData(data)).toEqual(expected);
    });

  });
});