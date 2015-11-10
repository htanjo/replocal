# replocal
> Proxy for replacing web contents with local files.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][deps-image]][deps-url]

## Getting started

### Install
Install replocal CLI via npm.

```sh
$ npm install -g replocal
```

### Usage

```sh
$ cd path/to/local-docroot
$ replocal example.com
```

Then, proxy server will start on `http://localhost:8888`.  

When you access `http://example.com/` using this proxy, the web content should be replaced with `index.html` on your current working directory.  
If you don't have `index.html` on local, the original content will be served.

You can also serve CSS, JavaScript, images, etc. from your local file system including subdirectories.

## Command

```sh
replocal [options] <hostname> [<directory>]
```

Start proxy server for replacing web contents with local files.  
Your current working directory will be mapped to document root by default.  
If you want to change document root, set `<directory>` argument.

### Options

- `-p, --port <number>`  
  Port number of proxy server. (default: `8888`)

- `--silent`  
  Print nothing to stdout.

- `-h, --help`  
  Output usage information.

- `-V, --version`  
  Output the version number.

### Example

```sh
$ replocal --port=9999 example.com path/to/docroot

# Proxy server is running on http://localhost:9999
#   Target website : example.com
#   Document root  : path/to/docroot
```

## License
Copyright (c) 2015 Hiroyuki Tanjo. Licensed under the [MIT License](LICENSE).

[npm-image]: https://img.shields.io/npm/v/replocal.svg
[npm-url]: https://www.npmjs.com/package/replocal
[travis-image]: https://travis-ci.org/htanjo/replocal.svg?branch=master
[travis-url]: https://travis-ci.org/htanjo/replocal
[coveralls-image]: https://coveralls.io/repos/htanjo/replocal/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/htanjo/replocal
[deps-image]: https://david-dm.org/htanjo/replocal.svg
[deps-url]: https://david-dm.org/htanjo/replocal
