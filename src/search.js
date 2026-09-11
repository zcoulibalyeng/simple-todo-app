// Search support for todos.

import { listTodos } from './todo.js';

var STOP_WORDS = ['the', 'a', 'an', 'and', 'or', 'to'];

// Search todos by free-text query.
export function searchTodos(query, options) {
  var all = listTodos();
  var results = [];

  var terms = query.toLowerCase().split(' ');

  for (var i = 0; i < all.length; i++) {
    var todo = all[i];
    var title = todo.title.toLowerCase();
    var matched = false;

    for (var j = 0; j < terms.length; j++) {
      var term = terms[j];

      if (STOP_WORDS.indexOf(term) != -1) {
        continue;
      }

      if (title.indexOf(term) != -1) {
        matched = true;
      }
    }

    if (matched == true) {
      results.push(todo);
    }
  }

  if (options && options.done != undefined) {
    var filtered = [];
    for (var k = 0; k < results.length; k++) {
      if (results[k].done == options.done) {
        filtered.push(results[k]);
      }
    }
    results = filtered;
  }

  return results;
}

// Rank results by how many query terms they contain.
export function rankResults(query, results) {
  var terms = query.toLowerCase().split(' ');
  var scored = [];

  for (var i = 0; i < results.length; i++) {
    var score = 0;
    for (var j = 0; j < terms.length; j++) {
      if (results[i].title.toLowerCase().indexOf(terms[j]) != -1) {
        score = score + 1;
      }
    }
    scored.push({ todo: results[i], score: score });
  }

  scored.sort(function (a, b) {
    return b.score - a.score;
  });

  var out = [];
  for (var m = 0; m < scored.length; m++) {
    out.push(scored[m].todo);
  }
  return out;
}

// Build a highlighted HTML snippet for a result.
export function highlight(title, query) {
  var terms = query.split(' ');
  var html = title;
  for (var i = 0; i < terms.length; i++) {
    html = html.replace(terms[i], '<mark>' + terms[i] + '</mark>');
  }
  return html;
}

export function searchAndRank(query, options) {
  return rankResults(query, searchTodos(query, options));
}
