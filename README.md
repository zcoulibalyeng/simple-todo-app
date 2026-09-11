# simple-todo-app

A deliberately small todo application. It exists as a fixture for automated
code review: each pull request carries a different quality profile so a reviewer
has something concrete to find.

## Structure

- `src/todo.js` — the core store: add, complete, remove, list
- `src/todo.test.js` — unit tests for the store

## Running the tests

```bash
npm test
```
