import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface StoryGenerationRequest {
  productName: string;
  craftType: string;
  heritage?: string;
  artisanName: string;
  artisanLocation: string;
}

export interface StoryGenerationResponse {
  description: string;
  captions: string[];
}

export async function generateProductStory(request: StoryGenerationRequest): Promise<StoryGenerationResponse> {
  try {
    const prompt = `You are an expert storyteller specializing in artisan crafts and cultural heritage. Create compelling content for a handmade product.

Product Details:
- Name: ${request.productName}
- Craft Type: ${request.craftType}
- Cultural Heritage: ${request.heritage || 'Not specified'}
- Artisan: ${request.artisanName} from ${request.artisanLocation}

Generate:
1. A detailed product description (2-3 sentences) that captures the craftsmanship, cultural significance, and emotional appeal
2. Three social media captions (different styles: inspirational, storytelling, and product-focused)

Respond with JSON in this exact format:
{
  "description": "Product description here",
  "captions": ["Caption 1", "Caption 2", "Caption 3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert storyteller for artisan crafts. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      description: result.description || "A beautiful handcrafted piece.",
      captions: result.captions || ["Handcrafted with love", "Artisan made", "Traditional craft"]
    };
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate product story");
  }
}

export async function generateArtisanStory(artisanName: string, specialty: string, location: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a storyteller who writes compelling artisan profiles that highlight their heritage, passion, and craftsmanship."
        },
        {
          role: "user",
          content: `Write a 2-3 sentence story for an artisan named ${artisanName} who specializes in ${specialty} and is from ${location}. Focus on their passion, heritage, and what makes their work special.`
        }
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content || "A passionate artisan dedicated to preserving traditional craftsmanship.";
  } catch (error) {
    console.error("Error generating artisan story:", error);
    throw new Error("Failed to generate artisan story");
  }
}
