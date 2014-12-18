# index-html

compile a 14kb index.html preloader for a directory of assets

some assumptions

- best practice: inline critical path assets. for fastest initial load experience capped at 14kb
- therefore, you are always going to load javascript and css dynamically after that

### lifecycle

- the page displays one centered animated svg asset. override with `index.svg` (defaults dots)
- the page inlines css to do a very basic browser reset. override with `index.css`
- the page lazy loads `index.css` and `index.js`
- the page runs a mini raf event loop for displaying progress and load completion cleanup logic. override `preload.js`
- the page emits complete event and runs default exit animation effect. override in `preload.js`

outcome for your architecture

- you will also have app logic to handle loading larger static assets like imgs, video, fonts and third part stuff like ads
- the inital payload will have some logic display progress animations

### install

    npm i index-html --save-dev

## usage

the `index-html` package is intended for use with compiled assets, ready for deployment, as a last pass in your asset pipeline to create a decently simple preloader that makes some fair tradeoffs. 

reccomended usage as an [npm script](https://docs.npmjs.com/misc/scripts)

    "compile": "index-html dist > dist/index.html"

the `index-html` compiler accepts a `src` directory for its first argument. magic files:

- `index.js` (optional) loaded by `index.html` first
- `index.css` (optional) loaded by `index.html` after the js completes
- `index.svg` (optional) svg file to use for the splash screen animation (inlined in `index.html`)
- `preload.js` (optional) module for preloader scripting (compiled inline to `index.html`)
- `preload.css` (optional) module for preloader scripting (compiled inline to `index.html`)

the preloader logic compiles a 14kb `index.html` spashscreen. (if the svg and preload are greater than 14kb the compiler will fail.)

### api

```javascript
// preload.js
module.exports = {

  before: function() {
    // just before rAF inits
  },

  draw: function() {
    // called every frame
  },

  complete: function() {
    // called when index.js and index.css have been loaded
  }
}
```

## todo

- font preloading
- spritesheets
- companion lib for resource eaching (maybe just cache manifest)
- research service worker, favicon, manifest
