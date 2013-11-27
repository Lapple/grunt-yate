/*
 * grunt-yate
 * https://github.com/lapple/grunt-yate
 *
 * Copyright (c) 2013 lapple
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    yate: {
      simple: {
        files: {
          'tmp/simple.js': [
            'test/fixtures/simple.yate',
            'test/fixtures/externals.yate'
          ]
        }
      },
      autorun: {
        options: {
          autorun: true,
          runtime: true,
          externals: [
            'test/fixtures/externals.js'
          ]
        },
        files: {
          'tmp/autorun.js': 'test/fixtures/autorun.yate'
        }
      },
      modules: {
        files: {
          'tmp/modules.js': 'test/fixtures/first-module.yate'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'yate', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
