var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('generate-manifest', function() {
    gulp.src(['images/*', 'src/manifest.json'])
        .pipe(zip('helloworldapp.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['generate-manifest'], function() {
    console.log('Build completed. Output in dist folder');
});