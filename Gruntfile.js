/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.0.7',
      source: 'backbone.computedfields.js',
      sourceMin: 'backbone.computedfields.min.js',
      banner: '// Backbone.ComputedFields, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> alexander.beletsky@gmail.com\n' +
        '// Distributed under MIT license\n' +
        '// https://github.com/alexanderbeletsky/backbone.computedfields\n'
    },

    mocha: {
      test: {
        src: ['test/index.html'],
        options: {
          run: true
        }
      }
    },

    rig: {
      standard: {
        src: ['src/<%= meta.source %>'],
        dest: 'lib/<%= meta.source %>'
      },
      amd: {
        src: ['src/amd.js'],
        dest: 'lib/amd/<%= meta.source %>'
      }
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      },
      standard: {
        src: ['<%= meta.banner %>', '<%= rig.standard.dest %>'],
        dest: '<%= rig.standard.dest %>'
      },
      amd: {
        src: ['<%= meta.banner %>', '<%= rig.amd.dest %>'],
        dest: '<%= rig.amd.dest %>'
      }
    },

    uglify: {
      standard: {
        files: {
          'lib/<%= meta.sourceMin %>': ['<%= concat.standard.dest %>']
        }
      },
      amd: {
        files: {
          'lib/amd/<%= meta.sourceMin %>': ['<%= concat.amd.dest %>']
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          Backbone: true,
          _: true,
          Marionette: true,
          $: true,
          slice: true
        }
      },
      js: ['src/<%= meta.source %>']
    }
  });

  // Laoded tasks
  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['jshint', 'mocha', 'rig', 'concat', 'uglify']);
  grunt.registerTask('test', ['mocha']);
};
