const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const gulpUtil = require('gulp-util');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');

gulp.task('ref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function() {
  return gulp.src([
      'app/js/components/*.js',
      'app/js/*.js'
    ])
    .pipe(gulpIf('*.js', babel({presets: ['env']})))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(concat('main.min.js'))
    .on('error', function (err) { gulpUtil.log(gulpUtil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('dist'))
});

gulp.task('build', ['scripts', 'ref']);

gulp.task('watch', function(){
  gulp.watch('app/js/**/*.js', ['build']);
});
