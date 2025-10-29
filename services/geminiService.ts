import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

// We'll manage chat state in the component, so we create a new chat session for each request stream.
// This is simpler for this app's structure than managing chat instances in the service.
export const getChatResponse = async (history: ChatMessage[], newMessage: string) => {
    const chat: Chat = ai.chats.create({
        model: chatModel,
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: imageModel,
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }

    throw new Error("Image generation failed or returned no images.");
};

export const generateEmailContent = async (prompt: string): Promise<{ subject: string; body: string }> => {
    const response = await ai.models.generateContent({
        model: chatModel,
        contents: `Generate a complete email marketing campaign from this prompt: "${prompt}". Provide a compelling subject line and engaging body copy. The body copy should be formatted in simple HTML paragraphs (<p> tags).`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    subject: {
                        type: Type.STRING,
                        description: 'A compelling and short subject line for the email.'
                    },
                    body: {
                        type: Type.STRING,
                        description: 'The full body of the email, formatted with HTML <p> tags for paragraphs.'
                    }
                },
                required: ['subject', 'body']
            }
        }
    });
    
    const jsonStr = response.text.trim();
    // It's possible for the response to contain markdown backticks around the JSON
    const cleanJsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    try {
        const parsed = JSON.parse(cleanJsonStr);
        if (typeof parsed.subject === 'string' && typeof parsed.body === 'string') {
            return parsed;
        } else {
            throw new Error('Invalid JSON structure in response.');
        }
    } catch (e) {
        console.error("Failed to parse JSON response:", cleanJsonStr, e);
        throw new Error("The AI returned an invalid format. Please try again.");
    }
};
