import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Package, Shield, Lock, Save, Trash2, Check, LayoutDashboard } from 'lucide-react';
import { PrimaryBtn } from './App';
import { sbGet, sbPost, sbDelete } from './lib/supabase';

function RainbowButton({ onClick, children, disabled, style = {} }: {
  onClick?: () => void; children: React.ReactNode; disabled?: boolean; style?: React.CSSProperties;
}) {
  return (
    <button onClick={onClick} disabled={disabled} className="rainbow-btn"
      style={{ padding: "14px 32px", fontSize: 16, fontWeight: 700, minWidth: 180, borderRadius: 14, ...style }}>
      {children}
    </button>
  );
}

export default function Settings() {
  const { addNotification, products, setProducts } = useApp();

  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTab, setAdminTab] = useState<'keys' | 'products'>('keys');

  // Keys state
  const [keys, setKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);

  // Form state (product)
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Utensílios', priceText: 'R$ ', viralScore: 85,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=300',
    tiktokUrl: ''
  });

  // Keys Fetch
  const fetchKeys = async () => {
    setLoadingKeys(true);
    const data = await sbGet('keys');
    if (data) setKeys(data);
    setLoadingKeys(false);
  };

  useEffect(() => {
    if (adminAuthenticated) fetchKeys();
  }, [adminAuthenticated]);

  const handleAdminAuth = () => {
    if (adminPassword === 'admin123') {
      setAdminAuthenticated(true);
      addNotification("Acesso concedido", "Bem-vindo ao painel de administração.");
    } else {
      addNotification("Erro", "Senha de admin incorreta.");
    }
  };

  const handleGenerateKey = async (type: 'monthly' | 'lifetime') => {
    setGeneratingKey(true);
    const prefix = type === 'monthly' ? 'MENSAL-' : 'VITALICIO-';
    const key = prefix + Math.random().toString(36).substring(2, 10).toUpperCase();

    const data = await sbPost('keys', { key, type });
    if (data && data.length > 0) {
      setKeys([data[0], ...keys]);
      addNotification("Chave Gerada", `Nova chave ${type} criada com sucesso.`);
    } else {
      // fallback se a API n retornar o single object, apenas refetch
      fetchKeys();
      addNotification("Chave Gerada", `Nova chave ${type} criada.`);
    }
    setGeneratingKey(false);
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta chave?")) return;
    try {
      await sbDelete('keys', `id=eq.${id}`);
      setKeys(keys.filter(k => k.id !== id));
      addNotification("Chave Excluída", "A chave foi removida.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.imageUrl || !newProduct.tiktokUrl) {
      addNotification("Erro", "Preencha os campos obrigatórios.");
      return;
    }
    const data = await sbPost('products', newProduct);
    if (data && data.length > 0) {
      setProducts([data[0], ...products]);
    } else {
      // fallback (caso sbPost não retorne a single row devido header return=representation missing, o app local context n recarrega sozinho)
      const prod = { ...newProduct, id: Math.random().toString() };
      setProducts([prod, ...products]);
    }
    setShowProductModal(false);
    addNotification("Produto adicionado", "O produto foi salvo no Supabase.");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Excluir produto?")) return;
    try {
      await sbDelete('products', `id=eq.${id}`);
      setProducts(products.filter(p => p.id !== id));
      addNotification("Produto removido", "Excluído com sucesso.");
    } catch (error) {
      console.error(error);
    }
  };

  const cardStyle = {
    background: "#09090B", border: "1px solid #27272a", borderRadius: 24, padding: 32, marginBottom: 24
  };

  const inpStyle = {
    width: "100%", padding: "14px", background: "#141414", border: "1px solid #27272a",
    borderRadius: 12, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" as React.CSSProperties["boxSizing"], fontFamily: "inherit"
  };

  return (
    <div style={{ maxWidth: 900, mx: "auto", margin: "0 auto", padding: "24px 16px 80px", color: "white" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>Configurações</h1>
        <p style={{ color: "#71717a", margin: 0, fontSize: 15 }}>Painel de Administração e Gestão do Sistema.</p>
      </div>

      {/* Admin Auth */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ padding: 10, background: "rgba(249,115,22,0.1)", color: "#f97316", borderRadius: 12 }}>
            <Shield size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Painel de Admin</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#71717a" }}>Acesso restrito para gestão de chaves e produtos.</p>
          </div>
        </div>

        {!adminAuthenticated ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#71717a" }} />
              <input
                type="password" placeholder="Digite a senha de admin" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                style={{ ...inpStyle, paddingLeft: 44, background: "#050505" }}
              />
            </div>
            <PrimaryBtn onClick={handleAdminAuth} style={{ padding: "14px", fontSize: 15, width: "100%" }}>
              Acessar Painel
            </PrimaryBtn>
          </div>
        ) : (
          <div style={{ padding: "16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, color: "#10b981" }}>
            <Check size={20} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Autenticado como Administrador</span>
          </div>
        )}
      </motion.div>

      {/* Admin Content */}
      <AnimatePresence>
        {adminAuthenticated && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ ...cardStyle, background: "#050505", border: "1px solid #1a1a1a" }}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 32, paddingBottom: 16, borderBottom: "1px solid #1a1a1a" }}>
                <button
                  onClick={() => setAdminTab('keys')}
                  style={{
                    padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                    background: adminTab === 'keys' ? "#141414" : "transparent",
                    color: adminTab === 'keys' ? "white" : "#71717a"
                  }}
                >
                  <Key size={16} style={{ display: "inline-block", marginRight: 8, verticalAlign: "-3px" }} /> Gerenciar Chaves
                </button>
                <button
                  onClick={() => setAdminTab('products')}
                  style={{
                    padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                    background: adminTab === 'products' ? "#141414" : "transparent",
                    color: adminTab === 'products' ? "white" : "#71717a"
                  }}
                >
                  <Package size={16} style={{ display: "inline-block", marginRight: 8, verticalAlign: "-3px" }} /> Gerenciar Produtos
                </button>
              </div>

              {/* KEYS TAB */}
              {adminTab === 'keys' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                    <PrimaryBtn onClick={() => handleGenerateKey('monthly')} disabled={generatingKey} style={{ padding: "12px 20px", flex: 1 }}>
                      + Gerar Chave Mensal
                    </PrimaryBtn>
                    <RainbowButton onClick={() => handleGenerateKey('lifetime')} disabled={generatingKey} style={{ padding: "12px 20px", flex: 1, minWidth: "auto" }}>
                      + Gerar Chave Vitalícia ♾️
                    </RainbowButton>
                  </div>

                  <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", color: "#71717a" }}>
                          <th style={{ padding: "12px 16px", fontWeight: 600 }}>Chave</th>
                          <th style={{ padding: "12px 16px", fontWeight: 600 }}>Tipo</th>
                          <th style={{ padding: "12px 16px", fontWeight: 600 }}>Status</th>
                          <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingKeys ? (
                          <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#71717a" }}>Carregando chaves...</td></tr>
                        ) : keys.length === 0 ? (
                          <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#71717a" }}>Nenhuma chave encontrada.</td></tr>
                        ) : keys.map(k => (
                          <tr key={k.id} style={{ borderBottom: "1px solid #1a1a1a", background: k.used ? "rgba(255,255,255,0.02)" : "transparent" }}>
                            <td style={{ padding: "16px", fontFamily: "monospace", color: k.used ? "#71717a" : "white" }}>{k.key}</td>
                            <td style={{ padding: "16px" }}>
                              <span style={{ padding: "4px 8px", background: k.type === 'lifetime' ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.05)", color: k.type === 'lifetime' ? "#a855f7" : "#DEDEDE", borderRadius: 6, fontSize: 11, fontWeight: "bold", textTransform: "uppercase" }}>
                                {k.type}
                              </span>
                            </td>
                            <td style={{ padding: "16px" }}>
                              {k.used ? (
                                <span style={{ color: "#ef4444", fontSize: 12, fontWeight: "bold" }}>Usada ({k.used_by})</span>
                              ) : (
                                <span style={{ color: "#10b981", fontSize: 12, fontWeight: "bold" }}>Disponível</span>
                              )}
                            </td>
                            <td style={{ padding: "16px", textAlign: "right" }}>
                              <button onClick={() => handleDeleteKey(k.id)} style={{ padding: "6px 12px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 12 }}>
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* PRODUCTS TAB */}
              {adminTab === 'products' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                    <PrimaryBtn onClick={() => setShowProductModal(true)} style={{ padding: "12px 24px" }}>+ Adicionar Produto</PrimaryBtn>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {products.map(p => (
                      <div key={p.id} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 16, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={p.imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", background: "#141414" }} />
                          <div>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: "bold" }}>{p.name}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#71717a" }}>{p.category} • {p.priceText}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: 8 }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}

                    {products.length === 0 && (
                      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#71717a", fontSize: 14 }}>
                        Nenhum produto cadastrado.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Novo Produto */}
      {showProductModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#09090B", border: "1px solid #27272a", borderRadius: 24, padding: 32, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, marginTop: 0 }}>Adicionar Novo Produto</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#71717a", fontWeight: "bold", marginBottom: 6, textTransform: "uppercase" }}>Nome do Produto *</label>
                <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={inpStyle} placeholder="Ex: Ring Light Profissional" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#71717a", fontWeight: "bold", marginBottom: 6, textTransform: "uppercase" }}>Preço Visível</label>
                  <input value={newProduct.priceText} onChange={e => setNewProduct({ ...newProduct, priceText: e.target.value })} style={inpStyle} placeholder="Ex: R$ 49,90" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#71717a", fontWeight: "bold", marginBottom: 6, textTransform: "uppercase" }}>Score Viral (0 a 100)</label>
                  <input type="number" min={0} max={100} value={newProduct.viralScore} onChange={e => setNewProduct({ ...newProduct, viralScore: Number(e.target.value) })} style={inpStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#71717a", fontWeight: "bold", marginBottom: 6, textTransform: "uppercase" }}>Categoria</label>
                <input value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} style={inpStyle} placeholder="Ex: Tecnologia, Beleza..." />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#71717a", fontWeight: "bold", marginBottom: 6, textTransform: "uppercase" }}>URL da Imagem *</label>
                <input value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} style={inpStyle} placeholder="https://..." />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#71717a", fontWeight: "bold", marginBottom: 6, textTransform: "uppercase" }}>Link de Afiliado (Tiktok) *</label>
                <input value={newProduct.tiktokUrl} onChange={e => setNewProduct({ ...newProduct, tiktokUrl: e.target.value })} style={inpStyle} placeholder="https://..." />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button onClick={() => setShowProductModal(false)} style={{ flex: 1, padding: 14, background: "transparent", border: "1px solid #27272a", borderRadius: 12, color: "white", fontWeight: "bold", cursor: "pointer" }}>
                  Cancelar
                </button>
                <PrimaryBtn onClick={handleSaveProduct} style={{ flex: 1, padding: 14 }}>
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


