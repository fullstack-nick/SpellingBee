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
export function countWords(letters, minLength = 4, maxLength = 20) {
  const inputLetters = letters.toLowerCase();
  const found = new Set();
  const stack = [{ path: "", node: trie.root }];

  while (stack.length) {
    const { path, node } = stack.pop();
    if (node.isWord && path.length >= minLength) found.add(path);
    if (path.length >= maxLength) continue;

    for (const char of inputLetters) {
      const child = node.children[char];
      if (child) {
        stack.push({ path: path + char, node: child });
      }
    }
  }

  return found.size;
}
