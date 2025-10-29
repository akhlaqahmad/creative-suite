import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { Image as ImageIcon, Download } from './Icons';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate image: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const downloadImage = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${prompt.slice(0, 30).replace(/\s/g, '_') || 'generated_image'}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Image Generator</h2>
            <form onSubmit={handleGenerate} className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A futuristic cityscape at sunset..."
                    className="flex-1 w-full bg-gray-700 border border-gray-600 rounded-full py-3 px-5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full py-3 px-6 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? <LoadingSpinner /> : <ImageIcon className="w-5 h-5" />}
                    <span>Generate</span>
                </button>
            </form>
            {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
            <div className="mt-8 w-full max-w-3xl aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 relative">
                {isLoading && <LoadingSpinner size="lg" />}
                {!isLoading && !imageUrl && (
                    <div className="text-center text-gray-500">
                        <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                        <p>Your generated image will appear here</p>
                    </div>
                )}
                {imageUrl && (
                    <>
                        <img src={imageUrl} alt={prompt} className="rounded-lg object-contain w-full h-full" />
                        <button onClick={downloadImage} className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors">
                            <Download className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
