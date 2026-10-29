const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
exports.load = (relative, mocks = {}) => {
  const filename = path.join(__dirname, "..", relative);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInThisContext(`(function(exports,require,module){${code}\n})`, { filename })(
    module.exports, name => Object.hasOwn(mocks, name) ? mocks[name] : require(name), module,
  );
  return module.exports;
};
