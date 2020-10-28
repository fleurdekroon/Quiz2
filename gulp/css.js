module.exports = function task(gulp, config, plugins) {
	const
		autoprefixer = require('autoprefixer'),
		cssnano = require('cssnano');

	/**
	 *
	 * @param {*} error
	 */
	function handleError(error) {
		var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

		plugins.notify({
			title: 'Task Failed [' + error.plugin + ']',
			message: lineNumber + 'See console.'
		}, plugins.notify.logLevel(0)).write(error);

		// Inspect the error object
		//console.log(error);

		// Easy error reporting
		//console.log(error.toString());

		// Pretty error reporting
		var report = '';

		report += plugins.chalk.white.bgRed('TASK:') + ' [' + error.plugin + ']\n';
		report += plugins.chalk.white.bgRed('ERROR:') + ' ' + error.message + '\n';
		if (error.lineNumber) { report += plugins.chalk.red('LINE:') + ' ' + error.lineNumber + '\n'; }
		if (error.fileName)   { report += plugins.chalk.red('FILE:') + ' ' + error.fileName + '\n'; }

		console.error(report);

		// Prevent the 'watch' task from stopping
		this.emit('end');
	}


	gulp.task('build:css', function buildTask() {
		return gulp.src(`${ config.src.css }**/*.scss`)
			// Make sure errors don't stop the gulp process.
			.pipe(plugins.plumber())
			// Create a source map when not in development mode
			.pipe(plugins.if((!config.production), plugins.sourcemaps.init()))
			// Convert the SCSS to CSS
			.pipe(plugins.sass()).on('error', handleError)
			// For production use the autoprefixer and minify the CSS
			.pipe(plugins.if((config.production), plugins.postcss([autoprefixer(), cssnano()])))
			// Write a source map when not in development mode
			.pipe(plugins.if((!config.production), plugins.sourcemaps.write('.')))
			// Write the output to disk.
			.pipe(gulp.dest(config.output.css))
	});

	gulp.task('watch:css', function watchTask() {
		gulp.watch(`${ config.src.css }**/*.scss`, gulp.series('build:css'));
	});
}
