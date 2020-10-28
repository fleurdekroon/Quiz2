module.exports = function task(gulp, config, plugins) {
	const babel = require('gulp-babel');

	gulp.task('build:js:es6', function buildProdTask() {
		return gulp
			.src(`${config.src.js}**/*.ts`)
			.pipe(plugins.plumber())
			.pipe(babel())
			.pipe(gulp.dest(config.output.js));
	});

	gulp.task('build:js:es5', function buildProdTask() {
		return gulp
			.src(`${config.src.js}**/*.ts`)
			.pipe(plugins.plumber())
			.pipe(babel())
			.pipe(gulp.dest(config.output.js));
	});

	gulp.task('build:js:dev', function buildDevTask() {
		process.env.NODE_ENV = 'esm';

		return gulp
			.src(`${config.src.js}**/*.ts`)
			.pipe(plugins.plumber())
			.pipe(babel({
				envName: 'esm'
			}))
			.pipe(gulp.dest(config.output.js));
	});

	gulp.task('build:js', function buildTask(taskReady) {
		if (config.production) {
			gulp.series('build:js:es5', 'build:js:es6')(taskReady);
		} else {
			gulp.series('build:js:dev')(taskReady);
		}
	});

	gulp.task('watch:js', function watchTask() {
		gulp.watch([`${config.src.js}**/*.ts`, `!${config.src.js}**/*.test.ts`], gulp.series('build:js'));
	});
};
