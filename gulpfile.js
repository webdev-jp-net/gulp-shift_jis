var gulp = require('gulp'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    csscomb = require('gulp-csscomb'),
    autoprefixer = require('gulp-autoprefixer'),
    crLfReplace = require('gulp-cr-lf-replace'),
    convertEncoding = require('gulp-convert-encoding'),
    browserSync = require("browser-sync");

// Sass build
var dir = {
  html: 'html',
  release: 'release',
  sass: 'sass'
};
gulp.task('sass', function() {
  gulp.src(dir.sass + '/**/*.scss')
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: [
      'last 2 version',
      'Android >= 4'
    ],
    cascade: false
  }))
  .pipe(csscomb())
  .pipe(gulp.dest(dir.html));
});

// Browser Sync
gulp.task('server', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: 'html',
      index: ['_index.html', 'index.html']
    }
  });
});

/* gulp
-------------------- */
gulp.task('reload', ['server'], function() {
  browserSync.reload();
});
gulp.task('default', ['server'], function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('html/*.*', ['reload']);
  gulp.watch('sass/**/*.scss', ['reload']);
});

/* release
-------------------- */
// 既存のreleaseディレクトリを削除
gulp.task('clean', function(callback) {
  return gulp.src(dir.release)
  .pipe(clean());
});

//  htmlディレクトリからreleaseディレクトリへソースを複製
gulp.task('copy', ['clean'], function() {
  gulp.src([
    dir.html + '/**/*.*',
    '!' + dir.html + '/lib/**/*.*' // ライブラリディレクトリは複製対象から除外
  ])
  .pipe(replace('UTF-8', 'shift_jis')) // 文字置換
  .pipe(crLfReplace({changeCode: 'CR+LF'})) // 改行コード変更
  .pipe(convertEncoding({to: 'shift_jis'})) // 文字コード変更
  .pipe(gulp.dest(dir.release));
});

// Libraryを文字コードを変えず複製
gulp.task('lib-copy', ['copy'], function() {
  gulp.src([
    dir.html + '/lib/**/*.*'
  ])
  .pipe(gulp.dest('release/lib'));
});

//  実行
gulp.task('release', ['lib-copy']);
