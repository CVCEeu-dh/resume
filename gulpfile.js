var gulp  = require('gulp'),
    pkg   = require('./package.json'),
    _     = require('lodash'),
    
    files = require('./client/src/files').development,
    $     = require('gulp-load-plugins')({
              rename: {
                'gulp-angular-templatecache': 'templatecache'
              }
            });
console.log(files)
// Files
var banner = '/* resume.js - Version: ' + pkg.version + ' - Author: danieleguido (Daniele Guido) */\n';

// Lint Javascript
gulp.task('jshint', function() {
  return gulp.src(['!./client/src/js/lib/*.js','./client/src/js/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
});

// templates
gulp.task('templates', function () {
  return gulp.src('./client/src/templates/**/*.html')
    .pipe($.templatecache({
      module: 'resume',
      transformUrl: function(url) {
        return 'templates/' + url;
      }
    }))
    .pipe(gulp.dest('./client/src/js'))
    .pipe($.size({templates: 'js'}))
});

gulp.task('default', ['jshint', 'templates']);