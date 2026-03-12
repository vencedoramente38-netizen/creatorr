import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './AppContext';
import { Rocket, Target, Zap, FileText, ChevronRight, ChevronLeft, Copy, Check, ExternalLink, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

// Shared Components
const StepCard = ({ children, active, glow }: { children: React.ReactNode, active?: boolean, glow?: boolean }) => (
    <div style={{
        background: "#09090B",
        borderRadius: "24px",
        border: `1px solid ${active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
        padding: "32px",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: glow ? "0 0 30px rgba(168, 85, 247, 0.15)" : "none",
        transform: active ? "scale(1.02)" : "scale(1)"
    }}>
        {children}
    </div>
);

const SectionTitle = ({ step, title }: { step: number; title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{
            width: "28px", height: "28px", borderRadius: "50%", background: "white", color: "black",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800
        }}>
            {step}
        </div>
        <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>{title}</h3>
    </div>
);

const OptionCard = ({ label, selected, onClick, icon: IconComp }: any) => (
    <button
        onClick={onClick}
        style={{
            flex: 1, padding: "20px", borderRadius: "16px", border: `1px solid ${selected ? "white" : "rgba(255,255,255,0.06)"}`,
            background: selected ? "rgba(255,255,255,0.05)" : "transparent", cursor: "pointer", transition: "all 0.2s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", color: selected ? "white" : "#71717a"
        }}
    >
        <IconComp size={24} color={selected ? "white" : "#71717a"} />
        <span style={{ fontSize: "13px", fontWeight: 700 }}>{label}</span>
    </button>
);

const RainbowButton = ({ onClick, children, disabled, style = {} }: any) => (
    <button
        onClick={onClick} disabled={disabled} className="rainbow-btn"
        style={{ padding: "16px 32px", fontSize: "16px", fontWeight: 800, minWidth: "200px", borderRadius: "14px", cursor: "pointer", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", ...style }}
    >
        {children}
    </button>
);

export default function ViralCreator() {
    const { addNotification } = useApp();
    const [step, setStep] = useState(1);
    const [isViralMode, setIsViralMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<any>(null);

    // Form State
    const [category, setCategory] = useState('Moda & Acessórios');
    const [objeto, setObjeto] = useState('');
    const [style, setStyle] = useState('POV / Relatável');
    const [mainMessage, setMainMessage] = useState('');
    const [hook, setHook] = useState('');
    const [cta, setCta] = useState('');
    const [restrictions, setRestrictions] = useState('');
    const [duration, setDuration] = useState('30s');

    const categories = [
        { name: 'Moda & Acessórios', icon: Star },
        { name: 'Casa & Cozinha', icon: Target },
        { name: 'Beleza & Skincare', icon: Zap },
        { name: 'Gadgets Tech', icon: Rocket }
    ];

    const suggestions: Record<string, string[]> = {
        'Moda & Acessórios': ['Relógio Luxo', 'Óculos Escuros', 'Bolsa Couro', 'Corrente Banhada'],
        'Casa & Cozinha': ['Mixer Portátil', 'Organizador Acrílico', 'Fritadeira Airfryer', 'Garrafa Térmica'],
        'Beleza & Skincare': ['Sérum Facial', 'Escova Secadora', 'Kit de Maquiagem', 'Creme Anti-idade'],
        'Gadgets Tech': ['Fone Bluetooth', 'Smartwatch', 'Protetor de Cabo', 'Suporte Celular']
    };

    const handleGenerate = () => {
        setLoading(true);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 15;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setLoading(false);
                setResult({
                    script: `[CENA 1: 0-3s]\nFundo dinâmico com o ${objeto}. Narração: "Você não vai acreditar que esse ${objeto} custa tão pouco..." \n\n[CENA 2: 3-10s]\nDemonstração do uso real. Legenda: "O segredo que os gringos usam."\n\n[CENA 3: 10-25s]\nClose nos detalhes premium. Narração: "${mainMessage}. Alta qualidade e design exclusivo."\n\n[FINAL: 25-30s]\nCTA clara: "${cta}". Link na Bio!`,
                    hashtags: ['#tiktokmadebuyit', '#achadinhos', '#viral', '#tiktokshop', '#creator']
                });
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ffffff', '#10b981', '#f97316'] });
                addNotification("Viral Gerado!", "Seu conteúdo está pronto para bombar.");
            }
            setProgress(p);
        }, 400);
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const inpStyle = {
        width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" as any
    };

    if (result) {
        return (
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#09090B", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)", padding: "40px" }}>
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <Check size={32} />
                        </div>
                        <h2 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 8px 0" }}>Seu Viral está pronto!</h2>
                        <p style={{ color: "#71717a" }}>Use o roteiro abaixo e as hashtags para maximizar o alcance.</p>
                    </div>

                    <div style={{ marginBottom: "32px" }}>
                        <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 800, textTransform: "uppercase", marginBottom: "12px" }}>Roteiro Sugerido</label>
                        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.06)", whiteSpace: "pre-wrap", color: "#e4e4e7", fontSize: "15px", lineHeight: 1.6 }}>
                            {result.script}
                        </div>
                    </div>

                    <div style={{ marginBottom: "40px" }}>
                        <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 800, textTransform: "uppercase", marginBottom: "12px" }}>Hashtags Virais</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {result.hashtags.map((h: string) => (
                                <span key={h} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", fontSize: "13px", fontWeight: 600, color: "white" }}>{h}</span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px" }}>
                        <button
                            onClick={() => { navigator.clipboard.writeText(result.script); addNotification("Copiado!", "Roteiro copiado."); }}
                            style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "white", color: "black", fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                        >
                            <Copy size={20} /> Copiar Roteiro
                        </button>
                        <button
                            style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", color: "white", fontWeight: 800, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                        >
                            Abrir Flow VEO3 <ExternalLink size={20} />
                        </button>
                    </div>
                    <button onClick={() => setResult(null)} style={{ width: "100%", marginTop: "20px", background: "none", border: "none", color: "#71717a", fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}>Criar outro viral</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
            <header style={{ marginBottom: "48px", textAlign: "center" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "8px", letterSpacing: "-0.01em" }}>Viral Boost</h1>
                <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 24px 0" }}>Crie prompts virais e bombar no tiktok.</p>

                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "12px 24px", background: "rgba(255,255,255,0.03)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: isViralMode ? "white" : "#71717a" }}>Ative o modo viral</span>
                    <button
                        onClick={() => setIsViralMode(!isViralMode)}
                        style={{
                            width: "40px", height: "20px", borderRadius: "20px", background: isViralMode ? "#a855f7" : "#3f3f46",
                            position: "relative", cursor: "pointer", border: "none"
                        }}
                    >
                        <div style={{ width: "14px", height: "14px", background: "white", borderRadius: "50%", position: "absolute", top: "3px", left: isViralMode ? "23px" : "3px", transition: "all 0.2s" }} />
                    </button>
                </div>
            </header>

            <div style={{ marginBottom: "80px" }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <StepCard active glow={isViralMode}>
                                <SectionTitle step={1} title="Qual o objeto?" />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                                    {categories.map(cat => (
                                        <OptionCard key={cat.name} label={cat.name} icon={cat.icon} selected={category === cat.name} onClick={() => setCategory(cat.name)} />
                                    ))}
                                </div>
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "12px" }}>Sugestões Populares</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {suggestions[category]?.map(s => (
                                            <button
                                                key={s} onClick={() => setObjeto(s)}
                                                style={{
                                                    padding: "8px 16px", borderRadius: "100px", background: objeto === s ? "white" : "rgba(255,255,255,0.03)",
                                                    color: objeto === s ? "black" : "#71717a", fontSize: "13px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer"
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>Personalizado</label>
                                    <input style={inpStyle} placeholder="Nome do produto ou objeto..." value={objeto} onChange={e => setObjeto(e.currentTarget.value)} />
                                </div>
                            </StepCard>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <StepCard active glow={isViralMode}>
                                <SectionTitle step={2} title="Escolha o Estilo" />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    {['POV / Relatável', 'Unboxing Review', 'Storytelling', 'Lifestyle / Estético'].map(s => (
                                        <button
                                            key={s} onClick={() => setStyle(s)}
                                            style={{
                                                padding: "24px", borderRadius: "16px", background: style === s ? "rgba(255,255,255,0.05)" : "transparent",
                                                border: `1px solid ${style === s ? "white" : "rgba(255,255,255,0.06)"}`, color: style === s ? "white" : "#71717a",
                                                cursor: "pointer", textAlign: "center", fontSize: "14px", fontWeight: 700
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </StepCard>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <StepCard active glow={isViralMode}>
                                <SectionTitle step={3} title="Conteúdo & Detalhes" />
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>Mensagem principal</label>
                                        <textarea style={{ ...inpStyle, height: "100px", resize: "none" }} placeholder="O que torna este item indispensável?" value={mainMessage} onChange={e => setMainMessage(e.currentTarget.value)} />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>Hook (gancho)</label>
                                            <input style={inpStyle} placeholder="Ex: Você precisa ver isso..." value={hook} onChange={e => setHook(e.currentTarget.value)} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>CTA</label>
                                            <input style={inpStyle} placeholder="Ex: Link na Bio!" value={cta} onChange={e => setCta(e.currentTarget.value)} />
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>Restrições</label>
                                            <input style={inpStyle} placeholder="Ex: Sem palavrões..." value={restrictions} onChange={e => setRestrictions(e.currentTarget.value)} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", color: "#71717a", fontWeight: 600, marginBottom: "8px" }}>Duração alvo</label>
                                            <select style={inpStyle} value={duration} onChange={e => setDuration(e.currentTarget.value)}>
                                                <option value="15s">15s</option>
                                                <option value="30s">30s</option>
                                                <option value="60s">60s</option>
                                                <option value="90s">90s</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </StepCard>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <StepCard active glow={isViralMode}>
                                <SectionTitle step={4} title="Revisão Final" />
                                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#71717a", fontSize: "13px" }}>Objeto:</span>
                                        <span style={{ fontWeight: 700 }}>{objeto} ({category})</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#71717a", fontSize: "13px" }}>Estilo:</span>
                                        <span style={{ fontWeight: 700 }}>{style}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#71717a", fontSize: "13px" }}>Hook:</span>
                                        <span style={{ fontWeight: 700 }}>{hook || 'Padrão'}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#71717a", fontSize: "13px" }}>Duração:</span>
                                        <span style={{ fontWeight: 700 }}>{duration}</span>
                                    </div>
                                    <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#a855f7", fontWeight: 700, fontSize: "13px", cursor: "pointer", alignSelf: "flex-end" }}>Editar tudo</button>
                                </div>
                                <div style={{ marginTop: "32px" }}>
                                    <RainbowButton onClick={handleGenerate} style={{ width: "100%" }}>
                                        Gerar viral <ArrowRight size={18} />
                                    </RainbowButton>
                                </div>
                            </StepCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
                    {step > 1 && (
                        <button onClick={prevStep} style={{ background: "none", border: "none", color: "white", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, cursor: "pointer" }}>
                            <ChevronLeft size={20} /> Voltar
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < 4 && (
                        <button onClick={nextStep} style={{ padding: "12px 24px", borderRadius: "12px", background: "white", color: "black", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                            Próximo <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            {loading && (
                <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ marginBottom: "24px", color: "#a855f7" }}>
                        <Zap size={48} fill="currentColor" />
                    </motion.div>
                    <div style={{ width: "240px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
                        <motion.div style={{ height: "100%", background: "linear-gradient(90deg, #a855f7, #ec4899)", width: `${progress}%` }} />
                    </div>
                    <p style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Criando Script Viral... {Math.round(progress)}%</p>
                    <p style={{ color: "#71717a", fontSize: "14px", marginTop: "8px" }}>Isso pode levar alguns segundos.</p>
                </div>
            )}
        </div>
    );
}
