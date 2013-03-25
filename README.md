# grunt-yate

> Yate compiler plugin

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-yate --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-yate');
```

## The "yate" task

### Overview
In your project's Gruntfile, add a section named `yate` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  yate: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.iife
Type: `Boolean`
Default value: `true`

Wrap the compiled templates into [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/).

#### options.runtime
Type: `Boolean`
Default value: `true`

Prepend destination file with `lib/runtime.js` library from Yate.

### Usage Examples

When using default options all destination files will be wrapped into IIFE and each will
be prepended by `lib/runtime.js` from Yate.

Compile single file:

```js
grunt.initConfig({
  yate: {
    options: {},
    files: {
      'templates/compiled/index.js': [
        'templates/src/index.js',
        'templates/src/blocks/*.js'
      ]
    }
  }
});
```

Compile multiple files, using one to one mapping:

```js
grunt.initConfig({
  yate: {
    options: {
      runtime: false
    },
    files: [
      {
        dest: 'templates/compiled/',
        src: 'templates/src/*.yate',
        ext: '.js',
        expand: true,
        flatten: true
      }
    ]
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
