/*
 * grunt-yate
 * https://github.com/lapple/grunt-yate
 *
 * Copyright (c) 2013 Aziz Yuldoshev
 * Licensed under the MIT license.
 */

'use strict';

var yate = require('yate');
var path = require('path');

var yateFolder = path.dirname(require.resolve('yate'));

module.exports = function(grunt) {

  var async = grunt.util.async;

  grunt.registerMultiTask('yate', 'Yate compiler plugin', function() {

    var options = this.options({
      runtime: false,
      autorun: false,

      // List of externals-containing files to be added to the compiled
      // templates.
      externals: [],

      // Default no-op postprocess function. Use `postprocess`
      // to define custom compiled code transformations.
      postprocess: function(code) {
        return code;
      }
    });

    // Error flag.
    var failure = false;

    // Iterate over all specified file groups.
    async.forEachSeries(this.files, function(f, next) {

      // Building compiled templates.
      var src = f.src.filter(function(filepath) {

        // Warn on and remove invalid source
        // files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }

      }).map(function(filepath) {
        var compiled;

        try {
          compiled = yate.compile(filepath).js;
        } catch(e) {
          failure = true;

          grunt.event.emit('yate:error', e);
          grunt.fail.warn(e);
        }

        return compiled;
      }).join(grunt.util.linefeed);

      if (failure) {
        return next();
      }

      // Building a list of files to prepend to the compiled template.
      var includes = grunt.file.expand(options.externals);

      // It is important to prepend externals with runtime.
      if (options.runtime) {
        includes.unshift(path.join(yateFolder, 'runtime.js'));
      }

      async.map(includes, readFile, function(err, scripts) {
        if (err) {
          grunt.log.warn(err);
          return next(false);
        }

        src = scripts.join(grunt.util.linefeed) + grunt.util.linefeed + src;

        if (options.autorun) {
          src = autorun(src, options.autorun);
        }

        src = options.postprocess(src);

        // Write the destination file.
        grunt.file.write(f.dest, src);

        // Print a success message.
        grunt.log.writeln('File ' + f.dest.cyan + ' created.');
        next();
      });

    }, this.async());
  });

  function autorun(code, module) {
    var main = typeof module === 'string' ? module : 'main';

    return iife(code + grunt.util.linefeed + 'return function(data) { return yr.run("' + main + '", data); };');
  }

  function iife(code) {
    return '(function(){' + grunt.util.linefeed + code + grunt.util.linefeed + '})()' + grunt.util.linefeed;
  }

  function readFile(path, callback) {
    return require('fs').readFile(path, { encoding: 'utf8' }, callback);
  }

};
