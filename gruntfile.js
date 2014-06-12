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
        tasks: ['compass:dev']
      },
      css: {
        files: ['css/*.css'],
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
    // Concat.
    concat: {
      scripts: {
        'src': [
          //'vendor/modernizr/modernizr.js',
          'vendor/angular/angular.js'
        ],
        'dest': 'vendor/vendor.js'
      }
    },
    // Uglify.
    uglify: {
      dev: {
        files: {
          'js/vendor.min.js': ['vendor/vendor.js']
        }
      }
    },
    // Compass and SCSS
    compass: {
      options: {
        httpPath: '/profiles/scribo/themes/scribe',
        imagesDir: 'img',
        javascriptsDir: 'js',
        fontsDir: 'css/fonts',
        assetCacheBuster: 'none'
      },
      dev: {
        options: {
          cssDir: 'css',
          sassDir: 'css/sass',
          environment: 'development',
          outputStyle: 'expanded',
          relativeAssets: true,
          noLineComments: false
        }
      },
      bootstrap: {
        options: {
          cssDir: 'css',
          sassDir: 'vendor/bootstrap-sass/lib/',
          fontsDir: 'vendor/bootstrap-sass/fonts/',
          environment: 'development',
          outputStyle: 'compact',
          relativeAssets: true,
          noLineComments: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', [
    'compass:bootstrap',
    'compass:dev',
    'coffee',
    'concat',
    'uglify',
    //'jshint',
    'watch'
  ]);
};
