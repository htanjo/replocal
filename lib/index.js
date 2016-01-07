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
  network: undefined,
  silent: false
};
var networkProfiles = {
  'gprs': {
    rate: 50000 / 8,
    latency: 500,
    label: 'GPRS (50kb/s, 500ms RTT)'
  },
  '2g': {
    rate: 250000 / 8,
    latency: 300,
    label: '2G (250kb/s, 300ms RTT)'
  },
  '3g': {
    rate: 750000 / 8,
    latency: 100,
    label: '3G (750kb/s, 100ms RTT)'
  },
  '4g': {
    rate: 4000000 / 8,
    latency: 300,
    label: '4G (4Mb/s, 20ms RTT)'
  },
  'dsl': {
    rate: 2000000 / 8,
    latency: 5,
    label: 'DSL (2Mb/s, 5ms RTT)'
  },
  'wifi': {
    rate: 30000000 / 8,
    latency: 2,
    label: 'Wi-Fi (30Mb/s, 2ms RTT)'
  }
};

// Constructor
var Replocal = function (options) {

  EventEmitter.call(this);

  var self = this;
  var opts = this._options = merge({}, defaults, options);
  var networkProfile = networkProfiles[opts.network];
  var slow = networkProfile ? {
    rate: networkProfile.rate,
    latency: networkProfile.latency
  } : {};
  var proxy = this._proxy = hoxy.createServer({
    upstreamProxy: opts.upstream,
    slow: slow
  }).listen(opts.port, function () {
    self.log('Proxy server is running on ' + chalk.magenta.underline('localhost:' + opts.port));
    self.log('  Target website   : ' + (opts.hostname ? chalk.cyan(opts.hostname) : chalk.gray('(none)')));
    self.log('  Document root    : ' + (opts.docroot ? chalk.cyan(opts.docroot) : chalk.gray('(current directory)')));
    self.log('  Upstream proxy   : ' + (opts.upstream ? chalk.cyan(opts.upstream) : chalk.gray('(none)')));
    self.log('  Network throttle : ' + (networkProfile ? chalk.cyan(networkProfile.label) : chalk.gray('(none)')));
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
