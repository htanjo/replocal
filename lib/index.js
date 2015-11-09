'use strict';

var hoxy = require('hoxy');
var merge = require('lodash.merge');
var chalk = require('chalk');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var noop = function () {};
var defaults = {
  hostname: '',
  docroot: '',
  port: 8888
};

// Constructor
var Replocal = function (options) {

  EventEmitter.call(this);

  var self = this;
  var opts = this._options = merge({}, defaults, options);
  var proxy = this._proxy = hoxy.createServer().listen(opts.port, function () {
    console.log('Proxy server is running on ' + chalk.magenta.underline('http://localhost:' + opts.port));
    console.log('  Target website : ' + chalk.cyan(opts.hostname || '(none)'));
    console.log('  Document root  : ' + chalk.cyan(opts.docroot || '(current directory)'));
    self.emit('start');
  });

  proxy.intercept({
    phase: 'request',
    hostname: opts.hostname
  }, function (req, resp, cycle) {
    return cycle.serve({
      docroot: path.resolve(opts.docroot),
      strategy: 'overlay'
    });
  });

};

// Inherit EventEmitter
util.inherits(Replocal, EventEmitter);

// Close proxy server
Replocal.prototype.close = function (callback) {
  var self = this;
  callback = callback || noop;
  this._proxy.close(function () {
    self.emit('close');
    callback();
  });
};

module.exports = Replocal;
