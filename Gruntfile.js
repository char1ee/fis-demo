module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            express: {
              files:  [ '**/*.js' ],
              tasks:  [ 'express:dev' ],
              options: {
                nospawn: true,
                livereload: 35729
              }
            }
          },
       express: {
          options: {
            // Override defaults here
          },
          dev: {
            options: {
              script: 'app.js'
            }
          },
          // prod: {
          //   options: {
          //     script: 'path/to/prod/server.js',
          //     node_env: 'production'
          //   }
          // }
          // test: {
          //   options: {
          //     script: 'path/to/test/server.js'
          //   }
          // }
        },

    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    // Default task(s).
    grunt.registerTask('server', [ 'express:dev', 'watch' ]);
};