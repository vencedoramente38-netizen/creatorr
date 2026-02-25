import React, { useState } from 'react';
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

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

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
