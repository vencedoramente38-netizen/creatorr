import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Product } from './types';
import { AppProvider, useApp } from './AppContext';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Radar from './Radar';
import CreatorLab from './CreatorLab';
import SyncEditor from './SyncEditor';
import Settings from './Settings';
import CreateProfile from './CreateProfile';
import Auth from './Auth';
import { Academy } from './Academy';
import { ViralCreator } from './ViralCreator';

// ───────────────── Global Styles ─────────────────
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
      color: white;
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

// ───────────────── RainbowButton ─────────────────
function RainbowButton({ onClick, children, disabled, style = {} }: {
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
      style={{
        padding: "12px 28px",
        fontSize: 15,
        fontWeight: 700,
        minWidth: 160,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ───────────────── PrimaryBtn ─────────────────
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
        position: "relative",
        overflow: "hidden",
        background: disabled ? "#141414" : "#DEDEDE",
        color: disabled ? "#71717a" : "#050505",
        border: "none",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      <span className="neon-top" style={{ position: "absolute", height: 1, opacity: 0, top: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)", transition: "opacity 0.5s ease", pointerEvents: "none" }} />
      <span style={{ position: "absolute", height: 1, opacity: 0.3, bottom: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)", pointerEvents: "none" }} />
      {children}
    </button>
  );
}

// ───────────────── Admin Panel ─────────────────
const AdminProducts: React.FC = () => {
  const { products, setProducts, addNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Utensílios',
    priceText: 'R$ ',
    margin: 30,
    viralScore: 85,
    concurrency: 'Média',
    sales: 0,
    salesPerDay: 0,
    deliveryTime: '7-12 dias',
    supplierRating: 4.5,
    commission: 15,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=300',
    tiktokUrl: '#'
  });

  const handleSave = () => {
    const productToAdd: Product = {
      ...newProduct as Product,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updated = [productToAdd, ...products];
    setProducts(updated);
    addNotification("Sucesso!", "Produto adicionado com sucesso.");
    setShowModal(false);
    setNewProduct({
      name: '', category: 'Utensílios', priceText: 'R$ ', margin: 30, viralScore: 85,
      concurrency: 'Média', sales: 0, salesPerDay: 0, deliveryTime: '7-12 dias',
      supplierRating: 4.5, commission: 15, rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=300',
      tiktokUrl: '#'
    });
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    addNotification("Removido", "Produto removido da lista.");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px", background: "#050505",
    border: "1px solid #27272a", borderRadius: "8px", color: "white",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "24px", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Painel Admin</h1>
          <p style={{ color: "#71717a", margin: "4px 0 0 0", fontSize: "14px" }}>Gerencie os produtos do app</p>
        </div>
        <PrimaryBtn onClick={() => setShowModal(true)} style={{ padding: "12px 24px", fontSize: "14px" }}>
          + Adicionar Produto
        </PrimaryBtn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {products.map(p => (
          <div key={p.id} style={{
            padding: "20px",
            background: "#111111",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderTop: `3px solid ${p.viralScore > 94 ? '#DEDEDE' : p.viralScore > 90 ? '#a855f7' : '#06b6d4'}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "box-shadow 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ width: "48px", height: "48px", background: "#222", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <p style={{ fontWeight: "bold", margin: 0, fontSize: "14px" }}>{p.name}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#71717a" }}>{p.category} • {p.priceText}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#3f3f46" }}>Score: {p.viralScore}</p>
              </div>
            </div>
            <button
              onClick={() => removeProduct(p.id)}
              style={{ padding: "8px 12px", background: "none", border: "1px solid #ef4444", color: "#ef4444", cursor: "pointer", fontWeight: "bold", borderRadius: "8px", fontSize: "12px" }}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#141414", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "540px", border: "1px solid #27272a", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "bold" }}>Novo Produto</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#71717a", marginBottom: "8px" }}>Nome do Produto</label>
                <input style={inputStyle} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Ex: Kit de Skincare Premium" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#71717a", marginBottom: "8px" }}>Categoria</label>
                  <select style={{ ...inputStyle, background: "#050505" }} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                    <option value="Utensílios">Utensílios</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Organização">Organização</option>
                    <option value="Personalizado">Personalizado</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Moda">Moda</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#71717a", marginBottom: "8px" }}>Score Viral (0-100)</label>
                  <input type="number" min={0} max={100} style={inputStyle} value={newProduct.viralScore} onChange={e => setNewProduct({ ...newProduct, viralScore: Number(e.target.value) })} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#71717a", marginBottom: "8px" }}>Preço de Venda</label>
                  <input style={inputStyle} value={newProduct.priceText} onChange={e => setNewProduct({ ...newProduct, priceText: e.target.value })} placeholder="R$ 49,90" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#71717a", marginBottom: "8px" }}>Comissão (%)</label>
                  <input type="number" style={inputStyle} value={newProduct.commission} onChange={e => setNewProduct({ ...newProduct, commission: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#71717a", marginBottom: "8px" }}>Imagem URL</label>
                <input style={inputStyle} value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "14px", background: "#27272a", border: "none", borderRadius: "12px", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
                  Cancelar
                </button>
                <PrimaryBtn onClick={handleSave} style={{ flex: 1, padding: "14px", fontSize: "14px" }}>
                  Salvar Produto
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ───────────────── App Content ─────────────────
const AppContent: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement("link");
    link.type = "image/jpeg";
    link.rel = "shortcut icon";
    link.href = "https://i.postimg.cc/rwwB300w/image.jpg";
    document.head.appendChild(link);
    document.title = "CreatorAI Pro";
  }, []);

  if (!user) return <Auth />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'radar': return <Radar />;
      case 'criar-perfil': return <CreateProfile />;
      case 'creator-lab': return <CreatorLab />;
      case 'creator-editor': return <SyncEditor />;
      case 'viral-creator': return <ViralCreator />;
      case 'academy': return <Academy />;
      case 'admin': return <AdminProducts />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isMobile={isMobile}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
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
