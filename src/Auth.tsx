import React, { useState } from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import { supabase } from './lib/supabase';

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
  const icons: Record<string, React.ReactNode> = {
    mail: <React.Fragment><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></React.Fragment>,
    lock: <React.Fragment><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></React.Fragment>,
    arrowRight: <React.Fragment><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></React.Fragment>,
    sparkles: <React.Fragment><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></React.Fragment>
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {icons[name] || null}
    </svg>
  );
};

const Auth: React.FC = () => {
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Tentando login para:', email);

    try {
      const authEmail = email === 'admin' ? 'admin@creatoria.com' : email;
      const authPassword = email === 'admin' ? 'admin321' : password;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });

      if (error) {
        addNotification("Erro no login", error.message);
      } else if (data.user) {
        addNotification("Bem-vindo!", "Login realizado com sucesso.");
      }
    } catch (err: any) {
      addNotification("Erro", "Ocorreu um erro ao tentar entrar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#050505"
    }}>
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>

      {/* Background Effects */}
      <div style={{ position: "absolute", top: "25%", left: "25%", width: "400px", height: "400px", background: "rgba(222, 222, 222, 0.05)", borderRadius: "50%", filter: "blur(120px)" }} />
      <div style={{ position: "absolute", bottom: "25%", right: "25%", width: "400px", height: "400px", background: "rgba(222, 222, 222, 0.05)", borderRadius: "50%", filter: "blur(120px)" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 10 }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src="https://i.postimg.cc/rwwB300w/image.jpg"
            alt="Creatoria Logo"
            style={{ width: "80px", height: "80px", objectFit: "contain", margin: "0 auto 16px", filter: "drop-shadow(0 0 15px rgba(222, 222, 222, 0.2))" }}
          />
          <h1 style={{ fontSize: "36px", fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.05em", textTransform: "uppercase", color: "#DEDEDE", margin: 0 }}>Creatoria</h1>
          <p style={{ color: "#71717a", marginTop: "8px", fontWeight: 500 }}>A plataforma definitiva para criadores.</p>
        </div>

        {/* Shine Border Wrapper */}
        <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            padding: "2px",
            background: "radial-gradient(transparent, transparent, #DEDEDE, #ffffff, #DEDEDE, transparent, transparent)",
            backgroundSize: "300% 300%",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "shine 4s infinite linear",
            pointerEvents: "none",
            zIndex: 1,
          }} />

          <div style={{
            position: "relative",
            zIndex: 2,
            background: "rgba(10, 10, 10, 0.95)",
            borderRadius: "14px",
            padding: "36px",
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
              <button
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderBottom: "2px solid #DEDEDE",
                  background: "none",
                  color: "white",
                  cursor: "default"
                }}
              >
                Entrar
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Email</label>
                <div style={{ position: "relative" }}>
                  <Icon name="mail" size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com ou admin"
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "white",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Senha</label>
                  <button type="button" style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Esqueceu a senha?</button>
                </div>
                <div style={{ position: "relative" }}>
                  <Icon name="lock" size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "white",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#DEDEDE",
                  color: "#050505",
                  fontWeight: 900,
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "16px",
                  boxShadow: "0 10px 20px rgba(222, 222, 222, 0.1)",
                  transition: "transform 0.2s"
                }}
              >
                {loading ? "Processando..." : "Entrar"}
                {!loading && <Icon name="arrowRight" size={18} />}
              </button>
            </form>

            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <p style={{ fontSize: "12px", color: "#71717a" }}>
                Ao continuar, você concorda com nossos <button style={{ background: "none", border: "none", padding: 0, color: "#d4d4d8", cursor: "pointer" }}>Termos de Uso</button> e <button style={{ background: "none", border: "none", padding: 0, color: "#d4d4d8", cursor: "pointer" }}>Política de Privacidade</button>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
