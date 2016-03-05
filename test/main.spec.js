(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

  var fs = require("fs");
  var es = require("event-stream");
  var chai = require("chai");
  var expect = chai.expect;
  var should = chai.should();
  var mocha = require("mocha");
  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var sniff = require("../");
  var sinon = require("sinon");
  var sinonChai = require("sinon-chai");
  chai.use(sinonChai);

  describe("gulp-sniff", function() {
    it("Should grab the name of every file that passes through it", function(done) {
      return gulp.src("./test/files/**/*").pipe(sniff({noDirectReport: true})).pipe(gulp.dest("./test/dump")).on("end", function() {
        var all_files;
        all_files = sniff.get();
        all_files.should.eql(["a.cc", "a.empty", "a.txt", "a_folder/b.txt"]);
        return done();
      });
    });
    it("Supports namespacing", function(done) {
      return gulp.src("./test/files/**/*.txt").pipe(sniff("txt", {noDirectReport: true})).pipe(gulp.dest("./test/dump")).on("end", function() {
        var txt_files;
        txt_files = sniff.get("txt");
        txt_files.should.eql(["a.txt", "a_folder/b.txt"]);
        return done();
      });
    });
    it("Can retrieve different things using options", function() {
      sniff.get("txt", "all")[0].should.be.object;
      return sniff.get("txt", "relative")[0].should.be.string;
    });
    it("Can forget", function() {
      sniff.forget("txt-a");
      return sniff.get("txt").should.not.be.empty;
      sniff.forget("txt");
      return sniff.get("txt").should.be.empty;
    });
    it("Support overriding previous file on new one through overrideMode", function(done) {
      return gulp.src("./test/files/**/*").pipe(sniff({
        overrideMode: true, noDirectReport: true
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        var all_files;
        all_files = sniff.get();
        all_files.length.should.eql(1);
        return done();
      });
    });
    it("Support no name and option", function(done) {
      // http://sinonjs.org/docs/
      // var logSpy = sinon.spy(console, "log");
      // console.log.restore();
      var consoleLogOrig = console.log;
      var logSpy = sinon.spy();
      expect(logSpy).to.be.a('function');
      expect(logSpy).to.have.been.callCount(0);
      console.log = logSpy;
      sniff.forget();
      return gulp.src("./test/files/**/*").pipe(sniff()).pipe(gulp.dest("./test/dump")).on("end", function() {
        console.log = consoleLogOrig;
        expect(logSpy).to.have.been.callCount(4);
        // console.log("sniff.get('default'): ", sniff.get('default'));
        expect(sniff.get('default').length).to.be.equal(4);
        // https://github.com/domenic/sinon-chai
        // expect(logSpy.getCall(0)).to.have.been.calledWith(sinon.match(/.*\,\ isStream\:\ .*/));

        return done();
      });
    });

    it("Support detailed == true option", function(done) {
      // http://sinonjs.org/docs/
      // var logSpy = sinon.spy(console, "log");
      // console.log.restore();
      var consoleLogOrig = console.log;
      var logSpy = sinon.spy();
      expect(logSpy).to.be.a('function');
      expect(logSpy).to.have.been.callCount(0);
      console.log = logSpy;
      return gulp.src("./test/files/**/*").pipe(sniff({
        detailed: true
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        console.log = consoleLogOrig;
        expect(logSpy).to.have.been.callCount(4);
        // https://github.com/domenic/sinon-chai
        // expect(logSpy.getCall(0)).to.have.been.calledWith(sinon.match(/.*\,\ isStream\:\ .*/));

        return done();
      });
    });
    it("Support noDirectReport == true option", function(done) {
      // http://sinonjs.org/docs/
      // var logSpy = sinon.spy(console, "log");
      // console.log.restore();
      var consoleLogOrig = console.log;
      var logSpy = sinon.spy();
      expect(logSpy).to.be.a('function');
      expect(logSpy).to.have.been.callCount(0);
      console.log = logSpy;
      return gulp.src("./test/files/**/*").pipe(sniff(null, {
        detailed: false, noDirectReport: true
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        console.log = consoleLogOrig;
        expect(logSpy).to.have.been.callCount(0);
        // https://github.com/domenic/sinon-chai
        // expect(logSpy.getCall(0)).to.have.been.calledWith(sinon.match(/.*\,\ isStream\:\ .*/));

        return done();
      });
    });
    it("Support captureFolders option", function(done) {
      // http://sinonjs.org/docs/
      // var logSpy = sinon.spy(console, "log");
      // console.log.restore();
      var consoleLogOrig = console.log;
      var logSpy = sinon.spy();
      expect(logSpy).to.be.a('function');
      expect(logSpy).to.have.been.callCount(0);
      console.log = logSpy;
      return gulp.src("./test/files/**/*").pipe(sniff(null, {
        captureFolders: true
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        console.log = consoleLogOrig;
        expect(logSpy).to.have.been.callCount(5);
        // https://github.com/domenic/sinon-chai
        // expect(logSpy.getCall(0)).to.have.been.calledWith(sinon.match(/.*\,\ isStream\:\ .*/));

        return done();
      });
    });
    it("Support debug option", function(done) {
      // http://sinonjs.org/docs/
      // var logSpy = sinon.spy(console, "log");
      // console.log.restore();
      var consoleLogOrig = console.log;
      var logSpy = sinon.spy();
      expect(logSpy).to.be.a('function');
      expect(logSpy).to.have.been.callCount(0);
      console.log = logSpy;
      return gulp.src("./test/files/**/*").pipe(sniff(null, {
        captureFolders: true, debug: true
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        console.log = consoleLogOrig;
        // 1 debug for sniff instance + 5 logs + 5 debug for register
        expect(logSpy).to.have.been.callCount(5+5+1);
        // https://github.com/domenic/sinon-chai
        // expect(logSpy.getCall(0)).to.have.been.calledWith(sinon.match(/.*\,\ isStream\:\ .*/));

        return done();
      });
    });
    it("Support captureFilenames option", function(done) {
      // http://sinonjs.org/docs/
      // var logSpy = sinon.spy(console, "log");
      // console.log.restore();
      var consoleLogOrig = console.log;
      var logSpy = sinon.spy();
      expect(logSpy).to.be.a('function');
      expect(logSpy).to.have.been.callCount(0);
      console.log = logSpy;
      return gulp.src("./test/files/**/*").pipe(sniff(null, {
        captureFilenames: false
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        console.log = consoleLogOrig;
        expect(logSpy).to.have.been.callCount(0);
        // https://github.com/domenic/sinon-chai
        // expect(logSpy.getCall(0)).to.have.been.calledWith(sinon.match(/.*\,\ isStream\:\ .*/));

        return done();
      });
    });
    it("Support captureFilenames & captureFolders options", function(done) {
      // http://sinonjs.org/docs/
      // var logSpy = sinon.spy(console, "log");
      // console.log.restore();
      var consoleLogOrig = console.log;
      var logSpy = sinon.spy();
      expect(logSpy).to.be.a('function');
      expect(logSpy).to.have.been.callCount(0);
      console.log = logSpy;
      return gulp.src("./test/files/**/*").pipe(sniff("folder", {
        captureFilenames: false, captureFolders: true
      })).pipe(gulp.dest("./test/dump")).on("end", function() {
        console.log = consoleLogOrig;
        expect(logSpy).to.have.been.callCount(1);

        sniff.get("folder").should.not.be.empty;
        sniff.forget();
        sniff.get("folder").should.not.be.empty;
        sniff.forget('all');
        sniff.get("folder").should.be.empty;

        // https://github.com/domenic/sinon-chai
        // expect(logSpy.getCall(0)).to.have.been.calledWith(sinon.match(/.*\,\ isStream\:\ .*/));

        return done();
      });
    });
    it("Supports empty files", function(done) {
      return gulp.src("./test/files/*.empty").pipe(sniff("empty", {noDirectReport: true})).pipe(gulp.dest("./test/dump")).on("end", function() {
        var empty_files;
        empty_files = sniff.get("empty");
        empty_files.should.eql(["a.empty"]);
        return done();
      });
    });
  });

}).call(this); // end of 'use strict';
