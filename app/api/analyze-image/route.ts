import OpenAI from "openai";

require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
         const formData = await request.formData();
         const imageFile = formData.get('image') as File;
         const systemPrompt = formData.get('systemPrompt') as string;
 
         const buffer = await imageFile.arrayBuffer();
         const base64Image = Buffer.from(buffer).toString('base64');
         const imageUrl = `data:${imageFile.type};base64,${base64Image}`;
 
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
            response_format: {
                type: "json_schema",
                json_schema: {
                  name: "mealAnalysis",
                  schema: {
                    type: "object",
                    properties: {
                      nutritionalBreakdown: {
                        type: "object",
                        properties: {
                          macronutrients: {
                            proteins: { type: "number" },
                            fats: { type: "number" },
                            fiber: { type: "number" },
                            calories: { type: "number" },
                          },
                          carbs: { type: "number", description: "Total carbohydrates in grams" },
                          micronutrients: {
                            type: "array",
                            items: { 
                              type: "string",
                              enum: ["Iron", "Vitamin C", "Calcium", "Vitamin D", "Potassium"]
                            }
                          }
                        },
                        required: ["carbs", "proteins", "fats", "calories"]
                      },
                      identifiedItems: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            weightG: { type: "number" },
                            volumeML: { type: ["number", "null"] },
                            confidence: { 
                              type: "number",
                              minimum: 0,
                              maximum: 100
                            },
                            allergens: {
                              type: "array",
                              items: { 
                                type: "string",
                                enum: ["Gluten", "Nuts", "Dairy", "Shellfish", "Eggs"]
                              }
                            }
                          },
                          required: ["name", "confidence"]
                        }
                      },
                      insulinRecommendation: {
                        type: "object",
                        properties: {
                          calculatedDose: { type: ["number", "null"] },
                          timingAdvice: { type: "string" },
                          tip: { type: "string" }
                        }
                      },
                      mealAssessment: {
                        type: "object",
                        properties: {
                          balanceScore: { 
                            type: "number",
                            minimum: 0,
                            maximum: 100
                          },
                          healthyScore: { 
                            type: "number",
                            minimum: 0,
                            maximum: 100
                          },
                          varietyScore: { 
                            type: "number",
                            minimum: 0,
                            maximum: 100
                          },
                          portionScore: { 
                            type: "number",
                            minimum: 0,
                            maximum: 100
                          },
                          suggestions: {
                            type: "array",
                            items: { type: "string" }
                          },
                          warnings: {
                            type: "array",
                            items: { 
                              type: "string",
                            }
                          }
                        },
                        required: ["balanceScore", "suggestions"]
                      },
                      confidenceNotes: {
                        type: "array",
                        items: { type: "string" }
                      },
                      disclaimers: {
                        type: "array",
                        items: { 
                          type: "string",
                        }
                      }
                    },
                    required: [
                      "nutritionalBreakdown",
                      "identifiedItems",
                      "mealAssessment",
                      "disclaimers"
                    ]
                  }
                }
              },
        });
        return Response.json(JSON.parse(completion.choices[0].message.content));
    } catch (error) {
        console.error('Error analyzing image:', error);
        return Response.json({ error: 'Failed to analyze image' }, { status: 500 });
    }
}
