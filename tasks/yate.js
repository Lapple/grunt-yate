/*
 * grunt-yate
 * https://github.com/lapple/grunt-yate
 *
 * Copyright (c) 2013 Aziz Yuldoshev
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var path = require('path');

var yate = require('yate');
var TempFile = require('temporary/lib/file');

var yateFolder = path.dirname(require.resolve('yate'));

module.exports = function(grunt) {
  var LF = grunt.util.linefeed;

  grunt.registerMultiTask('yate', 'Yate compiler plugin', function() {

    var options = this.options({
      runtime: false,
      autorun: false,
      modular: false,
      writeAST: false,

      // List of externals-containing files to be added to the compiled
      // templates.
      externals: [],

      // List of imported modules.
      import: [],

      // Default no-op postprocess function. Use `postprocess`
      // to define custom compiled code transformations.
      postprocess: function(code) {
        return code;
      }
    });

    // Building a list of files to prepend to the compiled template.
    var includes = grunt.file.expand(options.externals);

    // It is important to prepend externals with runtime.
    if (options.runtime) {
      includes.unshift(path.join(yateFolder, 'runtime.js'));
    }

    var includedCode = includes.map(grunt.file.read).join(LF);

    // Loading imported modules
    yate.modules = {};

    grunt.file.expand(options.import).filter(function(filepath) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn(util.format('Module file "%s" not found.', filepath));
        return false;
      } else {
        return true;
      }
    }).forEach(function(filename) {
       var obj = grunt.file.readJSON(filename);
       yate.modules[obj.name] = obj;
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var src, tmp, templates;

      // Warn on and remove invalid source files.
      var files = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn(util.format('Source file "%s" not found.', filepath));
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

      var yateOptions = {
        'write-ast': options.writeAST
      };

      try {
        // Building compiled templates.
        src = yate.compile(templates, yateOptions).js;
      } catch(e) {
        grunt.event.emit('yate:error', e);
        grunt.fail.warn(e);
        cleanup();

        return;
      }

      // Prepend compiled templates with externals and runtime.
      src = includedCode + LF + src;

      if (options.autorun) {
        src = autorun(src, options.autorun);
      } else if (options.modular) {
        src = modular(src);
      }

      src = options.postprocess(src);

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln(util.format('File %s created.', f.dest.cyan));
      cleanup();

      function cleanup() {
        if (tmp) {
          tmp.unlink();
        }
      }
    });
  });

  function autorun(code, module) {
    var main = typeof module === 'string' ? module : 'main';
    var runExpression = util.format('return function(data) { return yr.run("%s", data); };', main);

    return iife(code + LF + runExpression);
  }

  function modular(code) {
    return iife(code + LF + 'module.exports = function(data) { return yr.run("main", data); };');
  }

  function iife(code) {
    return '(function(){' + LF + code + LF + '})()' + LF;
  }

  function createTemporary(files) {
    var temp = new TempFile();

    temp.writeFileSync(
      files.map(function(filepath) {
        // Yate won't follow Windows path delimiters.
        return util.format('include "%s"', path.resolve(filepath).split(path.sep).join('/'));
      // Yate won't parse Windows linefeed.
      }).join('\n')
    );

    return temp;
  }

};
