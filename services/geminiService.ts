import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert Technical Artist and Python Developer specializing in the Blender API (bpy). 
Your task is to generate complete, executable Python scripts that can be pasted directly into Blender's scripting tab to procedurally generate 3D scenes.

Rules:
1.  **Imports**: Always import \`bpy\`, \`math\`, and \`random\`.
2.  **Reset**: Start the script by clearing the existing scene (delete all objects, meshes, cameras, lights) to ensure a clean slate.
3.  **Modularity**: Use functions for different components (e.g., \`create_chair()\`, \`create_table()\`, \`setup_lighting()\`).
4.  **Primitives**: Use basic primitives (cubes, cylinders, planes) to approximate complex shapes. Scale and position them precisely to look like the target objects.
5.  **Collections**: Organize generated objects into Blender Collections for cleanliness.
6.  **Lighting & Environment**: The \`setup_lighting()\` function MUST be advanced.
    - **Sun Light**: Add a 'Sun' light (type='SUN') for key direction.
    - **Fill Light**: Add an 'Area' or 'Point' light for fill.
    - **World Environment**: Configure \`bpy.context.scene.world.use_nodes = True\`.
    - **HDRI Ready**: Add a setup for an Environment Texture node but leave it disconnected or commented out. Include a clear comment on how to link an .exr/.hdr file.
    - **Variables**: Define configuration variables at the very top of the script (e.g., \`SUN_STRENGTH = 4.0\`, \`USE_HDRI = False\`, \`BG_COLOR = (0.05, 0.05, 0.05, 1)\`) for easy user adjustment.
7.  **Camera**: Always set up a camera positioned to view the scene nicely.
8.  **Materials**: Create simple materials with colors to differentiate objects.
9.  **Output Format**: Return ONLY the Python code block wrapped in standard markdown (\`\`\`python ... \`\`\`). Do not add conversational filler before or after the code.
10. **Comments**: Add helpful comments explaining what each part of the script does.

If the user asks for a specific scene (e.g., "A classroom"), detail the props: desks, chairs, whiteboard, teacher's desk, bookshelves, windows.
`;

export const generateBlenderScript = async (
  prompt: string,
  imageBase64?: string,
  mimeType?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We use the Pro model for better coding and reasoning capabilities
    const modelId = 'gemini-3-pro-preview';

    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64,
        },
      });
      parts.push({
        text: "Analyze this image and write a Blender Python script to recreate this scene layout and objects as closely as possible using procedural primitives.",
      });
    }

    parts.push({
      text: `Create a Blender Python script for the following request: "${prompt}". Ensure it looks professional and follows best practices. Implement the advanced lighting setup as described in the system instructions.`
    });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for consistent code
      }
    });

    return response.text || "# Error: No code generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `# Error generating script: ${error instanceof Error ? error.message : "Unknown error"}\n# Please check your API key and try again.`;
  }
};