module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var cfg = {
        src: './',
        cwd: './mobile',
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
                        // Serve static files.
                        connect.static(options.base)
                        // Make empty directories browsable.
                        // connect.directory(options.base),
                    ];
                }
            },
            server: {
                options: {
                    // keepalive: true,
                    base: cfg.src
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
                files: [cfg.cwd + '/js/**']
                // tasks: ['jshint']
            },
            less:  {
                files: [cfg.cwd + '/css/**/*.less'],
                tasks: ['less']
            }
        },

        less: {
            combile: {
                options: {
                    // paths: ["mobile/css"]
                },
                files: {
                    'mobile/css/main.css': 'mobile/css/main.less'
                }
            }
        },

        jshint: {
            options:  grunt.file.readJSON('.jshintrc'),
            hint: {
                src: ['mobile/js/**/*.js', '!mobile/js/sea.js', '!mobile/js/vendor/**']
            }
        },

        uglify : {
            ugly: {
                src: ['mobile/js/**/*.js', '!mobile/js/sea.js', '!mobile/js/handlebars.js'],
                dest: 'dest/uglify.js'
            }
        },
        // combo: {
        //     options: {
        //         // sourceMap: {
        //         //     // sourceRoot: '/src/'
        //         // }
        //     },
        //     build: {
        //         files: [{
        //             expand: true,
        //             cwd: 'test/src/',
        //             src: '**/*.js',
        //             dest: 'test/dist',
        //             ext: '.combo.js'
        //         }]
        //     }
        // },
        // browserify: {
        //     files: {
        //         'mobile/js/bbbbbbbbbbbbb.js': [cfg.cwd + '/js/init.js']
        //     },
        //     options: {
        //         transform: ['coffeeify']
        //     }
        // }
        browserify2: {
            // basic: {
            //     src: ['test/fixtures/basic/*.js'],
            //     dest: 'tmp/basic.js'
            // },

              // ignores: {
              //   src: ['test/fixtures/ignore/*.js'],
              //   dest: 'tmp/ignores.js',
              //   options: {
              //     ignore: ['test/fixtures/ignore/ignore.js', 'os']
              //   }
              // },

              // alias: {
              //   src: ['test/fixtures/alias/entry.js'],
              //   dest: 'tmp/alias.js',
              //   options: {
              //     alias: ['test/fixtures/alias/toBeAliased.js:alias']
              //   }
              // },

              // aliasString: {
              //   src: ['test/fixtures/alias/entry.js'],
              //   dest: 'tmp/aliasString.js',
              //   options: {
              //     alias: 'test/fixtures/alias/toBeAliased.js:alias'
              //   }
              // },

              // aliasMappings: {
              //   src: ['test/fixtures/aliasMappings/**/*.js'],
              //   dest: 'tmp/aliasMappings.js',
              //   options: {
              //     aliasMappings: [
              //       {
              //         cwd: 'test/fixtures/aliasMappings/',
              //         src: ['**/*.js'],
              //         dest: 'tmp/shortcut/',
              //         flatten: true
              //       },
              //       {
              //         cwd: 'test/fixtures/aliasMappings/foo/',
              //         src: ['**/*.js'],
              //         dest: 'tmp/other/'
              //       }
              //     ]
              //   }
              // },

              // external: {
              //   src: ['test/fixtures/external/entry.js', 'text/fixtures/external/b.js'],
              //   dest: 'tmp/external.js',
              //   options: {
              //     external: ['test/fixtures/external/a.js', 'events', 'vendor/alias']
              //   }
              // },

              // 'external-dir': {
              //   src: ['test/fixtures/external-dir/*.js'],
              //   dest: 'tmp/external-dir.js',
              //   options: {
              //     external: ['test/fixtures/external-dir/b']
              //   }
              // },

              // externalize: {
              //   src: ['test/fixtures/externalize/b.js'],
              //   dest: 'tmp/externalize.js',
              //   options: {
              //     alias: [
              //       'test/fixtures/externalize/a.js:test/fixtures/externalize/a.js',
              //       'events'
              //     ]
              //   }
              // },

              // noParse: {
              //   src: ['test/fixtures/noParse/*.js'],
              //   dest: 'tmp/noParse.js',
              //   options: {
              //     noParse: ['test/fixtures/noParse/jquery.js']
              //   }
              // },
                compile: {
                    entry: cfg.cwd + '/js/init.js',
                    compile: 'mobile/js/aaaaaaaaaaaaaaaa.js',
                },

              // shim: {
              //   src: ['test/fixtures/shim/a.js', 'test/fixtures/shim/shim.js'],
              //   dest: 'tmp/shim.js',
              //   options: {
              //     shim: {
              //       shimmedJQ: {
              //         path: 'test/fixtures/shim/jquery.js',
              //         exports: '$'
              //       }
              //     }
              //   }
              // },

              // sourceMaps: {
              //   src: ['test/fixtures/basic/*.js'],
              //   dest: 'tmp/sourceMaps.js',
              //   options: {
              //     debug: true
              //   }
              // }
            },
            // dev: {
            //     entry: './build/entry.js',
            //     mount: '/application.js',
            //     server: './build/server.js',
            //     debug: true
            // },

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
        // 'uglify'
        'browserify2'
    ]);
};