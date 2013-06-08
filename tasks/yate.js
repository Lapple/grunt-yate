/*
 * grunt-yate
 * https://github.com/lapple/grunt-yate
 *
 * Copyright (c) 2013 Aziz Yuldoshev
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var yate = require('yate');

var TempFile = require('temporary/lib/file');

var yateFolder = path.dirname(require.resolve('yate'));

module.exports = function(grunt) {

  var async = grunt.util.async;

  grunt.registerMultiTask('yate', 'Yate compiler plugin', function() {

    var options = this.options({
      runtime: false,
      autorun: false,
      modular: false,

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

      var temp = new TempFile();
      var src;

      // Building compiled templates.
      temp.writeFileSync(
        f.src.filter(function(filepath) {

          // Warn on and remove invalid source
          // files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }

        }).map(function(filepath) {
          return 'include "' + path.resolve(filepath) + '"';
        }).join(grunt.util.linefeed)
      );

      try {
        src = yate.compile(temp.path).js;
      } catch(e) {
        grunt.event.emit('yate:error', e);
        grunt.fail.warn(e);

        temp.unlink();

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
        } else if (options.modular) {
          src = modular(src);
        }

        src = options.postprocess(src);

        // Write the destination file.
        grunt.file.write(f.dest, src);

        // Print a success message.
        grunt.log.writeln('File ' + f.dest.cyan + ' created.');
        temp.unlink();
        next();
      });

    }, this.async());
  });

  function autorun(code, module) {
    var main = typeof module === 'string' ? module : 'main';

    return iife(code + grunt.util.linefeed + 'return function(data) { return yr.run("' + main + '", data); };');
  }

  function modular(code) {
    return iife(code + grunt.util.linefeed + 'module.exports = function(data) { return yr.run("main", data); };');
  }

  function iife(code) {
    return '(function(){' + grunt.util.linefeed + code + grunt.util.linefeed + '})()' + grunt.util.linefeed;
  }

  function readFile(path, callback) {
    return require('fs').readFile(path, { encoding: 'utf8' }, callback);
  }

};
