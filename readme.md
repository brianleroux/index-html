# index-html

compile an optimal `index.html` preloader for a directory of assets

### Assumptions

- Best practice: inline critical path assets for fastest initial load experience capped at 14kb
- Load all other assets dynamically after that
- Index payload: app shell loading spash animation inlined with dead simple logic to load JS and CSS
- Secondary payloads: `index.js` app logic and `index.css` app styles
- Delta payloads detertmined in main app logic (loaded in prev step)

### install

    npm i index-html --save-dev

## usage

`index-html` package is intended for use with compiled assets, ready for deployment, as a last pass in your asset pipeline to create a decently simple preloader that makes some fair tradeoffs. 

Reccomended usage as an [npm script](https://docs.npmjs.com/misc/scripts) ala:

    "compile": "index-html dist > dist/index.html"

`index-html` is a sort of compiler that accepts a `src` directory for its first argument. Some files are magic:

- `index.js` (optional) loaded by `index.html` first
- `index.css` (optional) loaded by `index.html` after the js completes
- `index.svg` (optional) svg file to use for the splash screen animation (inlined in `index.html`)
- `preload.js` (optional) module for preloader scripting (compiled inline to `index.html`)
- `preload.css` (optional) module for preloader scripting (compiled inline to `index.html`)

All of this compiles into a minified `index.html` spashscreen. (if the svg and preload are greater than 14kb the compiler will fail.)

### lifecycle

- Displays one centered animated svg asset. Override with `index.svg` (defaults dots)
- Inlines css to do a very basic browser reset. Override with `preload.css`
- Lazy loads `index.css` and `index.js`
- Runs a mini rAF event loop for displaying progress and load completion cleanup logic. Override w/ `preload.js`
- Page emits complete, which again can be overriddenwith `preload.js`

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
