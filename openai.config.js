import OpenAI from 'openai';

/* OpenAI config */
if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is Missing or Invalid.");
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});