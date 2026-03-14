import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { AppProvider, useApp } from './AppContext';
import Layout, { ParticlesBg } from './Layout';
import { STOR } from './lib/supabase';
import Dashboard from './Dashboard';
import Radar from './Radar';
import CreatorLab from './CreatorLab';
import SyncEditor from './SyncEditor';
import Settings from './Settings';
import CreateProfile from './CreateProfile';
import Auth from './Auth';
import { Academy } from './Academy';
import ViralCreator from './ViralCreator';

// ─── Global Styles: SF Pro font, rainbow button, neon button, shine ───
const GlobalStyles = () => (
  <style>{`
    * {
      font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :root {
      --color-1: hsl(0, 100%, 63%);
      --color-2: hsl(270, 100%, 63%);
      --color-3: hsl(210, 100%, 63%);
      --color-4: hsl(195, 100%, 63%);
      --color-5: hsl(90, 100%, 63%);
      --rainbow-speed: 2s;
    }

    @keyframes rainbowAnim {
      0% { background-position: 0%; }
      100% { background-position: 200%; }
    }

    @keyframes rainbowGlow {
      0% { background-position: 0%; }
      100% { background-position: 200%; }
    }

    .rainbow-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: 700;
      border-radius: 12px;
      border: calc(0.08rem) solid transparent;
      background-origin: border-box;
      background-clip: padding-box, border-box, border-box;
      background-size: 200%;
      background-image:
        linear-gradient(#050505, #050505),
        linear-gradient(#050505 50%, rgba(5,5,5,0.6) 80%, rgba(5,5,5,0)),
        linear-gradient(90deg, var(--color-1), var(--color-5), var(--color-3), var(--color-4), var(--color-2));
      animation: rainbowAnim var(--rainbow-speed) infinite linear;
      color: white !important;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }

    .rainbow-btn::before {
      content: "";
      position: absolute;
      bottom: -20%;
      left: 50%;
      transform: translateX(-50%);
      z-index: -1;
      height: 20%;
      width: 60%;
      background: linear-gradient(90deg, var(--color-1), var(--color-5), var(--color-3), var(--color-4), var(--color-2));
      background-size: 200%;
      animation: rainbowGlow var(--rainbow-speed) infinite linear;
      filter: blur(0.8rem);
      border-radius: 50%;
    }

    .rainbow-btn:hover { opacity: 0.9; }
    .rainbow-btn:disabled { pointer-events: none; opacity: 0.5; }

    .neon-btn:hover .neon-top { opacity: 1 !important; }

    @keyframes shine {
      0% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
      100% { background-position: 0% 0%; }
    }
  `}</style>
);

// ─── RainbowButton helper ───
export function RainbowButton({ onClick, children, disabled, style = {} }: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rainbow-btn"
      style={{ padding: "12px 28px", fontSize: 15, fontWeight: 700, minWidth: 160, ...style }}
    >
      {children}
    </button>
  );
}

// ─── PrimaryBtn helper ───
export function PrimaryBtn({ onClick, children, style = {}, disabled }: {
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="neon-btn"
      style={{
        position: "relative", overflow: "hidden",
        background: disabled ? "#141414" : "#DEDEDE",
        color: disabled ? "#71717a" : "#050505",
        border: "none", borderRadius: "12px",
        fontWeight: "bold", cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        ...style,
      }}
    >
      <span className="neon-top" style={{ position: "absolute", height: 1, opacity: 0, top: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)", transition: "opacity 0.5s ease", pointerEvents: "none" }} />
      <span style={{ position: "absolute", height: 1, opacity: 0.3, bottom: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)", pointerEvents: "none" }} />
      {children}
    </button>
  );
}

// ─── Admin Panel ───
const AdminPanel: React.FC = () => {
  const { products, setProducts, addNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: 'Utensílios', priceText: 'R$ ', margin: 30, viralScore: 85,
    concurrency: 'Média', sales: 0, salesPerDay: 0, deliveryTime: '7-12 dias',
    supplierRating: 4.5, commission: 15, rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=300',
    tiktokUrl: '#'
  });

  const handleSave = () => {
    if (!newProduct.name?.trim()) return;
    const productToAdd: Product = { ...(newProduct as Product), id: Math.random().toString(36).substr(2, 9) };
    setProducts([productToAdd, ...products]);
    addNotification("Produto adicionado!", `"${productToAdd.name}" foi adicionado com sucesso.`);
    setShowModal(false);
    setNewProduct({ name: '', category: 'Utensílios', priceText: 'R$ ', margin: 30, viralScore: 85, concurrency: 'Média', sales: 0, salesPerDay: 0, deliveryTime: '7-12 dias', supplierRating: 4.5, commission: 15, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=300', tiktokUrl: '#' });
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    addNotification("Removido", "Produto removido da lista.");
  };

  const inp: React.CSSProperties = { width: "100%", padding: "11px 12px", background: "#050505", border: "1px solid #27272a", borderRadius: "8px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

  {/* removed AdminPanel markup */ }
};

// ─── App Content ───
const AppContent: React.FC = () => {
  const { user, setUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [appLoading, setAppLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authTab, setAuthTab] = useState("login"); // "login" ou "register"
  const [expiredMsg, setExpiredMsg] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const session = await STOR.g("session");

      if (!session) {
        setAppLoading(false);
        setShowAuth(true);
        return;
      }

      if (session.plan_type === "monthly" && session.expires_at) {
        if (new Date(session.expires_at) < new Date()) {
          await STOR.s("session", null);
          setExpiredMsg("Seu plano mensal expirou. Crie uma nova conta com uma chave válida.");
          setAppLoading(false);
          setShowAuth(true);
          return;
        }
      }

      setCurrentUser(session);
      setUser(session);
      setAppLoading(false);
      setShowAuth(false);
    };

    checkSession();
  }, [setUser]);

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement("link");
    link.type = "image/jpeg"; link.rel = "shortcut icon";
    link.href = "https://i.postimg.cc/Ghyb70wM/image-removebg-preview.png";
    document.head.appendChild(link);
    document.title = "CreatorAI Pro";
  }, []);

  if (appLoading) return (
    <div style={{
      position: "fixed", inset: 0, background: "#050505",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 16, zIndex: 9999,
    }}>
      <ParticlesBg />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
        <div style={{
          color: "white", fontSize: 20, fontWeight: 700,
          fontFamily: '"SF Pro Display", Helvetica, Arial, sans-serif'
        }}>
          Carregando...
        </div>
      </div>
    </div>
  );

  if (showAuth) {
    return (
      <Auth
        authTab={authTab}
        setAuthTab={setAuthTab}
        expiredMsg={expiredMsg}
        onLoginSuccess={(session: any) => {
          setCurrentUser(session);
          setUser(session);
          setShowAuth(false);
        }}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'radar': return <Radar />;
      case 'criar-perfil': return <CreateProfile />;
      case 'creator-lab': return <CreatorLab />;
      case 'creator-editor': return <SyncEditor />;
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
      <GlobalStyles />
      <AppContent />
    </AppProvider>
  );
}
