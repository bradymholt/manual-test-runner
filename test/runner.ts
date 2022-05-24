import { assert as _assert } from "console";

let tests: Array<{ name: string; fn: () => void }> = [];
function _test(name: string, fn: () => void) {
  tests.push({ name, fn });
}

// Define globals so tests can access them
declare global {
  var test: typeof _test;
  var assert: typeof _assert;
}
global.test = _test;
global.assert = _assert;

const files = process.argv.slice(2);
async function loadTests() {
  for (const file of files) {
    await import(file);
  }
}

async function runTests() {
  for (const test of tests) {
    try {
      await test.fn();
      console.log("✅", test.name);
    } catch (err) {
      console.log("❌", test.name);
      if (err instanceof Error) {
        console.log(err.stack);
      }
    }
  }
}

await loadTests();
await runTests();
