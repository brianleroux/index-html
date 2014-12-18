import {readFileSync as read, existsSync as exists} from 'fs'
import {join as path} from 'path'
import browserify from 'browserify'
import tmpl from 'lodash.template'
import to5ify from '6to5ify'
import htmlmin from 'htmlmin'

function compile(dir, callback) {

  let preloader = path(__dirname, '..', 'src', 'preloader')
    , svgExists = exists(path(dir, 'index.svg'))
    , cssExists = exists(path(dir, 'preload.css'))
    , jsExists = exists(path(dir, 'preload.js'))
    , options = {debug:false, noParse:[]}
    , to5 = to5ify.configure({sourceMap:false, modules:'commonInterop'})

  // compile and export preload
  function preload(cb) {
    let preload = path(jsExists ? dir : preloader, 'preload.js')
    browserify(options)
      .require(preload, {expose: 'preload'})
      .transform(to5)
      .bundle(cb)
  }

  // compile and export index
  function index(cb) {
    let p = path(preloader, 'index.js')
    browserify(options)
      .add(p)
      .transform(to5)
      .bundle(cb)
  }

  // out 
  function done(err, out) {
    let template = read(path(preloader, 'index.html'), 'utf8')
      , compile = tmpl(template)
      , name = 'test run title'
      , svg = read(path(svgExists ? dir : preloader, 'index.svg'))
      , css = '<style>' + read(path(cssExists ? dir : preloader, 'preload.css'), 'utf8') + '</style>'
      , js = `<script>${out}</script>`
    callback(err, htmlmin(compile({name, svg, css, js})))
  }

  // concat and output
  preload((err, preloader)=> index((err, js)=> done(err, preloader + js)))
}

export default compile
