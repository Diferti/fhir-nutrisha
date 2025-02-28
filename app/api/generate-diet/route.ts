import OpenAI from "openai";

require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const mealSchema = {
    type: "object",
    properties: {
        items: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    food: { type: "string" },
                    quantity: { type: "string" },
                    calories: { type: "number" },
                    nutrients: {
                        type: "object",
                        properties: {
                            protein: { type: "number" },
                            carbs: { type: "number" },
                            fiber: { type: "number" },
                            fat: { type: "number" },
                            glycemicIndex: { type: "number" }
                        },
                        required: ["protein", "carbs", "fiber", "fat"]
                    }
                },
                required: ["food", "quantity", "calories", "nutrients"]
            }
        }
    },
    required: ["items"]
};



export async function POST(request: Request) {
    const { dietDescription } = await request.json();

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: `Adapt meal structure dynamically based on user-specified quantity. Maintain all clinical 
                            requirements while distributing nutrition appropriately across the specified number of 
                            daily meals. Optimize meal timing and insulin dosing for the given frequency.` 
                },
                { 
                    role: "user", 
                    content: dietDescription 
                },
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
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        mealType: { 
                                                            type: "string",
                                                            enum: ["Breakfast", "Brunch", "Lunch", "Snack", "Dinner", "Supper"],
                                                            description: "Adapt based on total meals and user preferences"
                                                        },
                                                        time: { 
                                                            type: "string", 
                                                            format: "time",
                                                            description: "Time in 24-hour clock (HH:mm format, 00:00 to 23:59)" 
                                                        },
                                                        items: mealSchema.properties.items,
                                                        totalCalories: { type: "number" },
                                                        carbsForInsulin: { type: "number" },
                                                        preparation: { type: "string" }
                                                    },
                                                    required: ["mealType", "items", "totalCalories"]
                                                }
                                            },
                                            daySummary: {
                                                type: "object",
                                                properties: {
                                                    totalCalories: { type: "number" },
                                                    mealFrequency: { type: "number" },
                                                    eatingWindow: { type: "string" }
                                                },
                                                required: ["totalCalories", "mealFrequency"]
                                            }
                                        },
                                        required: ["day", "meals", "daySummary"]
                                    }
                                },
                                insulinDosing: {
                                    type: "object",
                                    properties: {
                                        regimen: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    relativeToMeal: { type: "number", description: "Meal index (0-based)" },
                                                    type: { type: "string" },
                                                    units: { type: "number" },
                                                    carbRatio: { type: "number" }
                                                }
                                            }
                                        },
                                        totalDailyDose: { type: "number" }
                                    },
                                    required: ["regimen"]
                                },
                            },
                            required: ["days", "insulinDosing"]
                        }
                    }
                }
            });
        return Response.json(JSON.parse(completion.choices[0].message.content));
    } catch (error) {
        console.error('Error generating diet:', error);
        return Response.json({ error: 'Failed to generate adaptive meal plan' }, { status: 500 });
    }
}
