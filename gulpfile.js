process.env.NODE_ENV = 'development';//'production';

const gulp = require('gulp');

const clean = require('gulp-clean');

const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const uglify = require('gulp-uglify');

const webpack = require('webpack-stream');

const sass = require('gulp-sass');
const minify = require('gulp-minify-css');

const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const bulkSass = require('gulp-sass-bulk-import');

const livereload = require('gulp-livereload');

const svgmin = require('gulp-svgmin');

function swallowError (error) {
    console.error(error.toString());
    this.emit('end');
}

gulp.task('default', function() {
    gulp.src('bundle/app.js')
        .pipe(webpack(require('./webpack.config')))
        .on('error', swallowError)
        .pipe(gulp.dest('.'))
        .pipe(livereload({start: true}));
});

gulp.task('scss', function(){
    gulp.src('scss/**/*.scss')
        //.pipe(sourcemaps.init())
        .pipe(bulkSass())
        .pipe(sass({
            includePaths: ['scss']
        }).on('error', swallowError))
        .pipe(autoprefixer())
        .pipe(minify())
        //.pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('.'))
});

gulp.task('watch', function(){
    livereload.listen();

    gulp.watch('scss/**/*.scss', ['scss']);
    gulp.watch('bundle/**/*.js', ['default']);

    gulp.watch('*.*', livereload.reload);

});

