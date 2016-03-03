(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

  var fs = require("fs");
  var es = require("event-stream");
  var should = require("should");
  var mocha = require("mocha");
  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var filenames = require("../");

  describe("gulp-filenames", function() {
    it("Should grab the name of every file that passes through it", function(done) {
      return gulp.src("./test/files/**/*").pipe(filenames()).pipe(gulp.dest("./test/dump")).on("end", function() {
        var all_files;
        all_files = filenames.get();
        all_files.should.eql(["a.cc", "a.empty", "a.txt", "b.txt"]);
        return done();
      });
    });
    it("Supports namespacing", function(done) {
      return gulp.src("./test/files/*.txt").pipe(filenames("txt")).pipe(gulp.dest("./test/dump")).on("end", function() {
        var txt_files;
        txt_files = filenames.get("txt");
        txt_files.should.eql(["a.txt", "b.txt"]);
        return done();
      });
    });
    it("Can retrieve different things using options", function() {
      filenames.get("txt", "all")[0].should.be.object;
      return filenames.get("txt", "relative")[0].should.be.string;
    });
    it("Can forget", function() {
      filenames.forget("txt");
      return filenames.get("txt").should.be.empty;
    });
    it("Support overriding previous file on new one through overrideMode", function(done) {
      return gulp.src("./test/files/**/*").pipe(filenames(null, {
        overrideMode: true
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        var all_files;
        all_files = filenames.get();
        all_files.length.should.eql(1);
        return done();
      });
    });
    return it("Supports empty files", function(done) {
      return gulp.src("./test/files/*.empty").pipe(filenames("empty")).pipe(gulp.dest("./test/dump")).on("end", function() {
        var empty_files;
        empty_files = filenames.get("empty");
        empty_files.should.eql(["a.empty"]);
        return done();
      });
    });
  });

}).call(this); // end of 'use strict';
