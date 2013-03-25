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

module.exports = function(grunt) {

  grunt.registerMultiTask('yate', 'Yate compiler plugin', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      runtime: true,
      iife: true
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

      src = autorun(src);

      if (options.runtime) {
        src = runtime(src);
      }

      if (options.iife) {
        src = iife(src);
      }

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

  function runtime(code) {
    return grunt.file.read('node_modules/yate/lib/runtime.js') + '\n' + code;
  }

  function iife(code) {
    return '(function(){\n' + code + '\n})();\n';
  }

  function autorun(code) {
    return code + '\nreturn function(data) { return yr.run("main", data); };';
  }

};
