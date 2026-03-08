import React from 'react';
import { motion } from 'motion/react';

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
    const icons: Record<string, React.ReactNode> = {
        graduationCap: <path d="M21.42 10.922 12 4.19 2.58 10.922a.5.5 0 0 0 0 .815L12 18.473l9.42-6.736a.5.5 0 0 0 0-.815ZM12 21.613l-9.42-6.737a.5.5 0 0 1-.08-.815L4 12.871M20 12.871l1.5 1.054a.5.5 0 0 1-.08.815l-3.42 2.443" />,
        users: <React.Fragment><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></React.Fragment>,
        video: <React.Fragment><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></React.Fragment>,
        trendingUp: <React.Fragment><path d="m22 7-8.5 8.5-5-5L2 17" /><polyline points="16 7 22 7 22 13" /></React.Fragment>,
        zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
        messageCircle: <React.Fragment><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></React.Fragment>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            {icons[name] || null}
        </svg>
    );
};

export function Academy() {
    const categories = [
        { title: "Criação de Conteúdo", desc: "Técnicas avançadas para criar vídeos virais", icon: "video", color: "#DEDEDE" },
        { title: "Monetização", desc: "Estratégias para maximizar sua renda no TikTok Shop", icon: "trendingUp", color: "#a855f7" },
        { title: "Crescimento", desc: "Como crescer seu canal de forma orgânica e rápida", icon: "zap", color: "#06b6d4" },
        { title: "IA no Marketing", desc: "Use IA para criar conteúdo 10x mais rápido", icon: "messageCircle", color: "#10b981" },
    ];

    return (
        <div style={{ padding: "16px", maxWidth: "1280px", marginLeft: "auto", marginRight: "auto", display: "flex", flexDirection: "column", gap: "32px", backgroundColor: "#050505", minHeight: "100vh", color: "white" }}>
            <header style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ padding: "8px", backgroundColor: "rgba(222, 222, 222, 0.1)", borderRadius: "8px" }}>
                        <Icon name="graduationCap" size={24} style={{ color: "#DEDEDE" }} />
                    </div>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Academy</h1>
                </div>
                <p style={{ color: "#71717a", maxWidth: "42rem" }}>
                    Aprenda as melhores estratégias para viralizar no TikTok e escalar seus resultados com o Creator Lab e Vencedoramente.
                </p>
            </header>

            {/* WhatsApp Group Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ backgroundColor: "#141414", border: "1px solid #27272a", padding: "40px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", textAlign: "center", maxWidth: "600px", margin: "0 auto", width: "100%" }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(37,211,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                        <Icon name="users" size={28} style={{ color: "#25d366" }} />
                    </div>
                    <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Comunidade VIP</h2>
                    <p style={{ color: "#71717a", maxWidth: "400px" }}>
                        Entre no nosso grupo exclusivo de alunos e receba suporte direto dos nossos especialistas.
                    </p>
                </div>

                <a
                    href="https://chat.whatsapp.com/Cly4OeeFNW4C2ezsNiMrc9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rainbow-btn"
                    style={{
                        display: "inline-block",
                        padding: "13px 32px",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 15,
                        textDecoration: "none",
                        cursor: "pointer",
                    }}
                >
                    Entrar no Grupo Academy
                </a>
            </motion.div>

            {/* Category Cards */}
            <div>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Categorias Disponíveis</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                background: "#111111",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderTop: `3px solid ${cat.color}`,
                                borderRadius: "16px",
                                padding: "24px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                cursor: "pointer",
                                transition: "box-shadow 0.2s",
                            }}
                            onMouseEnter={(e: any) => e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)"}
                            onMouseLeave={(e: any) => e.currentTarget.style.boxShadow = "none"}
                        >
                            <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", width: "fit-content" }}>
                                <Icon name={cat.icon} size={22} style={{ color: cat.color }} />
                            </div>
                            <div>
                                <p style={{ fontWeight: "bold", fontSize: "15px", margin: "0 0 4px 0" }}>{cat.title}</p>
                                <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>{cat.desc}</p>
                            </div>
                            <span style={{ fontSize: "11px", color: "#555", fontWeight: "bold", textTransform: "uppercase" }}>Em breve →</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
