module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var cfg = {
        src: './asset/src/',
        dest: './asset/dist/',
        build: './.build/',
        serverHost: '0.0.0.0',
        serverPort: 9000,
        livereload: 35729
    };
    grunt.initConfig({
        pkg: pkg,
        cfg: cfg,
        connect: {
            options: {
                port: cfg.serverPort,
                hostname: cfg.serverHost,
                middleware: function (connect, options) {
                    return [
                        require('connect-livereload')({
                            port: cfg.livereload
                        }),
                        connect.static(options.base)
                    ];
                }
            },
            server: {
                options: {
                    base: './'
                }
            }
        },
        open: {
            server: {
                url: 'http://127.0.0.1:' + cfg.serverPort
            }
        },
        watch: {
            options: {
                livereload: cfg.livereload
            },
            scripts:  {
                files: [cfg.src + 'js/**'],
                tasks: ['browserify', 'jshint']
            },
            less:  {
                files: [cfg.src + 'css/**/*.less'],
                tasks: ['less']
            }
        },

        less: {
            combile: {
                files: {
                    './asset/dist/css/main.css' : cfg.src + 'css/main.less'
                }
            }
        },

        jshint: {
            options:  grunt.file.readJSON('.jshintrc'),
            hint: {
                src: [cfg.src + 'js/**/*.js', '!' + cfg.src + 'js/vendor/**']
            }
        },
        clean : {
            folder: cfg.dest
        },
        copy : {
            main: {
                files: [
                    {
                        src: [cfg.src + '**'],
                        dest: cfg.build,
                        filter: 'isFile'
                    }
                ]
            }
        },
        uglify : {
            jsbuild: {
                options: {
                    mangle : true
                },
                src: [cfg.build + '**/*.js'],
                dest: cfg.dest + 'js/main-min.js'
            }
        },
        unicode: {
            main: {
                files: [{
                    expand: true,
                    src: cfg.build + '**.*',
                    dest: cfg.dest + '**.*'
                }]
            }
        },

        browserify: {
            basic: {
                options: {
                    debug : true
                },
                src: [cfg.src + 'js/main.js'],
                dest: cfg.dest + 'js/main.js'
            }
        }
    });

    // Load the plugin
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //  task(s)
    grunt.registerTask('default', [
        'connect:server',
        'open:server',
        'watch'
    ]);
    grunt.registerTask('lint', [
        'jshint'
    ]);
    grunt.registerTask('build', [
        'clean',
        'copy',
        'browserify',
        'unicode',
        'uglify'
    ]);
};