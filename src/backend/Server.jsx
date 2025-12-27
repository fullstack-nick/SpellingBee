import { GoogleGenerativeAI, SchemaType } from "https://esm.sh/@google/generative-ai";
import { useEffect } from 'react';
// import { countWords } from "../trie/wordFinder";
import { getCumulativeRankThresholds } from '../scoring/scoring.js';

const Server = ({ setPangram, setLetters, setAllWordsCount, setThresholds, setIsLoading, setGameIsSet }) => {
    useEffect(() => {
        const generateLetters = async () => {
            setIsLoading(true);

            const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
            const genAI = new GoogleGenerativeAI(API_KEY);
        
            const schema = {
            description: "Object containing the invented word and 7 distinct uppercase letters, with the required central letter at index 3",
            type: SchemaType.OBJECT,
            properties: {
                word: {
                type: SchemaType.ARRAY,
                description: "An array containing the invented uppercase word as a single string",
                minItems: 1,
                maxItems: 1,
                items: {
                    type: SchemaType.STRING,
                    description: "The invented uppercase word",
                },
                },
                letters: {
                type: SchemaType.ARRAY,
                description: "Exactly 7 distinct uppercase letters; the fourth element (index 3) is the required central letter",
                minItems: 7,
                maxItems: 7,
                items: {
                    type: SchemaType.STRING,
                    description: "A single uppercase letter",
                },
                },
            },
            required: ["word", "letters"],
            };
        
            const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
            });
        
            const prompt = `
    1. Choose a real English word that exists (not invented) of length seven or more letters that uses exactly seven unique letters (no more, no less; if the word is longer than seven letters, some letters must repeat).
    2. Return the word you came up with in uppercase as the first array.
    3. Extract exactly those 7 distinct unique uppercase letters from the word.
    4. Let the central letter be chosen the following way: out of the seven unique letters, pick the one that is most common in English based on this frequency ranking:
    E, T, A, O, I, N, S, H, R, D, L, C, U, M, W, F, G, Y, P, B, V, K, J, X, Q, Z.
    5. Return only a JSON object matching this schema:
    - word: an array with the uppercase word as its single element (at index 0).
    - letters: an array of 7 uppercase letters. The fourth element (index 3) must be the chosen central letter. No other keys or commentary.

    Example output (for word ACROSTIC):
    {
    "word": ["ACROSTIC"],
    "letters": ["A","C","R","T","O","S","I"]
    }
    `;
        
            const result = await model.generateContent(prompt);
            const jsonResponse = JSON.parse(await result.response.text());
            // return jsonResponse;
            setLetters(jsonResponse.letters);
            const count = 0; // TEMP: bypass wordFinder
            setThresholds(getCumulativeRankThresholds(count));
            setAllWordsCount(count);
            setPangram(jsonResponse.word[0]);

            setIsLoading(false);
            setGameIsSet(true);
            localStorage.setItem('gameIsSet', JSON.stringify(true));
    }

    generateLetters();

    }, [])

  return <></>;
}

export default Server
