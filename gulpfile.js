var gulp = require('gulp'), 
	sass = require('gulp-sass'), 
	sourcemaps = require('gulp-sourcemaps'), 
	autoprefixer = require('gulp-autoprefixer'), 
	sassLint = require('gulp-sass-lint'),
	jsHint = require('gulp-jshint'),
	spritesmith = require('gulp.spritesmith'),
	gulpif = require('gulp-if'),
	browserify = require('gulp-browserify');
	
var autoprefixerOptions = {
	browsers : [ 'last 2 versions', '> 5%', 'Firefox ESR' ]
};

gulp.task('sass', function() {
	return gulp.src('./cartridge/scss/default/style.scss')
	// for compressing the css {outputStyle: 'compressed'}
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(sourcemaps.write()).pipe(gulp.dest('./cartridge/static/default/css/'));
});


gulp.task('sasslint', function () {
	gulp.src('./cartridge/scss/default/*.scss')
	.pipe(sass())
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('watch', function() {
	gulp.watch([ './cartridge/scss/default/**/*.scss', './cartridge/scss/default/*.scss' ],
	[ 'sass' ]);
});

gulp.task('jshint', function() {
	return gulp.src('./cartridge/js/**/*.js')
    .pipe(jsHint())
    .pipe(jsHint.reporter('gulp-jshint-html-reporter', {
        filename: './linters/' + '/jshint-output.html',
        createMissingFolders : false  
      }));
});

gulp.task('sprites', function () {
     var spriteData = gulp.src('./cartridge/sprites/*.{png,jpg}')
		.pipe(spritesmith({
         padding: 20,
         imgName: 'sprite.png',
         cssName: '_sprite.scss',
         imgPath: '../images/sprite.png'
		}));
     return spriteData.pipe(gulpif('*.png', gulp.dest('./cartridge/static/default/images/'), gulp.dest('./cartridge/scss/default/')));
 });

gulp.task('scripts', function() {
	// Single entry point to browserify 
	gulp.src('./cartridge/js/app.js')
		.pipe(browserify({
		  insertGlobals : true,
		  debug : !gulp.env.production
		}))
		.pipe(gulp.dest('./cartridge/static/default/js/'))
});

gulp.task('default', ['watch', 'scripts', 'sass']);
