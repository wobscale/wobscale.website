var gulp       = require('gulp'),
    jade       = require('gulp-jade'),
    data       = require('gulp-data'),
    awspublish = require('gulp-awspublish'),
    cloudfront = require('gulp-cloudfront-invalidate-aws-publish');

gulp.task('jade', function() {
  gulp.src(['**/*.jade', '!./templates/*.jade'])
    .pipe(data(function(file) {
      return {file: file.clone()};
    }))
    .pipe(jade())
    .pipe(gulp.dest('./_site'));
});

gulp.task('favicon', function() {
  gulp.src('./favicon.*').pipe(gulp.dest('./_site'));
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

gulp.task('build', ['jade', 'bootstrap', 'css', 'favicon']);

gulp.task('watch', function() {
  gulp.watch('**/*.jade', ['jade']);
  gulp.watch('css/*', ['css']);
  gulp.watch('./favicon.*', ['favicon']);
});

gulp.task('default', ['build']);

gulp.task('upload-s3', ['build'], function() {
  // Deployment is: put it in da s3 bucket and invalidate cloudfront caching.
  var publisher = awspublish.create({region: 'us-east-1', params: {Bucket: 'www.wobscale.website'}});
  var cfnDist = process.env.CLOUDFRONT_DISTRIBUTION;
  gulp.src('./_site/**')
    .pipe(publisher.publish())
    .pipe(publisher.sync())
    .pipe(cloudfront({distribution: cfnDist}))
    .pipe(awspublish.reporter());
});

gulp.task('deploy', ['upload-s3']);
