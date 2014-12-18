import * as raf from 'raf'
import * as domready from 'domready'
import * as js from 'loads-js'
import * as css from 'loads-css'
// we expect this file to be globally exported
import preload from 'preload'


domready(function () {

  let started = false
    , start = new Date

  preload.before()

  function tick() {
    let now = new Date - start

    if (!started && now > 2000) {
      started = true
      js('index.js', ()=> css('index.css', preload.complete))
    }
    else {
      preload.draw()
      raf(tick)
    }
  }

  raf(tick)
})
