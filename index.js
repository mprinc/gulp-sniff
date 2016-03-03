(function() { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

	var file_names, gutil, through;

	through = require("through2");
	gutil = require("gulp-util");

	file_names = {};

	module.exports = function(name, options) {
		options = options || {};

        // console.log("[gulp-sniff] registering for: ", name);

		var filenames = function(file, enc, done) {
            // console.log("[gulp-sniff(name:%s):filenames] isNull: %s, isStream: : %s, isBuffer: : %s, file.path : ",
            //     name, file.isNull(), file.isStream(), file.isBuffer(), file.path);

            if (file.isNull()) {
				if(options.captureFolders) module.exports.register(file, name, options);
                // this.push(file);
            } else if (file.isStream()) {
				this.emit("error", new gutil.PluginError(pluginName,
					"Stream content is not supported"));
                // this.push(file);
			} else if (file.isBuffer()) {
				// recursively
				if(options.captureFilenames !== false) module.exports.register(file, name, options);
				// this.push(file);
			} else {
				// this.push(file);
			}
			// NO! this duplicates?!
			return done(null, file);
		};

		return through.obj(filenames);
	};

	module.exports.get = function(name, what) {
		var file_name, i, len, ref, results;
		name = name || 'default';
		what = what || 'relative';

		if (name === 'all') return file_names;

		if (file_names[name] == null) file_names[name] = [];
		ref = file_names[name];
		results = [];
		len = ref.length;

		switch (what) {
			case 'relative':
			case 'full':
			case 'base':
				for (i = 0; i < len; i++) {
					file_name = ref[i];
					results.push(file_name[what]);
				}
				return results;
			case 'all':
				results = file_names[name];
				return results;
		}
	};

	module.exports.forget = function(name) {
		name = name || 'default';
		if (name === 'all') file_names = {};
		return file_names[name] = [];
	};

	module.exports.register = function(file, name, options) {
		name = name || 'default';

		if (options.overrideMode) {
			file_names[name] = [];
		} else {
			if (file_names[name] == null) file_names[name] = [];
		}

        // console.log("[gulp-sniff(name:%s):register] file.relative : %s", name, file.relative);

		// returns the file_names[name].length
		return file_names[name].push({
			relative: file.relative,
			full: file.path,
			base: file.base
		});
	};

}).call(this); // end of 'use strict';
