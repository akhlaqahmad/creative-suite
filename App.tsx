import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import ImageGenerator from './components/ImageGenerator';
import EmailCampaignGenerator from './components/EmailCampaignGenerator';
import { TabButton } from './components/TabButton';
import { Bot, Image, Mail } from './components/Icons';

type Tab = 'chat' | 'image' | 'email';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('email');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chatbot />;
      case 'image':
        return <ImageGenerator />;
      case 'email':
        return <EmailCampaignGenerator />;
      default:
        return <EmailCampaignGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini Creative Suite
          </h1>
          <p className="text-gray-400 mt-2">AI-Powered Tools for Modern Creators</p>
        </header>

        <nav className="flex justify-center mb-8 bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm border border-gray-700 max-w-md mx-auto">
          <TabButton
            label="Email Campaign"
            icon={<Mail />}
            isActive={activeTab === 'email'}
            onClick={() => setActiveTab('email')}
          />
          <TabButton
            label="Image Gen"
            icon={<Image />}
            isActive={activeTab === 'image'}
            onClick={() => setActiveTab('image')}
          />
          <TabButton
            label="Chatbot"
            icon={<Bot />}
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
          />
        </nav>

        <main>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-blue-500/10 p-4 md:p-6 lg:p-8 min-h-[60vh]">
            {renderContent()}
          </div>
        </main>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Google Gemini. Built by a world-class senior frontend React engineer.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
