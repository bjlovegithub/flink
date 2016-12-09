var gulp = require('gulp');
//useref = require('gulp-useref');

uglify = require('gulp-uglify'), minifyCss = require('gulp-minify-css');
//var raml2html       = require('gulp-raml2html')
var plumber         = require('gulp-plumber');
var ngAnnotate      = require('gulp-ng-annotate');
var sourcemaps      = require('gulp-sourcemaps');
var concat          = require('gulp-concat');
var mainBowerFiles  = require('main-bower-files');
var filter          = require('gulp-filter');
var minify          = require('gulp-minify-css');





var environment = 'development';

environment = 'production'


var paths = {
  src: './app/',
  dest: './web/',
  vendor: './app/bower_components/',
  vendorLocal: './vendor-local/',
  assets: './assets/',
  tmp: './tmp/'
}



gulp.task('views',function(){
  return gulp.src('app/views/**/*.html').pipe(gulp.dest(paths.dest+'/views/'))
})
gulp.task('index',function(){
    return gulp.src(['app/index.html', 'app/pagination.html']).pipe(gulp.dest(paths.dest))
})

gulp.task('static',function(){
    return gulp.src(paths.src+"/static/*").pipe(gulp.dest(paths.dest+'/statics/'))
})

gulp.task('fonts', function() {
  gulp.src(["app/bower_components/font-awesome/fonts/*", paths.src + '/fonts/*'])
      .pipe(plumber())
      .pipe(gulp.dest(paths.dest+'/fonts'));
});

gulp.task('api',function() {
  gulp.src(paths.src + "ramls/*.raml")
      .pipe(plumber())
      .pipe(raml2html())
      .pipe(gulp.dest(paths.dest +"api_docs/"))
});

gulp.task('scripts', function() {
    stream = gulp.src([ paths.src + 'controllers/*.js', paths.src + 'services/*.js'] )
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(concat('index.js'))
        .pipe(sourcemaps.write());

    if (environment == 'production') {
        stream.pipe(uglify())
    }
    stream.pipe(gulp.dest(paths.dest + 'js/'))
});


gulp.task('vendor-scripts', function() {
    stream = gulp.src(mainBowerFiles({env: 'development'}).concat(paths.vendor+"/tipsy/src/javascripts/jquery.tipsy.js"))
        .pipe(filter('*.js'))
        .pipe(sourcemaps.init())
        .pipe(concat("vendor.js"))
        .pipe(sourcemaps.write());

    if (environment == 'production') {
        stream.pipe(uglify())
    }

    stream.pipe(gulp.dest(paths.dest + 'js/'))
});


gulp.task('vendor-styles', function() {
    stream = gulp.src([paths.vendor+"bootstrap/dist/css/bootstrap.css",
                       paths.vendor+"font-awesome/css/font-awesome.css",
                       paths.vendor+"tipsy/src/stylesheets/tipsy.css",
                       paths.vendor+"animate.css/animate.css"
    ])
        .pipe(sourcemaps.init())
        .pipe(concat("vendor.css"))
        .pipe(sourcemaps.write());

    if (environment == 'production') {
        stream.pipe(minify())
    }
    stream.pipe(gulp.dest(paths.dest + 'css/'))
});

gulp.task('styles', function () {
    stream = gulp.src([paths.src+"styles/blink-dag.css", paths.src+"styles/plan.css", paths.src+"styles/sb-admin.css"])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat("index.css"))
        .pipe(sourcemaps.write());

    if (environment == 'production') {
        stream.pipe(minify());
    }

    stream.pipe(gulp.dest(paths.dest + 'css/'))
});

gulp.task('images',function(){
    gulp.src(paths.vendor+"tipsy/src/images/tipsy.gif")
        .pipe(plumber())
        .pipe(gulp.dest(paths.dest+'/images/'));
})


gulp.task('watch', function () {
    gulp.watch(paths.src + "index.html",['index']);
    gulp.watch(paths.src + 'views/**', ['views']);
    gulp.watch(paths.src + 'controllers/**', ['scripts']);
    gulp.watch(paths.src + 'services/**',['scripts']);


});

// gulp view ±ðÓÃdefault
// gulp scripts

gulp.task('default',['styles','vendor-styles','vendor-scripts','scripts','views','fonts','api','index','images'])


