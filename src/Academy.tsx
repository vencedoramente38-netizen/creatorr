import React from 'react';
import { motion } from 'motion/react';
import { HoverBorderGradient } from './components/ui/hover-border-gradient';

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
    const icons: Record<string, React.ReactNode> = {
        graduationCap: <path d="M21.42 10.922 12 4.19 2.58 10.922a.5.5 0 0 0 0 .815L12 18.473l9.42-6.736a.5.5 0 0 0 0-.815ZM12 21.613l-9.42-6.737a.5.5 0 0 1-.08-.815L4 12.871M20 12.871l1.5 1.054a.5.5 0 0 1-.08.815l-3.42 2.443" />,
        users: <React.Fragment><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></React.Fragment>,
        externalLink: <React.Fragment><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></React.Fragment>
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

export function Academy() {
    return (
        <div style={{
            padding: "16px",
            smPadding: "32px" as any,
            maxWidth: "1280px",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            backgroundColor: "#050505",
            minHeight: "100vh",
            color: "white"
        }}>
            <header style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ padding: "8px", backgroundColor: "rgba(222, 222, 222, 0.1)", borderRadius: "8px" }}>
                        <Icon name="graduationCap" size={24} style={{ color: "#DEDEDE" }} />
                    </div>
                    <h1 style={{ fontSize: "24px", smFontSize: "30px" as any, fontWeight: "bold" }}>Academy</h1>
                </div>
                <p style={{ color: "#71717a", maxWidth: "42rem" }}>
                    Aprenda as melhores estratégias para viralizar no TikTok e escalar seus resultados com o Creator Lab e Vencedoramente.
                </p>
            </header>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                mdGridTemplateColumns: "1fr 1fr" as any,
                gap: "24px",
                alignItems: "center"
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: "#141414",
                        border: "1px solid #27272a",
                        padding: "32px",
                        borderRadius: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px"
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "semibold" as any, display: "flex", alignItems: "center", gap: "8px" }}>
                            <Icon name="users" size={20} style={{ color: "#DEDEDE" }} />
                            Comunidade VIP
                        </h2>
                        <p style={{ color: "#71717a" }}>
                            Entre no nosso grupo exclusivo de alunos e receba suporte direto dos nossos especialistas.
                        </p>
                    </div>

                    <div style={{ paddingTop: "16px" }}>
                        <HoverBorderGradient
                            containerClassName="w-full"
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                paddingTop: "16px",
                                paddingBottom: "16px",
                                fontSize: "18px",
                                fontWeight: "medium" as any,
                                backgroundColor: "#DEDEDE",
                                color: "#050505",
                                border: "none",
                                borderRadius: "12px",
                                cursor: "pointer"
                            }}
                            onClick={() => window.open('https://chat.whatsapp.com/G82q1f2n7L576v6E4k9m3J', '_blank')}
                        >
                            <span>Entrar no Grupo WhatsApp</span>
                            <Icon name="externalLink" size={20} />
                        </HoverBorderGradient>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        position: "relative",
                        aspectRatio: "16/9",
                        borderRadius: "24px",
                        overflow: "hidden",
                        border: "1px solid #27272a"
                    }}
                >
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, black, transparent, transparent)",
                        zIndex: 10
                    }} />
                    <img
                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop"
                        alt="Academy Background"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.6
                        }}
                    />
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 20
                    }}>
                        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", padding: "24px" }}>
                            <span style={{ color: "#DEDEDE", fontWeight: "semibold" as any, trackingWider: "true" as any, textTransform: "uppercase", fontSize: "12px" }}>Em breve</span>
                            <h3 style={{ fontSize: "24px", fontWeight: "bold" }}>Cursos Exclusivos</h3>
                            <p style={{ color: "#71717a", fontSize: "14px" }}>Estamos preparando um conteúdo épico para você.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
