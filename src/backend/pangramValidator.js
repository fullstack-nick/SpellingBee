import { GoogleGenerativeAI, SchemaType } from "https://esm.sh/@google/generative-ai";

export async function validatePangram(word) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Schema: top-level boolean indicating whether the word uses exactly seven unique letters
  const schema = {
    description: "A boolean indicating if the given word uses exactly seven unique letters (length >= 7)",
    type: SchemaType.BOOLEAN,
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `
Check if the following word uses exactly seven unique letters (the word may be seven or more characters long, but must contain no more and no fewer than seven distinct letters):

"${word}"

Respond strictly with a JSON boolean: true if it does, false otherwise. No quotes, no additional text.
`;

  const result = await model.generateContent(prompt);
  const jsonResponse = JSON.parse(await result.response.text());
  return jsonResponse;
}

// Example usage:
// validatePangram("BALLOONS"); // returns true if BALLOONS has exactly seven unique letters
