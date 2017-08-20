
# gulp-sniff
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

Filename gathering plugin for [gulp](https://github.com/wearefractal/gulp). You can **sniff** through the ```gulp pipes``` and collect all _filenames_ that marshaled through them.

It is an extension of the [JohnyDays](https://github.com/johnydays)'s [gulp-filenames](https://www.npmjs.com/package/gulp-filenames) plugin, but migrated (back) to JS, fixed some bugs, and added some features.

## Usage

First, install `gulp-sniff` as a development dependency:

```shell
npm install --save-dev gulp-sniff
```

Then, add it to your `gulpfile.js`:

```javascript
var gulp = require('gulp');
var sniff = require('gulp-sniff');

var stream = gulp.src("src/*.js")
	.pipe(sniff("js")) // prints all files matched with gulp.src("src/*.js")
	.pipe(gulp.dest("dest"));
```

or

```javascript
var gulp = require('gulp');
var sniff = require('gulp-sniff');

var stream = gulp.src("src/*.js")
	.pipe(sniff("js", {noDirectReport: true})) // doesn't print anymore
	.pipe(gulp.dest("dest"));

stream.on('end', function() {
	console.log("JS files:", sniff.get("js")); // prints all captured filenames
});
```

or more condensed :) (used for testing in interactive node):

```javascript
var gulp = require('gulp');
var sniff = require('gulp-sniff');
var stream = gulp.src("*.js").pipe(sniff("js")).pipe(gulp.dest("./dest"));
var e = stream.on('end', function() {console.log("js files:", sniff.get("js"));});
```

More advanced version with parallel streams:

```javascript

var gulp = require('gulp');
var sniff = require('gulp-sniff');
var es = require('event-stream');

var stream1 = gulp.src("*.js")
	.pipe(sniff("js"))
	.pipe(gulp.dest("dest"));

var stream2 = gulp.src("*.json")
	.pipe(sniff("json"))
	.pipe(gulp.dest("dest"));

var stream = es.merge(stream1, stream2);

var e = stream.on('end', function() {
	console.log("JS files:", sniff.get("js"));
});
```

or more condensed :) (used for testing in interactive node):

```javascript
var gulp = require('gulp');
var sniff = require('gulp-sniff');
var es = require('event-stream');

var stream1 = gulp.src("*.js").pipe(sniff("js")).pipe(gulp.dest("dest"));
var stream2 = gulp.src("*.json").pipe(sniff("json")).pipe(gulp.dest("dest"));
var stream = es.merge(stream1, stream2);
var e = stream.on('end', function() {console.log("JS files:", sniff.get("js"));});

```

## API

### sniff([name], [options])

#### name

Namespace the filenames

### options

#### overrideMode (default: false)

override previous files when a new one passes through

#### captureFolders (default: false)

capture foldernames (in addition to default of capturing filenames)

#### captureFilenames (default: true)

capture filenames

#### noDirectReport (default: false)

avoids internal / direct printing of file names

#### detailed (default: false)

Reports detailed logs

#### debug (default: false)

Reports internal debug messages

### sniff.get([name], [what])

#### name
Get only these filenames ("all" to get everything)

#### what

"relative" or "full" or "path" for an array of filenames

"all" for an array of objects

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## Versions

# Release History
* 2.1.0 Fixed bugs with original plugin, added additional features of (non)sniffing folder/file names
* previous: branched from: [gulp-filenames](https://www.npmjs.com/package/gulp-filenames)

[npm-url]: https://npmjs.org/package/gulp-sniff
[npm-image]: https://badge.fury.io/js/gulp-sniff.png

[travis-url]: http://travis-ci.org/mprinc/gulp-sniff
[travis-image]: https://secure.travis-ci.org/mprinc/gulp-sniff.png?branch=master

[coveralls-url]: https://coveralls.io/r/mprinc/gulp-sniff
[coveralls-image]: https://coveralls.io/repos/mprinc/gulp-sniff/badge.png

[depstat-url]: https://david-dm.org/mprinc/gulp-sniff
[depstat-image]: https://david-dm.org/mprinc/gulp-sniff.png
