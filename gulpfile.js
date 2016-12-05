var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var argv = require('yargs').argv;
var git = require('gulp-git');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');


var theme = "themes/brennanhampton/"
var content = "content-brennanhampton/"

gulp.task('browser-sync', function() {
  browserSync({
    proxy: {
     target: "http://core",
    }

  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src(theme + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(theme + 'images/build/'));
});

gulp.task('styles', function(){
  gulp.src([theme + 'scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }})) 
    .pipe(sourcemaps.init())
    .pipe(sass())

    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(theme))
//   .pipe(rename({suffix: '.min'}))
//   .pipe(minifycss())
//    .pipe(gulp.dest('/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src(theme + 'scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(theme + 'scripts/build/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(theme + 'scripts/build/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('gitadd', function(){
  console.log('adding');
  return gulp.src('.')
    .pipe(git.add());
});

gulp.task('gitcommit', function(){
  console.log('commiting');
  return gulp.src('')
    .pipe(git.commit('initial commit'));
});


/*
gulp.task('gitpush', function(){
  console.log('pushing...');
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});
*/


gulp.task('gitsend', function() {
  runSequence('gitadd', 'gitcommit');
});

gulp.task('default', ['browser-sync', 'styles', 'gitsend'], function(){
  gulp.watch(theme + "scss/**/*.scss", ['styles']);
//  gulp.watch(theme + "scripts/**/*.js", ['scripts']);
  gulp.watch(content + "**/*.md", ['bs-reload']);
});