import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PRIORITIES,
  DEFAULT_PRIORITY,
  isPriority,
  toPriority,
  comparePriority,
  sortByPriority
} from './priority.js';

test('PRIORITIES lists every priority, lowest first', () => {
  assert.deepEqual([...PRIORITIES], ['low', 'normal', 'high', 'urgent']);
});

test('isPriority accepts known values', () => {
  for (const p of PRIORITIES) assert.equal(isPriority(p), true);
});

test('isPriority rejects unknown and non-string values', () => {
  for (const value of ['URGENT', '', 'medium', null, undefined, 3, {}]) {
    assert.equal(isPriority(value), false);
  }
});

test('isPriority is not fooled by inherited properties', () => {
  assert.equal(isPriority('toString'), false);
  assert.equal(isPriority('constructor'), false);
});

test('toPriority passes through a valid priority', () => {
  assert.equal(toPriority('high'), 'high');
});

test('toPriority falls back to the default for junk', () => {
  for (const value of [null, undefined, 'nope', 42]) {
    assert.equal(toPriority(value), DEFAULT_PRIORITY);
  }
});

test('comparePriority orders most urgent first', () => {
  assert.ok(comparePriority('urgent', 'low') < 0);
  assert.ok(comparePriority('low', 'urgent') > 0);
  assert.equal(comparePriority('high', 'high'), 0);
});

test('sortByPriority orders urgent to low', () => {
  const sorted = sortByPriority([
    { priority: 'low' },
    { priority: 'urgent' },
    { priority: 'normal' }
  ]);
  assert.deepEqual(sorted.map((t) => t.priority), ['urgent', 'normal', 'low']);
});

test('sortByPriority treats a missing priority as the default', () => {
  const sorted = sortByPriority([{ priority: 'low' }, {}, { priority: 'urgent' }]);
  assert.deepEqual(sorted.map((t) => t.priority ?? 'normal'), ['urgent', 'normal', 'low']);
});

test('sortByPriority does not mutate its input', () => {
  const input = [{ priority: 'low' }, { priority: 'urgent' }];
  const copy = [...input];
  sortByPriority(input);
  assert.deepEqual(input, copy);
});

test('sortByPriority handles an empty list', () => {
  assert.deepEqual(sortByPriority([]), []);
});
