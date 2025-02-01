import OpenAI from "openai";

require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(request: Request){
    const { dietDescription } = await request.body;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a nutritionist. Generate a balanced diet plan based on the user's preferences and goals." },
                { role: "user", content: dietDescription},
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "dietPlan",
                    schema: {
                        type: "object",
                        properties: {
                            days: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        day: { type: "string" },
                                        meals: {
                                            type: "object",
                                            properties: {
                                                breakfast: {
                                                    type: "object",
                                                    properties: {
                                                        items: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    food: { type: "string" },
                                                                    quantity: { type: "string" },
                                                                    calories: { type: "number" }
                                                                },
                                                                required: ["food", "quantity", "calories"]
                                                            }
                                                        },
                                                        totalCalories: { type: "number" }
                                                    },
                                                    required: ["items", "totalCalories"]
                                                },
                                                lunch: {
                                                type: "object",
                                                    properties: {
                                                    items: {
                                                        type: "array",
                                                            items: {
                                                            type: "object",
                                                                properties: {
                                                                food: { type: "string" },
                                                                quantity: { type: "string" },
                                                                calories: { type: "number" }
                                                            },
                                                            required: ["food", "quantity", "calories"]
                                                        }
                                                    },
                                                    totalCalories: { type: "number" }
                                                },
                                                required: ["items", "totalCalories"]
                                            },
                                            dinner: {
                                                type: "object",
                                                properties: {
                                                    items: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                food: { type: "string" },
                                                                quantity: { type: "string" },
                                                                calories: { type: "number" }
                                                            },
                                                            required: ["food", "quantity", "calories"]
                                                        }
                                                    },
                                                    totalCalories: { type: "number" }
                                                },
                                                required: ["items", "totalCalories"]
                                            },                                 
                                                snacks: {
                                                    type: "object",
                                                    properties: {
                                                        items: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    food: { type: "string" },
                                                                    quantity: { type: "string" },
                                                                    calories: { type: "number" }
                                                                },
                                                                required: ["food", "quantity", "calories"]
                                                            }
                                                        },
                                                        totalCalories: { type: "number" }
                                                    },
                                                    required: ["items", "totalCalories"]
                                                }
                                            },
                                            required: ["breakfast", "lunch", "dinner", "snacks"]
                                        },
                                        dayTotal: { type: "number" }
                                    },
                                    required: ["day", "meals", "dayTotal"]
                                }
                            }
                        },
                        required: ["days"]
                    }
                }
            }
        });

        return Response.json({ dietPlan: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error generating diet:', error);
        return  Response.json({ error: 'Failed to generate diet.' });
    }
}
