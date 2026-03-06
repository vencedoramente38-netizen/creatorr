import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Radar from './Radar';
import CreatorLab from './CreatorLab';
import SyncEditor from './SyncEditor';
import MyPrompts from './MyPrompts';
import Settings from './Settings';
import CreateProfile from './CreateProfile';
import Auth from './Auth';
import { Academy } from './Academy';
import { ViralCreator } from './ViralCreator';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement("link");
    link.type = "image/jpeg";
    link.rel = "shortcut icon";
    link.href = "https://i.postimg.cc/rwwB300w/image.jpg";
    document.head.appendChild(link);

    // Título da aba
    document.title = "CreatorAI Pro";
  }, []);

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'radar': return <Radar />;
      case 'criar-perfil': return <CreateProfile />;
      case 'creator-lab': return <CreatorLab />;
      case 'sync-editor': return <SyncEditor />;
      case 'my-prompts': return <MyPrompts />;
      case 'viral-creator': return <ViralCreator />;
      case 'academy': return <Academy />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
