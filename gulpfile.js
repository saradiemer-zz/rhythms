var gulp = require('gulp');
var gulpIf = require('gulp-if');
var changed = require('gulp-changed');
var jshint = require('gulp-jshint');
var fileinclude = require('gulp-file-include');
var minifyHTML = require('gulp-minify-html');
var useref = require('gulp-useref');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpSequence = require('gulp-sequence');
var browserSync = require('browser-sync');
var htmlreplace = require('gulp-html-replace');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var requireDir = require('require-dir');

requireDir('./gulp-tasks');

var config = {
    bootstrapDir: './bower_components/bootstrap',
    devDir: './development',
    publicDir: './public',
		T4Dir: './T4',
};

gulp.task('lint', function() {
  return gulp.src(['./development/js/*.js','!./development/js/video*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('minify', function(){
  return gulp.src('./development/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest(config.publicDir + '/js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.publicDir + '/js'));
});

gulp.task('minify-css', function() {
    return gulp.src('./public/css/styles.css')
        .pipe(cssnano({ zindex: false }))
        .pipe(gulp.dest('./public/css-min/'));
});

gulp.task('fileinclude', function() {
  gulp.src(['./development/*.html'])
    .pipe(fileinclude())
    .pipe(gulp.dest('./public'));
});

gulp.task('sass', function() {
    return gulp.src(config.devDir + '/scss/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
		.pipe(sass())
		.pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('sass-home', function() {
    return gulp.src(config.devDir + '/scss-home/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
		.pipe(sass())
		.pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(config.publicDir + '/css-home'));
});

gulp.task('sass-parallax', function() {
    return gulp.src(config.devDir + '/scss-parallax/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
		.pipe(sass())
		.pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(config.publicDir + '/css-parallax'));
});

gulp.task('sass-quiz', function() {
    return gulp.src(config.devDir + '/scss-quiz/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
		.pipe(sass())
		.pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(config.publicDir + '/css-quiz'));
});

gulp.task('sass-search', function() {
    return gulp.src(config.devDir + '/scss-search-landing-page/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
		.pipe(sass())
		.pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(config.publicDir + '/css-search-landing'));
});

gulp.task('sass-print', function() {
    return gulp.src(config.devDir + '/scss-print/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
		.pipe(sass())
		.pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('fonts', function() {
    return gulp.src(config.devDir + '/fonts/**/*')
    .pipe(gulp.dest(config.publicDir + '/fonts'));
});

gulp.task('useref', function() {
  return gulp.src('./development/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest(config.publicDir));
});

gulp.task('index', ['useref'], function () {
  var target = gulp.src('./development/*.html');
  var sources = gulp.src(['./public/js/**/all.min.js', './public/css/**/*.css'], {read: false});
 	return target.pipe(inject(sources, {ignorePath: 'public/', addRootSlash: false}))
 	.pipe(gulpIf('*.html', fileinclude({prefix: '@@', basepath: '@file'})))
	.pipe(gulp.dest(config.publicDir));
});

gulp.task('images', function(){
  return gulp.src('development/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('public/images'))
});

gulp.task('html-watch', ['index'], browserSync.reload);
gulp.task('sass-watch', ['sass'], browserSync.reload);
gulp.task('sass-home-watch', ['sass-home'], browserSync.reload);
gulp.task('sass-parallax-watch', ['sass-parallax'], browserSync.reload);
gulp.task('sass-quiz-watch', ['sass-quiz'], browserSync.reload);
gulp.task('sass-search-watch', ['sass-search'], browserSync.reload);
gulp.task('sass-print-watch', ['sass-print'], browserSync.reload);
gulp.task('js-watch', ['minify'], browserSync.reload);


gulp.task('serve', ['lint', 'sass', 'sass-home', 'sass-parallax', 'sass-quiz', 'sass-search', 'sass-print', 'index', 'minify'], function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    }  );
    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch('./development/**/*.html', ['html-watch']);
		gulp.watch(config.devDir + '/scss/**/*.scss', ['sass-watch']);
		gulp.watch(config.devDir + '/scss-home/**/*.scss', ['sass-home-watch']);
    gulp.watch(config.devDir + '/scss-parallax/**/*.scss', ['sass-parallax-watch']);
    gulp.watch(config.devDir + '/scss-quiz/**/*.scss', ['sass-quiz-watch']);
    gulp.watch(config.devDir + '/scss-search-landing-page/**/*.scss', ['sass-search-watch']);
		gulp.watch(config.devDir + '/js/**/*.js', ['js-watch']);
});

gulp.task('default', gulpSequence(['serve', 'fonts', 'minify-css'], 't4_media', 't4_css', 't4_css_parallax', 't4_nav'));

//END GULP.JS
