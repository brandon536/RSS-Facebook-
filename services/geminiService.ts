
import { GoogleGenAI } from "@google/genai";

// Create a fresh Gemini instance using the environment variable directly.
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const personalizeContent = async (originalTitle: string, originalSummary: string, userContext: string) => {
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a social media expert. Based on this news/article:
      Title: ${originalTitle}
      Summary: ${originalSummary}
      
      And this additional user context/modification: "${userContext}"
      
      Create a highly engaging social media post. Include emojis and relevant hashtags.`,
    });
    return response.text || "No se pudo generar el texto.";
  } catch (error) {
    console.error("Error personalizing text:", error);
    return "Error al conectar con la IA.";
  }
};

export const personalizeImage = async (originalImageUrl: string, newText: string) => {
  const ai = getAIInstance();
  try {
    // We fetch the original image to send it as base64 for editing
    const imageResp = await fetch(originalImageUrl);
    const blob = await imageResp.blob();
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Re-imagine this image to match this new social media post content: "${newText}". Maintain the style but make it more vibrant and aligned with the topic.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      // Correctly identify and extract the generated image part
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return originalImageUrl; // Fallback to original if no image was returned
  } catch (error) {
    console.error("Error personalizing image:", error);
    return originalImageUrl;
  }
};
