// netlify\functions\fetchSpeech\fetchSpeech.js

import {openai} from '../../../openai.config.js'

const handler = async (event) => {
    try {
        const {text} = JSON.parse(event.body)
            const base64Encoded = await textToSpeech(text)
            return {
                statusCode: 200,
                body: JSON.stringify({content: base64Encoded}),
            }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

async function textToSpeech(text){
    try {
        const response = await openai.audio.speech.create({
            model: 'tts-1-hd',
            voice: 'echo',
            input: text
        })
        const arrayBuffer = await response.arrayBuffer()
        const base64Encoded = Buffer.from(arrayBuffer, 'base64').toString('base64')
        return base64Encoded
    } catch (e) {
        console.error('Error Converting Translated Text to Speech', e)
    }
}
   
    
export { handler }