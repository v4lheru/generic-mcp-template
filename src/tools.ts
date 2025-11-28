import { z } from "zod";

export const TOOLS = {
    "calculate-sum": {
        description: "Calculates the sum of two numbers",
        inputSchema: z.object({
            a: z.number().describe("The first number"),
            b: z.number().describe("The second number"),
        }),
        handler: async ({ a, b }: { a: number; b: number }) => {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: String(a + b),
                    },
                ],
            };
        },
    },
    "get-weather": {
        description: "Get weather forecast for a city",
        inputSchema: z.object({
            city: z.string().describe("The city name"),
        }),
        handler: async ({ city }: { city: string }) => {
            // Mock implementation
            const weather = ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)];
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `The weather in ${city} is ${weather}`,
                    },
                ],
            };
        },
    },
};
