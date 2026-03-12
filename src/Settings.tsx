import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, Shield, Lock, ChevronRight, Check, Camera, X } from 'lucide-react';
import { PrimaryBtn } from './App';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 style={{
    fontSize: "11px", fontWeight: 800, color: "#71717a", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px"
  }}>
    {children}
  </h4>
);

const AVATAR_POOL = ["👨‍💻", "👩‍💻", "🤖", "🎨", "🚀", "⚡", "🔥", "💎", "🌟", "📱", "🌐", "🎮", "👑", "🦄", "🌈", "🎸"];

export default function Settings() {
  const { profile, setProfile, notificationsEnabled, setNotificationsEnabled, addNotification } = useApp();
  const [localName, setLocalName] = useState(profile.name);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    setLocalName(profile.name);
  }, [profile.name]);

  const handleSaveProfile = () => {
    setProfile({ ...profile, name: localName });
    addNotification("Sucesso", "Perfil atualizado com sucesso!");
  };

  const selectAvatar = (icon: string) => {
    setProfile({ ...profile, avatar: icon });
    setShowAvatarModal(false);
  };

  const handleAdminAccess = () => {
    if (adminPassword === 'admin123') {
      // In a real app this would navigate or unlock a state.
      // For this spec, we'll just show a success for now or assume Layout handles 'admin' tab.
      addNotification("Acesso concedido", "Bem-vindo ao painel admin.");
      setShowAdminModal(false);
    } else {
      addNotification("Erro", "Senha incorreta.");
    }
  };

  const cardStyle = {
    background: "#09090B", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "32px", marginBottom: "40px"
  };

  const inpStyle = {
    width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", transition: "all 0.2s"
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.02em", margin: "0 0 8px 0" }}>Configurações</h1>
        <p style={{ color: "#71717a", margin: 0 }}>Gerencie seus dados e preferências da conta.</p>
      </header>

      {/* Perfil */}
      <section style={cardStyle}>
        <SectionTitle><User size={14} /> Perfil</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "24px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px"
            }}>
              {profile.avatar || "👤"}
            </div>
          </div>
          <button
            onClick={() => setShowAvatarModal(true)}
            style={{
              padding: "10px 20px", borderRadius: "10px", background: "white", color: "black",
              fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <Camera size={16} /> Escolher da galeria
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>Nome completo</label>
            <input
              style={inpStyle} value={localName} onChange={e => setLocalName(e.currentTarget.value)}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>Email</label>
            <input style={{ ...inpStyle, opacity: 0.6, cursor: "not-allowed" }} value={profile.email} readOnly />
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          style={{
            padding: "14px 28px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", color: "white",
            fontSize: "14px", fontWeight: 700, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        >
          Salvar perfil
        </button>
      </section>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "40px 0" }} />

      {/* Notificações */}
      <section style={cardStyle}>
        <SectionTitle><Bell size={14} /> Notificações</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h5 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px 0" }}>Ativar notificações</h5>
            <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>Receba alertas sobre vendas e atualizações</p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            style={{
              width: "44px", height: "24px", borderRadius: "12px", position: "relative", cursor: "pointer", border: "none",
              background: notificationsEnabled ? "#10b981" : "rgba(255,255,255,0.1)", transition: "all 0.3s"
            }}
          >
            <div style={{
              width: "18px", height: "18px", borderRadius: "50%", background: "white", position: "absolute", top: "3px",
              left: notificationsEnabled ? "23px" : "3px", transition: "all 0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }} />
          </button>
        </div>
      </section>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "40px 0" }} />

      {/* Painel de Admin */}
      <section style={cardStyle}>
        <SectionTitle><Shield size={14} /> Painel de Admin</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h5 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px 0" }}>Acesso restrito</h5>
            <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>Gestão de chaves e produtos do sistema.</p>
          </div>
          <button
            onClick={() => setShowAdminModal(true)}
            style={{
              padding: "10px 20px", borderRadius: "10px", background: "rgba(249,115,22,0.1)", color: "#f97316",
              fontSize: "13px", fontWeight: 700, border: "1px solid rgba(249,115,22,0.2)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            Acessar painel <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Avatar Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)"
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: "100%", maxWidth: "400px", background: "#09090B", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", padding: "32px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Escolher Avatar</h3>
                <button onClick={() => setShowAvatarModal(false)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {AVATAR_POOL.map(icon => (
                  <button
                    key={icon} onClick={() => selectAvatar(icon)}
                    style={{
                      height: "64px", borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                      fontSize: "24px", cursor: "pointer", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)"
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: "100%", maxWidth: "400px", background: "#09090B", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", padding: "32px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ padding: "8px", background: "rgba(249,115,22,0.1)", color: "#f97316", borderRadius: "10px" }}><Shield size={20} /></div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Acesso Restrito</h3>
                </div>
                <button onClick={() => setShowAdminModal(false)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>Digite a senha de administrador para continuar.</p>
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <Lock size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#71717a" }} />
                <input
                  type="password" style={{ ...inpStyle, paddingLeft: "44px" }} placeholder="••••••••"
                  value={adminPassword} onChange={e => setAdminPassword(e.currentTarget.value)}
                />
              </div>
              <PrimaryBtn onClick={handleAdminAccess} style={{ width: "100%", padding: "14px", borderRadius: "12px", fontSize: "14px" }}>Acessar Painel</PrimaryBtn>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
