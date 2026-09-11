/**
 * Todo priority handling.
 *
 * Priorities are a closed set, so they are modelled as a frozen lookup rather
 * than scattered string comparisons.
 */

/** @typedef {'low' | 'normal' | 'high' | 'urgent'} Priority */

/** Ordering weight per priority. Higher sorts first. */
const WEIGHTS = Object.freeze({
  low: 0,
  normal: 1,
  high: 2,
  urgent: 3
});

/** @type {readonly Priority[]} */
export const PRIORITIES = Object.freeze(
  /** @type {Priority[]} */ (Object.keys(WEIGHTS))
);

export const DEFAULT_PRIORITY = 'normal';

/**
 * Whether a value is a known priority.
 * @param {unknown} value
 * @returns {value is Priority}
 */
export function isPriority(value) {
  return typeof value === 'string' && Object.hasOwn(WEIGHTS, value);
}

/**
 * Coerce an untrusted value to a priority, falling back to the default.
 * @param {unknown} value
 * @returns {Priority}
 */
export function toPriority(value) {
  return isPriority(value) ? value : DEFAULT_PRIORITY;
}

/**
 * Compare two priorities, most urgent first. Suitable for Array.prototype.sort.
 * @param {Priority} a
 * @param {Priority} b
 * @returns {number}
 */
export function comparePriority(a, b) {
  return WEIGHTS[b] - WEIGHTS[a];
}

/**
 * Sort todos by priority, most urgent first. Does not mutate the input.
 * @template {{ priority?: unknown }} T
 * @param {readonly T[]} todos
 * @returns {T[]}
 */
export function sortByPriority(todos) {
  return [...todos].sort((a, b) =>
    comparePriority(toPriority(a.priority), toPriority(b.priority))
  );
}
