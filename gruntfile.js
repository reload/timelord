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
        options: {
          livereload: true
        },
        files: ['css/*.css'],
        tasks: ['cssmin']
      },
      coffee: {
        files: ['js/cs/*.coffee'],
        tasks: ['coffee']
      }
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
    // Uglify.
    uglify: {
      dev: {
        files: {
          'js/vendor.min.js': [
            'vendor/angular/angular.js',
            'vendor/angular-loading-bar/src/loading-bar.js',
            'vendor/angular-route/angular-route.js',
            'vendor/jquery/dist/jquery.js',
            'vendor/bootstrap/dist/js/bootstrap.min.js',
            'vendor/chartjs/Chart.js'
          ]
        }
      }
    },
    // CSSmin.
    cssmin: {
      combine: {
        files: {
          'css/main.min.css': [
            'css/main.css'
          ],
          'vendor/vendor.min.css': [
            'vendor/bootstrap/dist/css/bootstrap.min.css'
          ]
        }
      }
    },
    // Copy.
    copy: {
      main: {
        files: [
          { // Copy fontawesome fonts to the "fonts" directory.
            expand: true,
            flatten: true,
            src: [
              'vendor/bootstrap/dist/fonts/*'
            ],
            dest: 'fonts/',
            filter: 'isFile'
          }
        ]
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
          noLineComments: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'compass:dev',
    'coffee',
    'uglify',
    'cssmin',
    'copy',
    'watch'
  ]);
};
