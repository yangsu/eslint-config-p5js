const _ = require("lodash");
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const mockAudioApi = require("./mock-audio-api");

const p5Source = file => {
  return fs.readFileSync("./node_modules/p5/lib/" + file, "utf8");
};
const tag = (tagName, src) => {
  return "<" + tagName + ">" + src + "</" + tagName + ">";
};
const html = tag.bind(null, "html");
const script = tag.bind(null, "script");

const { window } = new JSDOM(
  `${script("document.hasFocus = function() {};")} ${script(
    p5Source("p5.js")
  )}`,
  { runScripts: "dangerously" }
);

window.addEventListener("error", function(event) {
  console.log(event);
  console.error("script error!", event.error, event.error.stack);
});

const getGlobals = instance => {
  return _.keysIn(instance).filter(function(key) {
    return key[0] !== "_";
  });
};

const writeGlobals = (filename, keys) => {
  const globals = _.zipObject(keys, _.fill(Array(keys.length), true));
  const output =
    "module.exports = " + JSON.stringify(globals, null, "  ") + ";\n";
  fs.writeFileSync(filename, output);
};

window.addEventListener("load", event => {
  const p5 = window.p5;
  const keys = getGlobals(new p5());
  writeGlobals("globals.js", keys);

  // _.extend(window, mockAudioApi);
  // window.document.write(script(p5Source("addons/p5.sound.js")));
  // var soundkeys = _.difference(getGlobals(new p5()), keys, domkeys);
  // writeGlobals("globals.sound.js", soundkeys);

  process.exit(0);
});
