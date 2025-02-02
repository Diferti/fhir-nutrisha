import OpenAI from "openai";

require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
         const formData = await request.formData();
         const imageFile = formData.get('image') as File;
         const userData = JSON.parse(formData.get('userData') as string);
 
         const buffer = await imageFile.arrayBuffer();
         const base64Image = Buffer.from(buffer).toString('base64');
         const imageUrl = `data:${imageFile.type};base64,${base64Image}`;
 
         const systemPrompt = `
         Analyze this meal image and provide:
         
         1. Detailed nutritional breakdown (carbs, proteins, fats, calories)
         2. Food items identification with portion estimates
         3. Insulin calculation using these parameters:
            - Current BG: ${userData.currentBG} mg/dL
            - Target BG: ${userData.targetBG} mg/dL
            - Insulin-to-Carb Ratio: 1:${userData.carbRatio}
            - Insulin Sensitivity: ${userData.sensitivity} mg/dL per unit
         4. Meal balance assessment and suggestions
         Include confidence levels for each identification (0-100%)
         Include metric units and safety disclaimers.
         `;
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: systemPrompt
                },
                { 
                    role: "user", 
                    content: [
                        {
                            type: "image_url",
                            image_url: {url: imageUrl}
                        }
                    ] 
                },
            ],
        });
        return Response.json({ chat: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error analyzing image:', error);
        return Response.json({ error: 'Failed to analyze image' }, { status: 500 });
    }
}
