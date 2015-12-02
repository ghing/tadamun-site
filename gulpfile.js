var Metalsmith = require('metalsmith');
var inplace = require('metalsmith-in-place');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var serve = require('gulp-serve');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var metadata = require('metalsmith-metadata');
var path = require('path');
var marked = require('marked');

var paths = {
  sass: './sass/*.scss',
  html: './html/*.html',
  partials: './partials/*.html',
  metadata: './html/*.yaml',
  images: './img/*'
};

function rebundle(bundler, outputFile) {
  return bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source(outputFile))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/js'));
}

function compile(watch) {
  var bundler = browserify('./js/src/app.js', { debug: true })
    .transform(babelify, {
      presets: ['es2015']
    })
    .external('d3')
    .external('waypoints');
  
  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle(bundler, 'app.js');
    });
  }

  return rebundle(bundler, 'app.js');
}

function compileVendor(watch) {
  var bundler = browserify({ debug: true })
    .require(require.resolve('./node_modules/d3/d3.js'), { expose: 'd3' })
    .require(require.resolve('./node_modules/waypoints/lib/noframework.waypoints.js'), { expose: 'waypoints' });


  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle(bundler, 'vendor.js');
    });
  }

  return rebundle(bundler, 'vendor.js');
}

function markdownifyContext(opts) {
  return function(files, metalsmith, done) {
    var metadata = metalsmith.metadata();
    
    metadata.sections.intro.text = metadata.sections.intro.text.map(function(t) {
      return marked(t);
    });
    
    done();
  }
}

function buildHTML(cb, watch) {
  var ms = Metalsmith(__dirname)
    .source(path.dirname(paths.html)) 
    .use(metadata({
      site: 'site.yaml',
      sections: 'sections.yaml',
      statistics: 'statistics.yaml',
    }))
    .use(markdownifyContext())
    .use(inplace({
      engine: 'handlebars',
      partials: 'partials'
    }));

  if (watch) {
    ms.clean(false);
  }  

  ms.build(function(err) {
    if (err) throw err;
    cb();
  });
}

gulp.task('buildhtml', function(cb) {
  buildHTML(cb, false);
});

gulp.task('watchhtml', function(cb) {
  buildHTML(cb, true);
})

gulp.task('buildcss', function() {
  gulp.src(paths.sass)
    .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: ['node_modules/foundation-sites/scss'],
        outputStyle: 'compressed'
      }))
  .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', function() { 
  compile(true);
  gulp.watch(paths.sass, ['buildcss']);
  gulp.watch(paths.html, ['watchhtml']);
  gulp.watch(paths.partials, ['watchhtml']);
  gulp.watch(paths.metadata, ['watchhtml']);
  gulp.watch(paths.images, ['copyimages']);
});

gulp.task('serve', serve('build'));

gulp.task('buildjs', function() {
  compile();
  compileVendor();
  return;
});

gulp.task('copyimages', ['buildhtml'], function() { 
  return gulp.src('./img/*')
    .pipe(gulp.dest('./build/img'));
});

gulp.task('copyfonts', ['buildhtml'], function() { 
  return gulp.src('./fonts/*')
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('default', ['buildhtml', 'buildcss', 'buildjs', 'copyimages', 'copyfonts']);
