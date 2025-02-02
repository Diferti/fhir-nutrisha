import OpenAI from "openai";

require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    const foodImage = await request.body;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: `` 
                },
                { 
                    role: "user", 
                    content: foodImage 
                },
            ],
        });
        return Response.json(JSON.parse(completion.choices[0].message.content));
    } catch (error) {
        console.error('Error analyzing image:', error);
        return Response.json({ error: 'Failed to analyze image' }, { status: 500 });
    }
}
