const fs = require('fs')
const path = require('path')
const { src, dest, watch, parallel, series } = require('gulp')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const browserSync = require('browser-sync').create()

const cwd = process.cwd()
let config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**',
    },
  },
}

try {
  const loadConfig = require(path.join(cwd, 'pages.config.js'))
  config = Object.assign({}, config, loadConfig)
} catch (e) {}

const sass = plugins.sass(require('sass'))
const { reload } = browserSync

const clean = () => del([config.build.dist, config.build.temp])

const style = () => {
  return src(config.build.paths.styles, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(config.build.temp))
    .pipe(reload({ stream: true }))
}

const script = () => {
  return src(config.build.paths.scripts, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(
      plugins.babel({
        presets: [require('@babel/preset-env')],
      })
    )
    .pipe(dest(config.build.temp))
    .pipe(reload({ stream: true }))
}

const swigOpts = {
  defaults: { cache: false },
  data: config.data,
}
const templates = () => {
  return src(config.build.paths.pages, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(plugins.swig(swigOpts))
    .pipe(dest(config.build.temp))
    .pipe(reload({ stream: true }))
}

const image = async () => {
  return src(config.build.paths.images, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const font = async () => {
  return src(config.build.paths.fonts, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src('**', {
    base: config.build.public,
    cwd: config.build.public,
  }).pipe(dest(config.build.dist))
}

const serve = () => {
  const { temp, src: codeSrc, public } = config.build
  const { styles, scripts, pages, images, fonts } = config.build.paths
  browserSync.init({
    server: {
      notify: false,
      baseDir: [temp, codeSrc, public],
      routes: {
        '/node_modules': 'node_modules',
      },
      open: false,
    },
  })

  watch(styles, { cwd: codeSrc }, style)
  watch(scripts, { cwd: codeSrc }, script)
  watch(pages, { cwd: codeSrc }, templates)
  watch([images, fonts], { cwd: codeSrc }).on('change', reload)
  watch('**', { cwd: public }).on('change', reload)
}

const useref = () => {
  const {
    temp,
    dist,
    paths: { pages },
  } = config.build
  return src(pages, { base: temp, cwd: temp })
    .pipe(plugins.useref({ searchPath: [temp, '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          collapseBooleanAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        })
      )
    )
    .pipe(dest(dist))
}

const compile = parallel(style, script, templates)

const dev = series(compile, serve)

const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
)

module.exports = {
  clean,
  dev,
  build,
}
