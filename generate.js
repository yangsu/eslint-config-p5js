var _ = require('lodash');
var fs = require('fs');
var jsdom = require('jsdom');
var mockAudioApi = require('./mock-audio-api');

var p5Source = function(file) {
  return fs.readFileSync('./node_modules/p5/lib/' + file, 'utf8');
};
var tag = function(tagName, src) {
  return '<' + tagName + '>' + src + '</' + tagName + '>';
};
var html = tag.bind(null, 'html');
var script = tag.bind(null, 'script');

var doc = jsdom.jsdom(html([
  script('document.hasFocus = function() {};'),
  script(p5Source('p5.js'))
].join('')));
var window = doc.defaultView;

window.addEventListener('error', function(event) {
  console.log(event);
  console.error('script error!', event.error, event.error.stack);
});

var getGlobals = function(instance) {
  return _.keysIn(instance).filter(function(key) {
    return key[0] !== '_';
  });
};

var writeGlobals = function(filename, keys) {
  var globals = _.zipObject(keys, _.fill(Array(keys.length), true));
  var output = 'module.exports = ' + JSON.stringify(globals, null, '  ') + ';\n';
  fs.writeFileSync(filename, output);
};

window.addEventListener('load', function(event) {
  var p5 = window.p5;
  var keys = getGlobals(new p5());
  writeGlobals('globals.js', keys);
  window.document.write(script(p5Source('addons/p5.dom.js')));
  var domkeys = _.difference(getGlobals(new p5()), keys);
  writeGlobals('globals.dom.js', domkeys);
  _.extend(window, mockAudioApi);
  window.document.write(script(p5Source('addons/p5.sound.js')));
  var soundkeys = _.difference(getGlobals(new p5()), keys, domkeys);
  writeGlobals('globals.sound.js', soundkeys);
  process.exit(0);
});
