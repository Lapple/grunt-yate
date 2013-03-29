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

  grunt.registerMultiTask('yate', 'Yate compiler plugin', function() {

    var options = this.options({
      runtime: true,
      iife: true,
      
      // Default no-op postprocess function. Use `postprocess`
      // to define custom compiled code transformations.
      postprocess: function(code) {
        return code;
      }
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

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
        return yate.compile(filepath).js;
      }).join('\n');

      src = options.postprocess(src);

      if (options.runtime) {
        src = runtime(src);
      }

      if (options.iife) {
        src = iife(src);
      }

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File ' + f.dest.cyan + ' created.');
    });
  });

  function runtime(code) {
    return grunt.file.read(path.join(yateFolder, 'runtime.js')) + '\n' + code;
  }

  function iife(code) {
    return '(function(){\n' + code + '\n})()\n';
  }

};
