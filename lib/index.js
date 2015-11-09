'use strict';

var hoxy = require('hoxy');
var merge = require('lodash.merge');
var chalk = require('chalk');
var path = require('path');

var defaults = {
  hostname: '',
  path: '',
  port: 8888
};

var replocal = function (options) {

  var opts = merge({}, defaults, options);
  var proxy = hoxy.createServer().listen(opts.port, function () {
    console.log('Proxy server is running on ' + chalk.magenta.underline('http://localhost:' + opts.port));
    console.log('  Target website : ' + chalk.cyan(opts.hostname || '(none)'));
    console.log('  Document root  : ' + chalk.cyan(opts.path || '(current directory)'));
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
