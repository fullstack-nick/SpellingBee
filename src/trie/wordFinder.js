import { Trie } from "./Trie";
import wordDictUrl from "./words_dictionary.json?url"; // word => 1

let triePromise = null;

async function getTrie() {
  if (!triePromise) {
    triePromise = (async () => {
      const response = await fetch(wordDictUrl);
      const wordDict = await response.json();
      const trie = new Trie();
      for (const word in wordDict) {
        if (word.length >= 4) trie.insert(word.toLowerCase());
      }
      return trie;
    })();
  }
  return triePromise;
}

/**
 * Returns the number of valid words that can be formed from letters
 * @param {string} letters
 * @returns {number}
 */
export async function countWords(letters, minLength = 4, maxLength = 20) {
  const trie = await getTrie();
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
