module.exports = function (grunt) {
	var pkg = grunt.file.readJSON('package.json');
	var cfg = {
		src: './',
		cwd: 'mobile',
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
						connect.static(options.base),
						// Make empty directories browsable.
						// connect.directory(options.base),
					];
				}
			},
			server: {
				options: {
					// keepalive: true,
					base: cfg.src,
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
				livereload: cfg.livereload,
			},
			scripts:  {
				files: [cfg.cwd + '/js/**'],
				tasks: ['jshint']
			},
			less:  {
				files: [cfg.cwd + '/css/**/*.less'],
				tasks: ['less']
			},
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
			},
		},

		uglify : {
			ugly: {
				src: ['mobile/js/**/*.js', '!mobile/js/sea.js', '!mobile/js/handlebars.js'],
				dest: 'dest/uglify.js'
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
	grunt.registerTask('build', [
		'uglify'
	]);
};