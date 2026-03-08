import React, { useState } from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import { STOR, sbGet, sbPost, sbPatch } from './lib/supabase';
import { RainbowButton } from './App';

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
  const icons: Record<string, React.ReactNode> = {
    mail: <React.Fragment><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></React.Fragment>,
    lock: <React.Fragment><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></React.Fragment>,
    arrowRight: <React.Fragment><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></React.Fragment>,
    sparkles: <React.Fragment><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></React.Fragment>,
    user: <React.Fragment><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></React.Fragment>,
    key: <React.Fragment><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" /><path d="m21 2-9.6 9.6" /><circle cx="7.5" cy="15.5" r="5.5" /></React.Fragment>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>{icons[name] || null}</svg>;
};

interface AuthProps {
  authTab: string;
  setAuthTab: (tab: string) => void;
  expiredMsg: string;
  onLoginSuccess: (session: any) => void;
}

const Auth: React.FC<AuthProps> = ({ authTab, setAuthTab, expiredMsg, onLoginSuccess }) => {
  const { addNotification } = useApp();
  const [authLoading, setAuthLoading] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regKey, setRegKey] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError("");
    try {
      if (loginEmail === "admin" && loginPassword === "admin321") {
        const adminSession = { id: "admin", name: "Administrador", email: "admin@creatoria.com", plan_type: "lifetime" };
        await STOR.s("session", adminSession);
        onLoginSuccess(adminSession);
        return;
      }

      const users = await sbGet("users", `email=eq.${encodeURIComponent(loginEmail)}&select=*`);
      if (!users.length) { setLoginError("Email não encontrado."); setAuthLoading(false); return; }
      const user = users[0];
      if (user.password !== loginPassword) { setLoginError("Senha incorreta."); setAuthLoading(false); return; }
      if (user.plan_type === "monthly" && user.expires_at) {
        if (new Date(user.expires_at) < new Date()) { setLoginError("Seu plano expirou."); setAuthLoading(false); return; }
      }
      const session = {
        id: user.id, name: user.name, email: user.email,
        plan_type: user.plan_type, expires_at: user.expires_at,
        activated_at: user.activated_at,
      };
      await STOR.s("session", session);
      onLoginSuccess(session);
    } catch {
      setLoginError("Erro ao conectar. Tente novamente.");
    }
    setAuthLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setRegisterError("");

    if (!regName || !regEmail || !regPassword || !regConfirm || !regKey) { setRegisterError("Preencha todos os campos."); setAuthLoading(false); return; }
    if (regPassword !== regConfirm) { setRegisterError("As senhas não coincidem."); setAuthLoading(false); return; }
    if (regPassword.length < 6) { setRegisterError("A senha deve ter pelo menos 6 caracteres."); setAuthLoading(false); return; }

    const keyFormatted = regKey.trim().toUpperCase();

    try {
      const existing = await sbGet("users", `email=eq.${encodeURIComponent(regEmail)}&select=id`);
      if (existing.length) { setRegisterError("Este email já está cadastrado."); setAuthLoading(false); return; }

      const keys = await sbGet("keys", `key=eq.${keyFormatted}&select=*`);
      if (!keys.length) { setRegisterError("Chave de ativação inválida."); setAuthLoading(false); return; }

      const keyData = keys[0];
      if (keyData.used) { setRegisterError("Esta chave já foi utilizada."); setAuthLoading(false); return; }
      if (keyData.type === "monthly" && keyData.expires_at) {
        if (new Date(keyData.expires_at) < new Date()) { setRegisterError("Esta chave expirou."); setAuthLoading(false); return; }
      }

      const now = new Date();
      const userExpiresAt = keyData.type === "monthly"
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const newUsers = await sbPost("users", {
        name: regName, email: regEmail, password: regPassword,
        key_used: keyFormatted, plan_type: keyData.type,
        activated_at: now.toISOString(), expires_at: userExpiresAt,
      });

      await sbPatch("keys", `key=eq.${keyFormatted}`, {
        used: true, used_at: now.toISOString(), used_by: regEmail,
      });

      const userData = Array.isArray(newUsers) ? newUsers[0] : newUsers;
      const session = {
        id: userData.id, name: userData.name, email: userData.email,
        plan_type: userData.plan_type, expires_at: userData.expires_at,
        activated_at: userData.activated_at,
      };
      await STOR.s("session", session);
      addNotification("Bem-vindo!", "Sua conta foi criada com sucesso.");
      onLoginSuccess(session);
    } catch {
      setRegisterError("Erro ao criar conta. Tente novamente.");
    }
    setAuthLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
    padding: "13px 16px 13px 40px", color: "white", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", marginBottom: 12,
  };

  const activeTabStyle: React.CSSProperties = { background: "#DEDEDE", color: "#050505", fontWeight: 700, padding: "9px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, flex: 1 };
  const inactiveTabStyle: React.CSSProperties = { background: "transparent", color: "#64748b", fontWeight: 400, padding: "9px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, flex: 1 };

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden", backgroundColor: "#050505" }}>
      <style>{`
        @keyframes shine { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }
      `}</style>

      <div style={{ position: "absolute", top: "25%", left: "25%", width: "400px", height: "400px", background: "rgba(222, 222, 222, 0.05)", borderRadius: "50%", filter: "blur(120px)" }} />
      <div style={{ position: "absolute", bottom: "25%", right: "25%", width: "400px", height: "400px", background: "rgba(222, 222, 222, 0.05)", borderRadius: "50%", filter: "blur(120px)" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
          <h1 style={{ fontSize: "36px", fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.05em", textTransform: "uppercase", color: "#DEDEDE", margin: 0 }}>Creatoria</h1>
          <p style={{ color: "#71717a", marginTop: "8px", fontWeight: 500 }}>A plataforma definitiva para criadores.</p>
        </div>

        {expiredMsg && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "16px", borderRadius: "12px", marginBottom: "24px", fontSize: "14px", fontWeight: 500, textAlign: "center" }}>
            {expiredMsg}
          </div>
        )}

        <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", padding: "2px", background: "radial-gradient(transparent, transparent, #DEDEDE, #ffffff, #DEDEDE, transparent, transparent)", backgroundSize: "300% 300%", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", animation: "shine 4s infinite linear", pointerEvents: "none", zIndex: 1 }} />

          <div style={{ position: "relative", zIndex: 2, background: "rgba(9, 9, 11, 0.95)", borderRadius: "14px", padding: "36px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "32px", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "10px" }}>
              <button onClick={() => setAuthTab("login")} style={authTab === "login" ? activeTabStyle : inactiveTabStyle}>Entrar</button>
              <button onClick={() => setAuthTab("register")} style={authTab === "register" ? activeTabStyle : inactiveTabStyle}>Criar Conta</button>
            </div>

            {authTab === "login" ? (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative" }}>
                  <Icon name="mail" size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "#52525b" }} />
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" style={inputStyle} />
                </div>
                <div style={{ position: "relative" }}>
                  <Icon name="lock" size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "#52525b" }} />
                  <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Senha" style={inputStyle} />
                </div>
                {loginError && <p style={{ color: "#ef4444", fontSize: "14px", margin: "0 0 12px", fontWeight: 500 }}>{loginError}</p>}
                <RainbowButton style={{ width: "100%", marginTop: "8px" }} disabled={authLoading}>
                  {authLoading ? "Entrando..." : "Entrar"}
                </RainbowButton>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative" }}>
                  <Icon name="user" size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "#52525b" }} />
                  <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Nome completo" style={inputStyle} />
                </div>
                <div style={{ position: "relative" }}>
                  <Icon name="mail" size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "#52525b" }} />
                  <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email" style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Icon name="lock" size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "#52525b" }} />
                    <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Senha" style={inputStyle} />
                  </div>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Icon name="lock" size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "#52525b" }} />
                    <input type="password" required value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} placeholder="Confirmar" style={inputStyle} />
                  </div>
                </div>
                <div style={{ position: "relative", marginTop: "8px" }}>
                  <Icon name="key" size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "#52525b" }} />
                  <input type="text" required value={regKey} onChange={(e) => setRegKey(e.target.value)} placeholder="CREATOR-MES-XXXX ou CREATOR-VIP-XXXX" style={{ ...inputStyle, textTransform: "uppercase", fontFamily: "monospace", letterSpacing: 1 }} />
                </div>

                <div style={{ display: "flex", gap: "12px", marginBottom: "16px", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>Mensal · 30 dias</span>
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>Vitalício · Para sempre</span>
                </div>

                {registerError && <p style={{ color: "#ef4444", fontSize: "14px", margin: "0 0 12px", fontWeight: 500, textAlign: "center" }}>{registerError}</p>}

                <RainbowButton style={{ width: "100%", marginTop: "8px" }} disabled={authLoading}>
                  {authLoading ? "Criando..." : "Criar Conta"}
                </RainbowButton>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default Auth;
