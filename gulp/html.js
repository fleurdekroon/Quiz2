module.exports = function task(gulp, config, plugins) {
	gulp.task('build:html', function buildTask() {
		// Only use the HTML files in the root of the src.html folder as input,
		// the HTML files in the partials folder should NOT be processed by Gulp
		// as input files.
		return gulp.src(`${ config.src.html }*.html`)
			// Make sure errors don't stop the gulp process.
			.pipe(plugins.plumber())
			// Replace the partial placeholders with their actual content.
			.pipe(plugins.injectPartials())
			.pipe(plugins.removeCode({ production: config.production }))
			// Write the output to disk.
			.pipe(gulp.dest(config.output.html));
	});

	gulp.task('watch:html', function watchTask() {
		// Watch the index file but also the partials, when any of these files
		// are changed the site should be updated.
		gulp.watch(`${ config.src.html }**/*.html`, gulp.series('build:html'));
	});
}
