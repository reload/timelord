module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Watch for changes and trigger compass with livereload on CSS files.
    watch: {
      scss: {
        options: {
          livereload: false
        },
        files: ['css/sass/*.scss'],
        tasks: ['compass']
      },
      css: {
        files: ['css/*.css','css_dev/*.css'],
        options: {
          livereload: true
        },
      },
      coffee: {
        files: ['js/cs/*.coffee'],
        tasks: ['coffee']
      },
      /*
      jshint: {
        files: ['Gruntfile.js' ,'js/*.js'],
        tasks: ['jshint']
      }
      */
    },

    coffee: {
      compile: {
        files: {
          'js/main.js': ['js/cs/main.coffee']
        }
      }
    },

    // Checkstyle on javascript with jshint.
    jshint: {
      files: ['Gruntfile.js' ,'js/*.js'],
      options: {
        reporter: require('jshint-stylish'),
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      }
    },

    concat: {
      scripts: {
        'src': [
          'vendor/jquery/dist/jquery.js',
          'vendor/underscore/underscore.js',
          //'vendor/bootstrap/js/*.js',
          'vendor/modernizr/modernizr.js',
          'vendor/angular/angular.js'
        ],
        'dest': 'js/vendor.js'
      }
    },

    // Compass and SCSS
    compass: {
      options: {
        httpPath: '',
        cssDir: 'css',
        sassDir: 'css/sass',
        imagesDir: 'img',
        javascriptsDir: 'js',
        fontsDir: 'css/fonts',
        assetCacheBuster: 'none',
        outputStyle: 'expanded',
        relativeAssets: true,
        raw: 'line_numbers = :false\n'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', [
    'compass',
    'coffee',
    'concat',
    //'jshint',
    'watch'
  ]);
};
