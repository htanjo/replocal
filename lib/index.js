'use strict';

var hoxy = require('hoxy');
var merge = require('lodash.merge');
var path = require('path');

var defaults = {
  hostname: '',
  path: process.cwd(),
  port: 8888
};

var replocal = function (options) {

  var opts = merge({}, defaults, options);
  var proxy = hoxy.createServer().listen(opts.port, function () {
    console.log('Proxy is running on http://localhost:' + opts.port);
  });

  proxy.intercept({
    phase: 'request',
    hostname: opts.hostname
  }, function (req, resp, cycle) {
    return cycle.serve({
      docroot: path.resolve(opts.path),
      strategy: 'overlay'
    });
  });

};

module.exports = replocal;
