const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const scss = require('gulp-sass');


// порядок подкл css
const styleFiles = [
    './project/css/header.scss',
    './project/css/main.scss',
    './project/css/footer.scss',
    './project/css/media.scss'
];
// порядок подкл js
const jsFiles = [
    './project/js/main.js',
    './project/js/lib.js'
];
const normalizeFile = [
    './project/css/normalize.css'
];

gulp.task('normalize', function () {
    return gulp.src(normalizeFile)

        .pipe(concat('normalize.css'))
        .pipe(autoprefixer({
            cascade: false
        }))
        //    Минификация CSS
        .pipe(cleanCSS({
            level: 2
        }))
        //    --Минификация CSS--
        .pipe(gulp.dest('./build/css'))
});

// Стили
gulp.task('styles', function () {
    return gulp.src(styleFiles)

        .pipe(sourcemaps.init())
        .pipe(scss())
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
       cascade: false
     }))
    //    Минификация CSS
    .pipe(cleanCSS({
        level: 2
    }))
    //    --Минификация CSS--
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});
// Скрипты
gulp.task('scripts', function () {
    return gulp.src(jsFiles)

    .pipe(concat('main.js'))
    //    Минификация js
    .pipe(uglify({
        toplevel: true
    }))
    //    --Минификация js--
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});
gulp.task('del', function () {
    return del(['build/*'])
});
gulp.task('watch', function (done) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./project/css/**/*.css', gulp.series('styles'));
    gulp.watch('./project/css/**/*.scss', gulp.series('styles'));
    gulp.watch('./project/css/**/*.sass', gulp.series('styles'));
    gulp.watch('./project/js/**/*.js', gulp.series('scripts'));
    gulp.watch("./*.html").on('change', browserSync.reload);
    done()
});

gulp.task('default', gulp.series('del', gulp.parallel('normalize', 'styles', 'scripts'), 'watch'));