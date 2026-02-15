import { GoogleGenerativeAI } from "@google/generative-ai";

// Use Google Gemini with latest model for better AI generation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCoZszH2MDMFP65aAILLk-5bhlqhXDZvB4");

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `You are an expert storyteller specializing in artisan crafts, cultural heritage, and authentic brand narratives. Your task is to create compelling, emotionally resonant content for a handmade product that celebrates craftsmanship and cultural significance.

Product Details:
- Name: ${request.productName}
- Craft Type: ${request.craftType}
- Cultural Heritage: ${request.heritage || 'Not specified'}
- Artisan: ${request.artisanName} from ${request.artisanLocation}

Requirements:
1. Create a detailed, vivid product description (2-3 sentences) that:
   - Captures the craftsmanship and artisan skill
   - Highlights cultural significance and heritage
   - Evokes emotional appeal and authenticity
   - Mentions unique materials or techniques (if culturally appropriate)

2. Generate three distinct social media captions:
   - Caption 1 (Inspirational): Focus on the artisan's passion and dedication
   - Caption 2 (Storytelling): Share the cultural heritage and traditional techniques
   - Caption 3 (Product-Focused): Emphasize quality, uniqueness, and buyer benefits

Important: Respond ONLY with valid JSON in this exact format (no additional text):
{
  "description": "Detailed product description here...",
  "captions": [
    "Inspirational caption about the artisan here...",
    "Storytelling caption about heritage and techniques here...",
    "Product-focused caption about quality and benefits here..."
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from the response
    let parsedResult;
    try {
      // Try to extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Fallback response
      parsedResult = {
        description: `A stunning example of ${request.craftType} craftsmanship from ${request.artisanName} in ${request.artisanLocation}. This piece beautifully demonstrates traditional artisan techniques and cultural heritage, created with meticulous attention to detail and authentic materials.`,
        captions: [
          `Meet ${request.artisanName}, a passionate artisan dedicated to preserving ${request.heritage || request.craftType} traditions through exceptional handcrafted work.`,
          `Every piece tells a story of heritage and tradition. This ${request.productName} showcases generations of ${request.craftType} expertise from ${request.artisanLocation}.`,
          `Discover authentic ${request.productName} by ${request.artisanName}. Handcrafted quality that honors tradition and supports artisan communities. 🎨✨`
        ]
      };
    }
    
    return {
      description: parsedResult.description || "A beautiful handcrafted piece showcasing exceptional artisan skill and cultural heritage.",
      captions: parsedResult.captions || [
        "Handcrafted with passion and tradition",
        "Supporting artisans and preserving cultural heritage",
        "Discover authentic craftsmanship"
      ]
    };
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate product story. Please try again.");
  }
}

export async function generateArtisanStory(artisanName: string, specialty: string, location: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Write a compelling 2-3 sentence story about an artisan named ${artisanName} who specializes in ${specialty} and is from ${location}. 
    
    Focus on:
    - Their passion and dedication to their craft
    - The cultural or traditional significance of their work
    - What makes their craftsmanship unique and valuable
    - The human story behind the art
    
    Make it emotionally engaging and authentic. Keep it concise but impactful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || `${artisanName} is a talented artisan from ${location} who creates exceptional ${specialty} pieces, blending traditional techniques with contemporary artistry to preserve cultural heritage.`;
  } catch (error) {
    console.error("Error generating artisan story:", error);
    throw new Error("Failed to generate artisan story");
  }
}
