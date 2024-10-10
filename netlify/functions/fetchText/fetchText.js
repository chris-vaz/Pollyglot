// netlify/functions/fetchText/fetchText.js

import { openai } from '../../../openai.config.js';
import { File, Blob } from "@web-std/file";

const handler = async (event) => {
    try {
        const { speech } = JSON.parse(event.body);
        const response = await speechToText(speech);
        return {
            statusCode: 200,
            body: JSON.stringify({ response })
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};

async function speechToText(speech) {
    const byteCharacters = Buffer.from(speech, 'base64').toString('binary');
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mp4' });
    const audioFile = new File([blob], 'audio.mp4', { type: 'audio/mp4' });
    
    try {
        const response = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            response_format: 'text'
        });
        return response;
    } catch (e) {
        // Check if the error is a rate limit error (429)
        if (e.response && e.response.status === 429) {
            console.error('Rate limit exceeded. Please try again later.');
            throw new Error('Rate limit exceeded. Please try again later.');
        } else {
            console.error('Error Transcribing the User Recording.', e);
            throw e; // Rethrow the error for handling in the outer catch
        }
    }
}

export { handler };
