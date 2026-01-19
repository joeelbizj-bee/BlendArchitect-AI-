import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Loader2, FileCode, Layers, Wand2, Trash2, Info, Terminal } from 'lucide-react';
import { generateBlenderScript } from './services/geminiService';
import CodeBlock from './components/CodeBlock';
import SceneVisualizer from './components/SceneVisualizer';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setImage(null);
    setResultCode(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt && !image) return;

    setLoading(true);
    setResultCode(null);

    // Default prompt enhancement if image is present but prompt is sparse
    let finalPrompt = prompt;
    if (image && prompt.length < 10) {
      finalPrompt += " Create a detailed 3D scene based on the provided reference image. Structure the scene hierarchy logically.";
    } else if (!image && prompt.length > 0) {
        finalPrompt += " Ensure the scene is complete with floor, walls, and appropriate lighting.";
    }

    try {
      let base64Image = undefined;
      let mimeType = undefined;

      if (image) {
        // Parse the Data URL to get the correct MIME type and base64 data
        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64Image = matches[2];
        } else {
          // Fallback simple split if regex fails (unlikely for readAsDataURL results)
          base64Image = image.split(',')[1];
        }
      }

      const script = await generateBlenderScript(finalPrompt, base64Image, mimeType);
      setResultCode(script);
      
      // Scroll to result after a short delay
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error(error);
      setResultCode("# Error occurred while contacting the AI Architect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blender-dark text-blender-text font-sans selection:bg-blender-orange selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-blender-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blender-orange rounded-md flex items-center justify-center shadow-lg transform rotate-3">
              <Layers className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">BlendArchitect AI</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Procedural Scene Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
             <span className="hidden md:flex items-center gap-1 hover:text-white transition-colors cursor-help" title="Using gemini-3-pro-preview">
                <Wand2 size={14} /> <span>Powered by Gemini 2.5/3.0</span>
             </span>
             <a href="https://www.blender.org/" target="_blank" rel="noreferrer" className="hover:text-blender-orange transition-colors">
                Blender.org
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-blender-panel border border-gray-700 rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileCode size={20} className="text-blender-orange" />
              Scene Description
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  What should we build?
                </label>
                <textarea
                  className="w-full h-32 bg-[#1e1e1e] border border-gray-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blender-orange focus:border-transparent outline-none transition-all resize-none placeholder-gray-600"
                  placeholder="e.g. A modern classroom with 20 desks arranged in rows, a large whiteboard, teacher's desk with a laptop, and warm sunlight coming from the left."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  Reference Image (Optional)
                </label>
                <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer group ${
                    image ? 'border-blender-orange bg-blender-orange/5' : 'border-gray-600 hover:border-gray-500 hover:bg-[#252525]'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {image ? (
                    <div className="relative h-32 w-full flex items-center justify-center overflow-hidden rounded">
                      <img src={image} alt="Reference" className="max-h-full max-w-full object-contain" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Click to Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Upload size={24} />
                      <span className="text-xs">Drop sketch or wireframe here</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  type="submit"
                  disabled={loading || (!prompt && !image)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white transition-all ${
                    loading || (!prompt && !image)
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-blender-orange hover:bg-[#ff931e] shadow-lg shadow-blender-orange/20 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Architecting...</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      <span>Generate Script</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex gap-3 items-start">
             <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
             <div className="text-xs text-blue-200 space-y-1">
                <p className="font-semibold">Workflow Tip:</p>
                <p>1. Describe your scene or upload a wireframe.</p>
                <p>2. Generate the Python script.</p>
                <p>3. Customize <span className="text-blender-orange">Lighting Variables</span> at the top of the code.</p>
                <p>4. Open Blender → Scripting Tab → Paste & Run.</p>
             </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]" ref={resultRef}>
          {resultCode ? (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Generated Python Script</h3>
                  <span className="text-xs text-blender-orange font-mono">Ready to Run</span>
               </div>
               <CodeBlock code={resultCode} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4">
              <SceneVisualizer />
              {/* Empty state filler */}
              <div className="flex-1 bg-blender-panel border border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                   <Terminal size={32} className="text-gray-500" />
                </div>
                <h3 className="text-gray-400 font-medium">Awaiting Input</h3>
                <p className="text-sm text-gray-600 mt-2 max-w-xs">
                  Your generated bpy code will appear here. The AI is ready to convert your ideas into 3D objects.
                </p>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;