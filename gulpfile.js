var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

var app = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};

gulp.task('lib', async() => {
    await gulp.src('bower_components/**/*.js')
    .pipe(gulp.dest(app.devPath + 'vendor'))
    .pipe(gulp.dest(app.prdPath + 'vendor'))
    .pipe($.connect.reload());
});

gulp.task('html', async() => {
    await gulp.src(app.srcPath + '**/*.html')
    .pipe(gulp.dest(app.devPath))
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload());
});

gulp.task('json', async() => {
    await gulp.src(app.srcPath + 'data/**/*.json')
    .pipe(gulp.dest(app.devPath + 'data'))
    .pipe(gulp.dest(app.prdPath + 'data'))
    .pipe($.connect.reload());
});

gulp.task('less', async() => {
    await gulp.src(app.srcPath + 'style/index.less')
    .pipe($.less())
    .pipe(gulp.dest(app.devPath + 'css'))
    .pipe($.cssmin())
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe($.connect.reload());
});

gulp.task('js', async() => {
    await gulp.src(app.srcPath + 'script/**/*.js')
    .pipe($.concat('index.js'))
    .pipe(gulp.dest(app.devPath + 'js'))
    .pipe($.uglify())
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload());
});

gulp.task('image', async() => {
    await gulp.src(app.srcPath + 'image/**/*')
    .pipe(gulp.dest(app.devPath + 'image'))
    .pipe($.imagemin())
    .pipe(gulp.dest(app.prdPath + 'image'))
    .pipe($.connect.reload());
});

gulp.task('build', gulp.series('image', 'js', 'less', 'lib', 'html', 'json'));

gulp.task('clean', async() => {
    gulp.src([app.devPath, app.prdPath])
    .pipe($.clean());
});

gulp.task('serve', gulp.series('build', function() {
    $.connect.server({
        root: [app.devPath],
        livereload: true,
        port: 3000
    });

    open('http://localhost:3000');

    gulp.watch('bower_components/**/*', gulp.series('lib'));
    gulp.watch(app.srcPath + '**/*.html', gulp.series('html'));
    gulp.watch(app.srcPath + 'data/**/*.json', gulp.series('json'));
    gulp.watch(app.srcPath + 'style/**/*.less', gulp.series('less'));
    gulp.watch(app.srcPath + 'script/**/*.js', gulp.series('js'));
    gulp.watch(app.srcPath + 'image/**/*', gulp.series('image'));

}));

gulp.task('default', gulp.series('serve'));