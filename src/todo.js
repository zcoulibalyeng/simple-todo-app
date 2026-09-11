/**
 * In-memory todo store.
 */

let nextId = 1;

/** @typedef {{ id: number, title: string, done: boolean, createdAt: string }} Todo */

/** @type {Todo[]} */
const todos = [];

/**
 * Add a todo.
 * @param {string} title
 * @returns {Todo}
 */
export function addTodo(title) {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('title is required');
  }

  const todo = {
    id: nextId++,
    title: title.trim(),
    done: false,
    createdAt: new Date().toISOString()
  };

  todos.push(todo);
  return todo;
}

/**
 * Mark a todo complete.
 * @param {number} id
 * @returns {Todo}
 */
export function completeTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    throw new Error(`no todo with id ${id}`);
  }
  todo.done = true;
  return todo;
}

/**
 * Remove a todo.
 * @param {number} id
 * @returns {boolean} whether a todo was removed
 */
export function removeTodo(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

/**
 * List todos, optionally filtered by completion state.
 * @param {{ done?: boolean }} [filter]
 * @returns {Todo[]}
 */
export function listTodos(filter = {}) {
  if (filter.done === undefined) return [...todos];
  return todos.filter((t) => t.done === filter.done);
}

/** Reset the store. Test helper. */
export function _reset() {
  todos.length = 0;
  nextId = 1;
}
