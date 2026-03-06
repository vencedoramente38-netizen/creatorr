import React from 'react';
import { motion } from 'motion/react';
import { useApp } from './AppContext';

const Icon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
  const icons: Record<string, React.ReactNode> = {
    fileText: <React.Fragment><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></React.Fragment>,
    copy: <React.Fragment><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></React.Fragment>,
    trash2: <React.Fragment><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></React.Fragment>,
    search: <React.Fragment><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></React.Fragment>,
    clock: <React.Fragment><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></React.Fragment>,
    sparkles: <React.Fragment><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></React.Fragment>,
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

const MyPrompts: React.FC = () => {
  const { addNotification } = useApp();

  const prompts = [
    { id: 1, title: 'Gancho Viral - Skincare', date: '23/02/2026', type: 'V03' },
    { id: 2, title: 'Review Unboxing - Tech', date: '22/02/2026', type: 'V03' },
    { id: 3, title: 'Storytelling - Moda', date: '20/02/2026', type: 'V02' },
  ];

  const handleCopy = () => {
    addNotification("Copiado!", "Prompt copiado para a área de transferência.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "80px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", mdDirection: "row" as any, gap: "16px", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.05em" }}>Meus Prompts</h1>
            <p style={{ color: "#a1a1aa", marginTop: "4px" }}>Histórico de todos os roteiros e prompts gerados pela IA.</p>
          </div>
          <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
            <Icon
              name="search"
              size={18}
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#71717a" }}
            />
            <input
              type="text"
              placeholder="Buscar nos meus prompts..."
              style={{
                width: "100%",
                paddingLeft: "40px",
                paddingRight: "16px",
                paddingTop: "10px",
                paddingBottom: "10px",
                backgroundColor: "#050505",
                border: "1px solid #27272a",
                borderRadius: "12px",
                outline: "none",
                color: "white",
                fontSize: "14px"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {prompts.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: "16px",
              borderRadius: "16px",
              backgroundColor: "#141414",
              border: "1px solid #27272a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyCenter: "center" }}>
                <div style={{ margin: "auto" }}>
                  <Icon name="fileText" size={24} />
                </div>
              </div>
              <div>
                <h3 style={{ fontWeight: "bold", color: "#e4e4e7" }}>{p.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Icon name="clock" size={10} /> {p.date}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: "bold", color: "#050505", backgroundColor: "#DEDEDE", paddingLeft: "8px", paddingRight: "8px", paddingTop: "2px", paddingBottom: "2px", borderRadius: "4px", textTransform: "uppercase" }}>
                    {p.type}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={handleCopy}
                style={{ padding: "8px", color: "#71717a", cursor: "pointer", backgroundColor: "transparent", border: "none", borderRadius: "8px", transition: "all 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#27272a", e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "#71717a")}
              >
                <Icon name="copy" size={18} />
              </button>
              <button
                style={{ padding: "8px", color: "#71717a", cursor: "pointer", backgroundColor: "transparent", border: "none", borderRadius: "8px", transition: "all 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)", e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "#71717a")}
              >
                <Icon name="trash2" size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{
        padding: "32px",
        borderRadius: "24px",
        backgroundColor: "rgba(20, 20, 20, 0.5)",
        border: "1px dashed #27272a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "16px"
      }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "#52525b" }}>
          <Icon name="sparkles" size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Gere mais prompts</h3>
          <p style={{ fontSize: "14px", color: "#71717a", maxWidth: "320px", marginTop: "4px" }}>Use o Creatoria para criar novos roteiros otimizados para viralizar no TikTok.</p>
        </div>
        <button style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "10px",
          paddingBottom: "10px",
          backgroundColor: "#DEDEDE",
          color: "#050505",
          fontWeight: "bold",
          borderRadius: "9999px",
          border: "none",
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.2s"
        }}>
          Ir para Creatoria
        </button>
      </div>
    </div>
  );
};

export default MyPrompts;
