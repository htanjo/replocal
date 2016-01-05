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
  port: 8888,
  upstream: undefined,
  silent: false
};

// Constructor
var Replocal = function (options) {

  EventEmitter.call(this);

  var self = this;
  var opts = this._options = merge({}, defaults, options);
  var proxy = this._proxy = hoxy.createServer({
    upstreamProxy: opts.upstream
  }).listen(opts.port, function () {
    self.log('Proxy server is running on ' + chalk.magenta.underline('localhost:' + opts.port));
    self.log('  Target website : ' + chalk.cyan(opts.hostname || '(none)'));
    self.log('  Document root  : ' + chalk.cyan(opts.docroot || '(current directory)'));
    self.log('  Upstream proxy : ' + chalk.cyan(opts.upstream || '(none)'));
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

// Log to stdout
Replocal.prototype.log = function () {
  if (this._options.silent) {
    return;
  }
  console.log.apply(this, arguments);
};

module.exports = Replocal;
