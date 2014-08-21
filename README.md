# grunt-yate

> Yate compiler plugin

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-yate --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```javascript
grunt.loadNpmTasks('grunt-yate');
```

## The "yate" task

### Overview
In your project's Gruntfile, add a section named `yate` to the data object passed into `grunt.initConfig()`.

```javascript
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

#### options.runtime
Type: `Boolean`
Default value: `false`

Prepend destination file with `runtime.js` library from [yate](https://github.com/pasaran/yate).

#### options.import
Type: `Array`

File pattern or array of patterns to load modules from.

#### options.autorun
Type: `Boolean|String|Object`
Default value: `false`

Create autorunning templates.

- Pass `true` to automatically run `main` module.
- Pass a string to autorun specific module.
- Pass `{module: "moduleTitle", mode: "modeName"}` to specify both module and mode.

#### options.modular
Type: `Boolean`
Default value: `false`

`module.exports` main template function so that it can be required as a node module.

#### options.externals
Type: `String|Array`

File pattern or array of patterns to load external functions from. Functions should be
defined in `yr.externals` namespace.

#### options.postprocess
Type: `Function`

Define compiled code transformation or extension.

```javascript
grunt.initConfig({
  yate: {
    options: {
      postprocess: function(code) {
        // Example: augment particular strings at compile time:
        return code.replace('{time}', Date.now());
      }
    }
    // ...
  }
});
```

#### options.writeAST
Type: `Boolean`
Default value: `false`

Write parsed AST files at the location of templates. Should speed up builds as the parsing stage is skipped for unchanged files.

### Usage Examples

Compile single file:

```javascript
grunt.initConfig({
  yate: {
    options: {},
    dist: {
      files: {
        'templates/compiled/index.js': [
          'templates/src/index.yate',
          'templates/src/blocks/*.yate'
        ]
      }
    }
  }
});
```

Compile multiple files, using one-to-one mapping:

```javascript
grunt.initConfig({
  yate: {
    options: {
      runtime: false
    },
    dist: {
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
  }
});
```

#### Using imports

YATE module:
```html
module "module1"
match .* module1-match1 {

}
```
YATE template:
```html
module "tmpl1"
import "module1"
match / xb-button {
    apply .* module1-match1
}
```

```javascript
grunt.initConfig({
  yate: {
    options: {
      import: [
        'lib/**/*.yate.obj'
      ]
    },
    dist: {
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
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
