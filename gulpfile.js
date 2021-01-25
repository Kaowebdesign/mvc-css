/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp                      = require('gulp'),
    del                       = require('del'),
    sourcemaps                = require('gulp-sourcemaps'),
    plumber                   = require('gulp-plumber'),
    sass                      = require('gulp-sass'),
    autoprefixer              = require('gulp-autoprefixer'),
    minifyCss                 = require('gulp-clean-css'),
    babel                     = require('gulp-babel'),
    webpack                   = require('webpack-stream'),
    uglify                    = require('gulp-uglify'),
    concat                    = require('gulp-concat'),
    imagemin                  = require('gulp-imagemin'),
    browserSync               = require('browser-sync').create(),
    dependents                = require('gulp-dependents'),

    scss_folder                = './scss/',
    dist_folder               = './dist/',
    dist_assets_folder        = dist_folder,
    node_modules_folder       = './node_modules/',
    dist_node_modules_folder  = dist_folder + 'node_modules/',

    node_dependencies         = Object.keys(require('./package.json').dependencies || {});

gulp.task('clear', () => del([ dist_folder ]));

gulp.task('scss', () => {
    return gulp.src([
        scss_folder + '**/*.scss'
    ], { since: gulp.lastRun('scss') })
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(dependents())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist_assets_folder+'css'))
        .pipe(browserSync.stream());
});

gulp.task('build', gulp.series('clear',  'scss'));

gulp.task('dev', gulp.series('scss'));

gulp.task('serve', () => {
    return browserSync.init({
        server: {
            baseDir: [ 'dist' ]
        },
        port: 3000,
        open: false
    });
});

gulp.task('watch', () => {

    const watch = [
        scss_folder + '**/*.scss',
    ];

    gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));