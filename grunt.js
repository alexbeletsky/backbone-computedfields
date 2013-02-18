/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-mocha');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.0.5',
      banner: '// Backbone.ComputedFields, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> alexander.beletsky@gmail.com\n' + 
        '// Distributed under MIT license\n' + 
        '// https://github.com/alexanderbeletsky/backbone.computedfields'
    },

    lint: {
      files: ['src/backbone.computedfields*.js']
    },

    mocha: {
      all: ['test/index.html']
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/backbone.computedfields.js'],
        dest: 'lib/backbone.computedfields.js'
      },
      amd: {
        src: ['<banner:meta.banner>', 'src/amd.js'],
        dest: 'lib/amd/backbone.computedfields.js'
      }
    },

    min: {
      standard: {
        src: ['<banner:meta.banner>', '<config:rig.build.dest>'],
        dest: 'lib/backbone.computedfields.min.js'
      },
      amd: {
        src: ['<banner:meta.banner>', '<config:rig.amd.dest>'],
        dest: 'lib/amd/backbone.computedfields.min.js'
      },
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
        browser: true
      },
      globals: {
        jQuery: true,
        Backbone: true,
        _: true,
        Marionette: true,
        $: true,
        slice: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint mocha rig min');

};
