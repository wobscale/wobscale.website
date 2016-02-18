var gulp = require('gulp'),
    jade = require('gulp-jade'),
    data = require('gulp-data');

gulp.task('jade', function() {
  gulp.src(['**/*.jade', '!./templates/*.jade'])
    .pipe(data(function(file) {
      return {file: file.clone()};
    }))
    .pipe(jade())
    .pipe(gulp.dest('./_site'));
});

gulp.task('css', function() {
  gulp.src('css/*').pipe(gulp.dest('./_site/css'));
});

gulp.task('bootstrap', ['tether'], function() {
  gulp.src(['./bootstrap/js/bootstrap.min.js']).pipe(gulp.dest('./_site/js'));
  gulp.src(['./bootstrap/css/bootstrap.min.css']).pipe(gulp.dest('./_site/css'));
});

gulp.task('tether', function() {
  gulp.src('./bower_components/tether/dist/js/tether.min.js').pipe(gulp.dest('./_site/js'));
  gulp.src('./bower_components/tether/dist/css/tether.min.css').pipe(gulp.dest('./_site/css'));
});

gulp.task('build', ['jade', 'bootstrap', 'css']);

gulp.task('watch', function() {
  gulp.watch('**/*.jade', ['jade']);
});

gulp.task('default', ['build']);
