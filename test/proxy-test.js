'use strict';

var expect = require('chai').expect;
var request = require('request');
var path = require('path');
var fs = require('fs');
var Replocal = require('../lib');
var orgWrite = process.stdout.write;
var muteStdout = [];

function mute() {
  process.stdout.write = function (message) {
    muteStdout.push(message);
  };
}

function unmute() {
  var message = muteStdout.join('');
  muteStdout = [];
  process.stdout.write = orgWrite;
  return message;
}

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
      docroot: 'test/fixtures',
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
      expect(body).to.equal('replaced');
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

  it('serves from cwd when no "docroot" specified', function (done) {
    var replocal;
    setup({
      hostname: 'example.com',
      silent: true
    })
    .then(function (proxy) {
      replocal = proxy;
      return requestBody({
        url: 'http://example.com/package.json',
        proxy: 'http://localhost:8888'
      });
    })
    .then(function (body) {
      var pkg = fs.readFileSync(path.resolve('package.json'), 'utf8');
      expect(body).to.equal(pkg);
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

  it('listens port number specified with "port" option', function (done) {
    var replocal;
    setup({
      hostname: 'example.com',
      docroot: 'test/fixtures',
      port: 9999,
      silent: true
    })
    .then(function (proxy) {
      replocal = proxy;
      return requestBody({
        url: 'http://example.com/',
        proxy: 'http://localhost:9999'
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
    });
  });

  it('prints some message when start', function (done) {
    var replocal;
    mute();
    setup({
    })
    .then(function (proxy) {
      var message = unmute();
      replocal = proxy;
      expect(message).not.to.be.empty;
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

  it('doesn\'t print message when "silent" option given', function (done) {
    var replocal;
    mute();
    setup({
      silent: true
    })
    .then(function (proxy) {
      var message = unmute();
      replocal = proxy;
      expect(message).to.be.empty;
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

  it('can close itself using .close() method', function (done) {
    var replocal;
    setup({
      hostname: 'example.com',
      docroot: 'test/fixtures',
      silent: true
    })
    .then(function (proxy) {
      replocal = proxy;
      replocal.close();
      request({
        url: 'http://example.com/',
        proxy: 'http://localhost:8888'
      }, function (error) {
        expect(error).not.to.be.null;
        done();
      });
    })
  });

});
