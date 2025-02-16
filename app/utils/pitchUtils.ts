import OpenAI from "openai";

const openai = new OpenAI({
	baseURL: 'https://api.deepseek.com',
	apiKey: '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'
});

interface Message {
    role: "system" | "user" | "assistant" | "function";  // restrict to allowed roles
    content: string;
    name?: string;  // optional property required for function messages
}

async function main(messages: Message[]): Promise<void> {
	try {
        const completion = await openai.chat.completions.create({
            messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],  // type assertion
            model: "deepseek-chat",
        });

        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
}