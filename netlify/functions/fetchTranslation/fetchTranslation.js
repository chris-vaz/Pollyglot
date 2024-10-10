// netlify\functions\fetchSpeech\fetchTranslation.js

import {openai} from '../../../openai.config.js'

const handler = async (event) => {
    try {
        const {text, language} = JSON.parse(event.body)
            const response = await translate(text, language)
            return {
                statusCode: 200,
                body: JSON.stringify({response}),
            }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}


async function translate(text, language){
    const messages = [
        {
            role: 'system',
            content: `You translate ${text} from it's language into ${language}.`
        },
        {
            role: 'user',
            content: `${text}
            `
        }
    ]
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages,
            temperature: 1,
            max_tokens: 200
        })
        const translationResponse = response.choices[0].message.content
        return translationResponse
    } catch (e) {
        console.error('Unable to access OpenAI, Please refresh and try again', e)
    }
}

export { handler }