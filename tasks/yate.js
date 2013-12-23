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

      import: [],

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

      var src, tmp, templates;

      // Warn on and remove invalid source files.
      var files = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      // Concatenates multiple source files by creating a temporary file,
      // listing all the includes, e.g:
      //
      //     // temp.yate
      //     include "a.yate"
      //     include "b.yate"
      //     include "c.yate"
      //
      // Compiles single source file right away.
      if (files.length === 1) {
        templates = files[0];
      } else {
        tmp = createTemporary(files);
        templates = tmp.path;
      }

      yate.modules = {};

      // load modules
      grunt.file.expand(options.import).filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Module file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filename) {
         var obj = grunt.file.readJSON(filename);
         yate.modules[ obj.name ] = obj;
      });

      try {
        // Building compiled templates.
        src = yate.compile(templates).js;
      } catch(e) {
        grunt.event.emit('yate:error', e);
        grunt.fail.warn(e);

        tmp && tmp.unlink();

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
        tmp && tmp.unlink();
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

  function createTemporary(files) {
    var temp = new TempFile();

    temp.writeFileSync(
      files.map(function(filepath) {
        // Yate won't follow Windows path delimiters.
        return 'include "' + path.resolve(filepath).split(path.sep).join('/') + '"';
      // Yate won't parse Windows linefeed.
      }).join('\n')
    );

    return temp;
  }

};
