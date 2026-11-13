import assert from "node:assert/strict";
import test from "node:test";
import * as breakdown from "../lib/video-breakdown";

test("timed annotations interpolate reviewed captions, preserve gaps and isolate the real closing price", () => {
  assert.equal(typeof breakdown.annotationsAtTime, "function", "timed annotations are missing");
  assert.equal(breakdown.annotationsAtTime(0).boxes.length, 0);
  const early = breakdown.annotationsAtTime(2.5);
  assert.equal(early.phase, "caption");
  assert.equal(early.boxes.length, 2);
  assert.ok(breakdown.annotationsAtTime(3.25).boxes[1].width > early.boxes[1].width);
  assert.equal(breakdown.annotationsAtTime(3.8).boxes.length, 0);
  assert.equal(breakdown.annotationsAtTime(5).phase, "safe-zone");
  assert.equal(breakdown.annotationsAtTime(5).boxes.length, 0);
  assert.equal(breakdown.annotationsAtTime(85).boxes.length, 0);
  assert.equal(breakdown.annotationsAtTime(86.1).boxes.length, 0);
  assert.equal(breakdown.annotationsAtTime(86.3).phase, "price");
  assert.equal(breakdown.annotationsAtTime(86.3).boxes.length, 1);
  assert.equal(breakdown.annotationsAtTime(87.04).boxes.length, 0);
  assert.equal(breakdown.annotationsAtTime(1).phase, "caption");
  for (const time of [-1, NaN, Infinity]) assert.equal(breakdown.annotationsAtTime(time).boxes.length, 0);
});

test("active explanation follows chapter boundaries, reverse seeking and the end", () => {
  assert.equal(typeof breakdown.chapterAtTime, "function", "playback chapter selection is missing");
  assert.equal(breakdown.chapterAtTime(0), 0);
  assert.equal(breakdown.chapterAtTime(3.99), 0);
  assert.equal(breakdown.chapterAtTime(4), 1);
  assert.equal(breakdown.chapterAtTime(32), 6);
  assert.equal(breakdown.chapterAtTime(84), 15);
  assert.equal(breakdown.chapterAtTime(87.051), 15);
  assert.equal(breakdown.chapterAtTime(2), 0);
  for (const time of [-1, NaN, Infinity]) assert.equal(breakdown.chapterAtTime(time), 0);
  const chapters = breakdown.featuredBreakdown.chapters;
  assert.equal(chapters.length, 16);
  assert.equal(chapters[0].start, 0);
  for (let i = 0; i < chapters.length; i++) {
    assert.ok(chapters[i].end > chapters[i].start);
    if (i) assert.equal(chapters[i - 1].end, chapters[i].start);
  }
  assert.equal(breakdown.featuredBreakdown.title, "Sample edit");
});
