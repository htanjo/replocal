'use strict';

var expect = require('chai').expect;
var request = require('request');
var Replocal = require('../lib');

function setup(options) {
  return new Promise(function (resolve) {
    var replocal = new Replocal(options);
    replocal.on('start', function () {
      resolve(replocal);
    });
  });
}

function requestBody(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(body);
      }
      else {
        reject(new Error('Could not get response'));
      }
    });
  });
}

describe('Proxy server', function () {

  it('replaces response body with local file', function (done) {
    var replocal;
    setup({
      hostname: 'example.com',
      docroot: 'test/fixtures/basic',
      silent: true
    })
    .then(function (proxy) {
      replocal = proxy;
      return requestBody({
        url: 'http://example.com/',
        proxy: 'http://localhost:8888'
      });
    })
    .then(function (body) {
      expect(body).to.equal('replaced?');
    })
    .then(function () {
      replocal.close(done);
    })
    .catch(function (error) {
      replocal.close(function () {
        done(error);
      });
    });
  });

});
