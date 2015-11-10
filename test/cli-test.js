'use strict';

var expect = require('chai').expect;
var request = require('request');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

function run(args) {
  var cliPath = path.resolve('bin/replocal');
  var command = 'node ' + cliPath + ' ' + args;
  return new Promise(function (resolve, reject) {
    var proc = exec(command, function (error) {
      reject(error);
    });
    setTimeout(function () {
      resolve(proc);
    }, 1000);
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

describe('CLI', function () {

  it('can start proxy server', function (done) {
    var proc;
    run('example.com')
    .then(function (childProcess) {
      proc = childProcess;
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
      proc.kill();
      done();
    })
    .catch(function (error) {
      proc.kill();
      done(error);
    });
  });

  it('can start proxy server according to options', function (done) {
    var proc;
    run('example.com test/fixtures --port=9999')
    .then(function (childProcess) {
      proc = childProcess;
      return requestBody({
        url: 'http://example.com/',
        proxy: 'http://localhost:9999'
      });
    })
    .then(function (body) {
      expect(body).to.equal('replaced');
    })
    .then(function () {
      proc.kill();
      done();
    })
    .catch(function (error) {
      proc.kill();
      done(error);
    });
  });

});
