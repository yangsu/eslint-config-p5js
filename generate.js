const fs = require("fs");
const _ = require("lodash");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const { window } = new JSDOM(
  `
    <!doctype html>
      <html>
        <head>
          <script>document.hasFocus = function() {};</script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
        </head>
        <body></body>
      </html>
    `,
  { runScripts: "dangerously", resources: "usable" }
);

window.addEventListener("error", event => {
  console.log(event);
  console.error("script error!", event.error, event.error.stack);
});

window.addEventListener("load", event => {
  const p5 = window.p5;
  const keys = getGlobals(new p5());
  writeGlobals("globals.js", keys);

  process.exit(0);
});

const getGlobals = instance => _.keysIn(instance).filter(key => key[0] !== "_");

const writeGlobals = (filename, keys) => {
  const globals = _.zipObject(keys, _.fill(Array(keys.length), true));
  const output =
    "module.exports = " + JSON.stringify(globals, null, "  ") + ";\n";
  fs.writeFileSync(filename, output);
};
