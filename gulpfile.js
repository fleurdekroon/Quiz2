const gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	argv = require('yargs').argv,
	config = {
		output: {
			base: './dev/',
			css: './dev/css/',
			html: './dev/',
			img: './dev/img/',
			js: './dev/js/'
		},
		production: argv.mode === 'production',
		src: {
			css: './src/css/',
			html: './src/html/',
			img: './src/img/',
			js: './src/js/'
		}
	};

plugins.chalk = require('chalk');

// Load the tasks, these needs to be done after config is fully setup.
require('./gulp/clean')(gulp, config, plugins);
require('./gulp/css')(gulp, config, plugins);
require('./gulp/html')(gulp, config, plugins);
require('./gulp/img')(gulp, config, plugins);
require('./gulp/js')(gulp, config, plugins);

// Global Gulp tasks. These are the taks that will usually be run from the CLI.
gulp.task('webserver', function webserver(taskReady) {
	return gulp.src('dev').pipe(
		plugins.serverLivereload({
			directoryListing: false,
			livereload: true,
			open: true,
			port: 1337
		})
	);
});

gulp.task('build', function build(taskReady) {
	gulp.series(
		'clean',
		gulp.parallel('build:html', 'build:css', 'build:js', 'build:img'),
	)(taskReady);
});

gulp.task('dev', function devTask(taskReady) {
	gulp.series(
		'build',
		gulp.parallel('watch:css', 'watch:html', 'watch:js', 'webserver')
	)(taskReady);
});
