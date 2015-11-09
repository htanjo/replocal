'use strict';

var expect = require('chai').expect;
var request = require('request');
var Q = require('q');
var Replocal = require('../lib');

function setup(options) {
  var deferred = Q.defer();
  var replocal = new Replocal(options);
  replocal.on('start', function () {
    deferred.resolve(replocal);
  });
  return deferred.promise;
}

function requestBody(options) {
  var deferred = Q.defer();
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      deferred.resolve(body);
    }
    else {
      deferred.reject(new Error('Could not get response'));
    }
  });
  return deferred.promise;
}

describe('Proxy server', function () {

  it('replaces response body with local file', function (done) {
    var replocal;
    Q.fcall(function () {
      return setup({
        hostname: 'example.com',
        docroot: 'test/fixtures/basic'
      });
    })
    .then(function (proxy) {
      replocal = proxy;
      return requestBody({
        url: 'http://example.com/',
        proxy: 'http://localhost:8888'
      });
    })
    .then(function (body) {
      expect(body).to.equal('replaced');
    })
    .then(function () {
      replocal.close(done);
    })
    .catch(function (error) {
      replocal.close(function () {
        done(error);
      });
    })
    .done();
  });

});
