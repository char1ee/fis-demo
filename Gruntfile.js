module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options:  grunt.file.readJSON('.jshintrc'),
            hint: {
                src: ['mobile/js/**/*.js', '!mobile/js/sea.js', '!mobile/js/handlebars.js']
            },
        },

        uglify : {
            ugly: {
                cwd:'mobile/js',
                src: ['**/*.js', '!/sea.js', '!/handlebars.js'],
                dest: 'dest/uglify.js'
            }
        }
    });

    // Load the plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s)
    grunt.registerTask('default', [
        'jshint'
    ]);
    grunt.registerTask('pack', [
        'uglify'
    ]);
};