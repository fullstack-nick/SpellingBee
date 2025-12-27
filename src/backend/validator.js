import { GoogleGenerativeAI, SchemaType } from "https://esm.sh/@google/generative-ai";

export async function validateWord(word) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Schema: top-level boolean response indicating validity of the word
  const schema = {
    description: "A boolean indicating whether the given word exists in English",
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
Determine if the following English word exists:

"${word}"

Respond strictly with a JSON boolean: true if it exists, false otherwise. No quotes, no additional text.
`;

  const result = await model.generateContent(prompt);
  const jsonResponse = JSON.parse(await result.response.text());
  return jsonResponse;
}

// Usage example:
// validateWord("EXISTENCE");  // should log true or false
