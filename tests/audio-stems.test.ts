import assert from "node:assert/strict";
import test from "node:test";
import * as stems from "../lib/audio-stems";

test("stem samples use the video timeline and return silence for invalid/outside positions", () => {
  assert.equal(typeof stems.spectrumAtTime, "function");
  const data = { step: 0.05, duration: 0.1, frames: [[1, 2], [30, 40]] };
  assert.deepEqual(stems.spectrumAtTime(data, 0.075), [30, 40]);
  assert.deepEqual(stems.spectrumAtTime(data, 0.01), [1, 2]);
  for (const time of [-1, NaN, Infinity, 0.1]) assert.deepEqual(stems.spectrumAtTime(data, time), []);
});
