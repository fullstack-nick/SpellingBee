import { GoogleGenerativeAI, SchemaType } from "https://esm.sh/@google/generative-ai";

export async function generateLetters() {
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
1. Invent a word of any length that contains at least seven unique letters (additional letters beyond those seven may be unique or repeats).
2. Return the invented word in uppercase as the first array.
3. Extract exactly those 7 distinct uppercase letters.
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
  console.log(jsonResponse);
  return jsonResponse;
}

// generateLetters();
