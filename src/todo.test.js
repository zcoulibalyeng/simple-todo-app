import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addTodo, completeTodo, removeTodo, listTodos, _reset } from './todo.js';

test('addTodo stores a todo and returns it', () => {
  _reset();
  const todo = addTodo('buy milk');
  assert.equal(todo.title, 'buy milk');
  assert.equal(todo.done, false);
  assert.equal(listTodos().length, 1);
});

test('addTodo trims whitespace', () => {
  _reset();
  assert.equal(addTodo('  padded  ').title, 'padded');
});

test('addTodo rejects an empty title', () => {
  _reset();
  assert.throws(() => addTodo('   '), /title is required/);
});

test('completeTodo marks the todo done', () => {
  _reset();
  const { id } = addTodo('walk dog');
  assert.equal(completeTodo(id).done, true);
});

test('completeTodo throws for an unknown id', () => {
  _reset();
  assert.throws(() => completeTodo(999), /no todo with id 999/);
});

test('removeTodo reports whether it removed anything', () => {
  _reset();
  const { id } = addTodo('temp');
  assert.equal(removeTodo(id), true);
  assert.equal(removeTodo(id), false);
});

test('listTodos filters by done state', () => {
  _reset();
  const a = addTodo('a');
  addTodo('b');
  completeTodo(a.id);
  assert.equal(listTodos({ done: true }).length, 1);
  assert.equal(listTodos({ done: false }).length, 1);
});
