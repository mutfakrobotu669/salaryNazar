import OpenAI from 'openai';

// Initialize the OpenAI client
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Add some validation to help with debugging
if (!apiKey || apiKey === 'your_api_key_here') {
  console.error('OpenAI API key is missing or using the default placeholder value');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export interface SectorData {
  S1: number;
  S2: number;
  S3: number;
  S4: number;
  NIGHT: number;
  passS1: number;
  passS2: number;
  passS3: number;
  passS4: number;
  passNight: number;
  total: number;
  month?: string;
}

/**
 * Extracts flight sector data from an image using OpenAI's GPT-4 Vision API
 * @param imageBase64 Base64-encoded image data
 * @returns Extracted sector data or null if processing failed
 */
export async function extractSectorDataFromImage(imageBase64: string): Promise<SectorData | null> {
  try {
    console.log('Starting image analysis with OpenAI...');
    
    // Validate the base64 input
    if (!imageBase64 || imageBase64.length < 100) {
      console.error('Invalid image data received');
      return null;
    }
    
    const prompt = `
      You are a specialized flight sector image analyzer.
      This image shows a pilot's monthly flight sectors report.
      
      Extract EXACTLY these numeric values from the table:
      - S1 sectors (number of duty flights in row S1)
      - S2 sectors (number of duty flights in row S2)
      - S3 sectors (number of duty flights in row S3)
      - S4 sectors (number of duty flights in row S4)
      - NIGHT sectors (number of duty flights in row NIGHT)
      - Passenger S1 sectors (number of passenger flights in row S1)
      - Passenger S2 sectors (number of passenger flights in row S2)
      - Passenger S3 sectors (number of passenger flights in row S3)
      - Passenger S4 sectors (number of passenger flights in row S4)
      - Passenger NIGHT sectors (number of passenger flights in row NIGHT)
      - Total sectors
      
      In the image, look for a table with rows labeled S1, S2, S3, S4, NIGHT.
      Extract values from BOTH the "Duty" column AND the "Pass" column.
      
      Respond ONLY with a valid JSON object in this exact format:
      {
        "S1": number,
        "S2": number,
        "S3": number, 
        "S4": number,
        "NIGHT": number,
        "passS1": number,
        "passS2": number,
        "passS3": number,
        "passS4": number,
        "passNight": number,
        "total": number,
        "month": string or null
      }
      
      Note: If you cannot see any table or sector data, return: {"error": "No sector data found in image"}
    `;

    console.log('Making OpenAI API call...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use GPT-4o which has better vision capabilities
      messages: [
        {
          role: "system",
          content: "You are a specialized flight sector analyzer that extracts numeric sector data from pilot schedule images. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }, // Enforce JSON response
      max_tokens: 500
    });
    
    console.log('Received response from OpenAI');
    if (response.choices && response.choices.length > 0) {
      console.log('Response content:', response.choices[0]?.message.content);
    } else {
      console.error('No response choices returned from OpenAI');
    }

    // Extract the JSON response
    const content = response.choices[0]?.message.content;
    if (!content) {
      console.error('Empty content from OpenAI response');
      return null;
    }

    // With response_format: { type: "json_object" }, the content should already be valid JSON
    if (!content) {
      console.error('Could not extract JSON from response: empty content');
      return null;
    }

    try {
      // Clean up the string for better JSON parsing
      const cleanContent = content.replace(/```json|```/g, '').trim();
      console.log('Attempting to parse JSON:', cleanContent);
      
      const parsedData = JSON.parse(cleanContent);
      
      // Check if the API indicated an error
      if (parsedData.error) {
        console.error('API returned error:', parsedData.error);
        return null;
      }
      
      // Otherwise map to our expected format
      return {
        S1: Number(parsedData.S1 || 0),
        S2: Number(parsedData.S2 || 0),
        S3: Number(parsedData.S3 || 0),
        S4: Number(parsedData.S4 || 0),
        NIGHT: Number(parsedData.NIGHT || 0),
        passS1: Number(parsedData.passS1 || 0),
        passS2: Number(parsedData.passS2 || 0),
        passS3: Number(parsedData.passS3 || 0),
        passS4: Number(parsedData.passS4 || 0),
        passNight: Number(parsedData.passNight || 0),
        total: Number(parsedData.total || 0),
        month: parsedData.month || undefined
      };
    } catch (e) {
      console.error('Error parsing JSON from GPT response:', e);
      console.error('Raw content:', content);
      return null;
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return null;
  }
}
