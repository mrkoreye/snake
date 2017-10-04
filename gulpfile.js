var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var inject = require('gulp-inject-string');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var fs = require('fs');
var rename = require('gulp-rename');
var gulpStylelint = require('gulp-stylelint');
var connect = require('gulp-connect');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var webpack = require('webpack-stream');
var cssBase64 = require('gulp-css-base64');

gulp.task('default', function() {
  return gulp.src('src/entry.js')
    .pipe(webpack())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'lint:scss',
    'clean',
    'copy:assets',
    'scss',
    'postcss',
    'css:base64',
    'js',
    'inject:html',
    'inject:js',
    'inject:css',
    'html:min',
    'inject:build-comment',
    'rename-index',
    callback
  );
});

gulp.task('clean', function() {
  return del([
    'build',
    'index.html'
  ])
});

gulp.task('lint:scss', function() {
  return gulp
    .src('src/**/*.scss')
    .pipe(gulpStylelint({
        reporters: [{
            formatter: 'string', 
            console: true
        }]
    }));
})

gulp.task('scss', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('copy:assets', function() {
  return gulp.src('assets/**')
    .pipe(gulp.dest('build/assets'));
});

gulp.task('postcss', function() {
  return gulp.src('build/**/*.css')
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('build'));
});

gulp.task('css:base64', function() {
  return gulp.src('build/**/*.css')
    .pipe(cssBase64())  
    .pipe(gulp.dest('build'));
});

gulp.task('js', function() {
  return gulp.src('src/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('build'));
});

gulp.task('html:min', function() {
  return gulp.src('build/shell.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:html', function() {
  return gulp.src('src/shell.html')
    .pipe(inject.after('<body>', fs.readFileSync('src/main.html').toString()))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:js', function() {
  return gulp.src('build/shell.html')
    .pipe(inject.after('<script>', fs.readFileSync('build/main.js').toString()))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:css', function() {
  return gulp.src('build/shell.html')
    .pipe(inject.after('<style>', fs.readFileSync('build/main.css').toString()))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:build-comment', function() {
  return gulp.src('build/shell.html')
    .pipe(inject.prepend('<!-- Generated: ' + Date() + ' -->\n'))
    .pipe(gulp.dest('build'));
});

gulp.task('rename-index', function() {
  return gulp.src('build/shell.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  return gulp.watch(['src/*'], function() {
    runSequence('build', 'reload');
  });
});

gulp.task('connect', function() {
  return connect.server({
    root: ['build'],
    livereload: true
  });
});
 
gulp.task('reload', function () {
  return gulp.src('src/**')
    .pipe(connect.reload());
});
 
gulp.task('develop', function() {
  return runSequence(
    'build', 
    'watch', 
    'connect'
  );
});

gulp.task('copy:dist', function() {
  return gulp.src('build/index.html')
    .pipe(rename('404.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('release', function() {
  return runSequence(
    'build',
    'copy:dist'
  )
});
