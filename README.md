# eslint-config-p5js

[![npm version](https://badge.fury.io/js/eslint-config-p5js.svg)](https://www.npmjs.com/package/eslint-config-p5js)

> ESLint config for [p5.js](https://github.com/processing/p5.js)

## Installation

```
npm install --save-dev eslint-config-p5js
```


## Usage

Add the following to your `.eslintrc`, which includes the configuration for `p5.js`
```
{
    "extends": "p5js"
}
```

Configuration for `p5.dom`
```
{
    "extends": "p5js/dom"
}
```

Configuration for `p5.sound`
```
{
    "extends": "p5js/sound"
}
```

Configuration for `p5.js` and all plugins
```
{
    "extends": [
        "p5js"
        "p5js/dom"
        "p5js/sound"
    ]
}
```

## Development
Install [browserify](https://github.com/substack/node-browserify)
```
# Generate a mock web audio api implementation so p5.sound can be instantiated in jsdom
npm run-script mock-audio-api
# Generate the global symbols
npm run-script generate-globals
```
