const gulp = require( "gulp" );
const minify = {
  js: require( "gulp-minify" ),
  html: require( "gulp-htmlmin" ),
  sass: require( 'gulp-sass' )( require( 'sass' ) )
};
const { dest } = require( "vinyl-fs" );
const sass = {
  from: "./workspace/styles/*.sass",
  to: "./views/styles",
};
const prefix = require( "gulp-autoprefixer" );
const js = {
  from: "./workspace/scripts/*.js",
  to: "./views/scripts",
};
const jsDefault = {
  from: "./workspace/scripts/default/*.js",
  to: "./views/scripts/default",
};
const components = {
  from: "./workspace/scripts/components/*.js",
  to: "./views/scripts/components/"
}
const functions = {
  from: "./workspace/scripts/functions/*.js",
  to: "./views/scripts/functions/",
};
const html = {
  from: "./workspace/html/*.html",
  to: "./views/html",
};

// autoprefixer

gulp.task( "autoprefixer", function ()
{
  return gulp.src( sass.to + "/*.css" )
    .pipe( prefix() )
    .pipe( dest( sass.to ) )
} );

//sass compiler
gulp.task( "sass", function ()
{
  return gulp.src( sass.from )
    .pipe( minify.sass( { outputStyle: "compressed", } ) )
    .pipe( dest( sass.to ) )
} );

// js minify
gulp.task( 'js', function ()
{
  return gulp.src( js.from )
    .pipe( minify.js( {
      ext: {
        min: '.js'
      },
      noSource: true
    } ) )
    .pipe( gulp.dest( js.to ) )
} );
gulp.task( 'jsDefault', function ()
{
  return gulp.src( jsDefault.from )
    .pipe( minify.js( {
      ext: {
        min: '.js'
      },
      noSource: true
    } ) )
    .pipe( gulp.dest( jsDefault.to ) )
} );
gulp.task( "components", function ()
{
  return gulp.src( components.from )
    .pipe( minify.js( {
      ext: {
        min: '.js'
      },
      noSource: true
    } ) )
    .pipe( gulp.dest( components.to ) )
} );
gulp.task("functions", function () {
  return gulp.src(functions.from)
    .pipe(
      minify.js({
        ext: {
          min: ".js",
        },
        noSource: true,
      })
    )
    .pipe(gulp.dest(functions.to));
});

// html minify
gulp.task( "html", function ()
{
  return gulp.src( html.from )
    .pipe( minify.html( { collapseWhitespace: true } ) )
    .pipe( dest( html.to ) )
} );

// watch
gulp.watch( sass.from, gulp.series( "sass", "autoprefixer" ) );
gulp.watch( js.from, gulp.series( "js" ) );
gulp.watch( jsDefault.from, gulp.series( "jsDefault" ) );
gulp.watch( components.from, gulp.series( "components" ) );
gulp.watch(functions.from, gulp.series("functions"));
gulp.watch( html.from, gulp.series( "html" ) );

gulp.task( "default", gulp.series( "js", "jsDefault", "components", "html", "sass", "autoprefixer" ) );