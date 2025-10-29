import React, { useState } from 'react';
import type { EmailCampaign } from '../types';
import { generateEmailContent, generateImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { Mail, Image as ImageIcon } from './Icons';

const EmailCampaignGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setCampaign(null);

        try {
            // Step 1: Generate Email Subject and Body
            const { subject, body } = await generateEmailContent(prompt);
            setCampaign({ subject, body, image: null }); // Show text content first

            // Step 2: Generate Image based on the email content
            const imagePrompt = `Create a visually appealing marketing image for an email with the subject: "${subject}". The email is about: ${body.substring(0, 200)}...`;
            const imageUrl = await generateImage(imagePrompt);

            setCampaign({ subject, body, image: imageUrl });

        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate campaign: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Email Campaign Generator</h2>
            <p className="text-gray-400 text-center mb-6 max-w-2xl">Describe your product, offer, or event, and we'll generate a complete email campaign with a subject, body, and a custom visual.</p>
            <form onSubmit={handleGenerate} className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A 25% off flash sale on all winter jackets..."
                    className="flex-1 w-full bg-gray-700 border border-gray-600 rounded-full py-3 px-5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full py-3 px-6 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? <LoadingSpinner /> : <Mail className="w-5 h-5" />}
                    <span>Generate</span>
                </button>
            </form>
            {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
            
            <div className="mt-8 w-full max-w-4xl">
                 {(isLoading || campaign) && (
                    <div className="bg-gray-900/50 rounded-lg border border-gray-700 shadow-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-300">Subject: <span className="text-white font-bold">{campaign?.subject || 'Generating...'}</span></h3>
                        </div>
                        <div className="border-t border-gray-700">
                            {campaign?.image ? (
                                <img src={campaign.image} alt="Generated campaign visual" className="w-full h-auto object-cover" />
                            ) : (
                                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2"/>
                                        <p>Generating visual...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            {campaign?.body ? (
                                <div className="prose prose-invert prose-p:my-3 text-gray-300" dangerouslySetInnerHTML={{ __html: campaign.body }} />
                            ) : (
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                                    <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                </div>
                            )}
                        </div>
                    </div>
                 )}
                 {!isLoading && !campaign && (
                    <div className="text-center text-gray-500 pt-16">
                        <Mail className="w-20 h-20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">Your email campaign preview will appear here</h3>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default EmailCampaignGenerator;
