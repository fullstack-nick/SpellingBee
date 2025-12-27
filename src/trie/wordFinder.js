import { Trie } from "./Trie";
import wordDict from "./words_dictionary.json"; // word => 1

const trie = new Trie();

// Insert all words into the Trie
for (let word in wordDict) {
  if (word.length >= 4) trie.insert(word.toLowerCase());
}

/**
 * Returns the number of valid words that can be formed from letters
 * @param {string} letters
 * @returns {number}
 */
export function countWords(letters, minLength = 4) {
  const inputLetters = letters.toLowerCase();
  const found = new Set();

  function backtrack(path, node) {
    if (node.isWord && path.length >= minLength) found.add(path);

    for (let char of inputLetters) {
      if (node.children[char]) {
        backtrack(path + char, node.children[char]);
      }
    }
  }

  backtrack("", trie.root);
  return found.size;
}
