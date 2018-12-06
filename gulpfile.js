const gulp=require("gulp");
gulp.task('watch2', function () {
    gulp.watch('public/js/*.js', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});