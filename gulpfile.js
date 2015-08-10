/* globals require, exports */

'use strict';

// gulp plugins
var gulp     = require('gulp'),
gutil        = require('gulp-util'),
es           = require('event-stream'),
sass         = require('gulp-sass'),
rubysass     = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
jshint       = require('gulp-jshint'),
coffee       = require('gulp-coffee'),
clean        = require('gulp-clean'),
connect      = require('gulp-connect'),
browserify   = require('gulp-browserify'),
usemin       = require('gulp-usemin'),
imagemin     = require('gulp-imagemin'),
rename       = require('gulp-rename'),
concat       = require('gulp-concat'),
jade         = require('gulp-jade'),
csscomb      = require('gulp-csscomb'),
jsmin        = require('gulp-jsmin'),
minifyCss = require('gulp-minify-css');

// Connect Task
gulp.task('connect', connect.server({
  root: ['./app'],
  port: 1337,
  livereload: true
}));

// Html reload
gulp.task('html', function () {
  return gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

// jade template
gulp.task('templates', function() {
  return gulp.src('./app/views/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest('./app/'));
});

// sass compiler task
gulp.task('sass', function () {
  return rubysass('./app/styles/app.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
     })
    .pipe(minifyCss())
    .pipe(gulp.dest('./app/dist/styles/'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(connect.reload());
});

//vendors foundation
gulp.task('foundation', function() {
  return gulp.src('./app/vendors/**/*.scss')
    .pipe(sass({
      includePaths: ['vendors/foundation/scss/'],
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./app/dist/styles/'));
});

//csscomb
gulp.task('csscomb', function() {
  return gulp.src('./app/styles/**/*.scss')
    .pipe(csscomb())
    .pipe(gulp.dest('./app/styles'))
})

// Minify images
gulp.task('imagemin', function () {
  return es.concat(
    gulp.src('./app/images/**/*.png')
      .pipe(imagemin())
      .pipe(gulp.dest('/dest/img')),
    gulp.src('./app/images/**/*.jpg')
      .pipe(imagemin())
      .pipe(gulp.dest('/dest/img')),
    gulp.src('./app/images/**/*.gif')
      .pipe(imagemin())
      .pipe(gulp.dest('/dest/img'))
  );
});

// CoffeeScript compiler task
gulp.task('coffee', function () {
  return gulp.src('./app/scripts/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('all.js'))
    .pipe(jsmin())
    .pipe(gulp.dest('./app/dist/scripts/'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch([ './app/styles/**/*.scss'], ['sass']);
  gulp.watch([ './app/scripts' + '/**/*.coffee'], ['coffee']);
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/views/**/*.jade'], ['templates']);
});

gulp.task('server', ['connect', 'sass', 'coffee', 'watch', 'templates']);

gulp.task('clean', function () {
  gutil.log('Clean task goes here...');
});

gulp.task('usemin', function () {
  gulp.src('./app/**/*.html')
    .pipe(usemin())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean-build', function () {
  return gulp.src('dist/', {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean-build', 'sass', 'coffee', 'imagemin', 'usemin'], function () {
});

gulp.task('default', function () {
  gutil.log('Default task goes here...');
});
