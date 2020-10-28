module.exports = function clean(gulp, config, plugins) {
	const
		del = require('del');

	gulp.task('clean', function cleanTask() {
		// Remove all the files in the output folder.
		return del(`${ config.output.base }**`);
	});
};
