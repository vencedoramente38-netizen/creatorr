import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = [
    { id: 1, label: 'Nicho' },
    { id: 2, label: 'Estilo' },
    { id: 3, label: 'Prompts AI' },
    { id: 4, label: 'Review' },
];

const NICHES = ["Curiosidades", "Finanças/Investimentos", "Saúde/Bem-estar", "Tecnologia", "Entretenimento", "Motivação", "Educação", "Estilo de Vida", "Outros"];
const STYLES = ["Moderno / High Tech", "Minimalista", "Vibrante / Dinâmico", "Sombrio / Misterioso", "Estético / Calmo", "Infantil / Lúdico"];
const LANGUAGES = ["Português", "Inglês", "Espanhol"];

// Re-export helper from App (or define inline since App exports it)
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

function PrimaryBtn({ onClick, children, style = {}, disabled }: {
    onClick?: () => void; children: React.ReactNode; style?: React.CSSProperties; disabled?: boolean;
}) {
    return (
        <button onClick={onClick} disabled={disabled} className="neon-btn" style={{
            position: "relative", overflow: "hidden",
            background: disabled ? "#141414" : "#DEDEDE",
            color: disabled ? "#71717a" : "#050505",
            border: "none", borderRadius: "12px",
            fontWeight: "bold", cursor: disabled ? "not-allowed" : "pointer",
            fontFamily: "inherit", ...style,
        }}>
            <span className="neon-top" style={{ position: "absolute", height: 1, opacity: 0, top: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)", transition: "opacity 0.5s ease", pointerEvents: "none" }} />
            <span style={{ position: "absolute", height: 1, opacity: 0.3, bottom: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)", pointerEvents: "none" }} />
            {children}
        </button>
    );
}

export function ViralCreator() {
    const [currentStep, setCurrentStep] = useState(1);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [formData, setFormData] = useState({
        niche: '', style: '', targetAudience: '', language: 'Português',
    });

    const handleNext = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
    const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleGenerate = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 2000));
        setGenerating(false);
        setGenerated(true);
    };

    const cardStyle: React.CSSProperties = {
        background: "#111111", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: 24,
    };

    const chipBase: React.CSSProperties = {
        padding: "10px 16px", borderRadius: 12, border: "1px solid",
        fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
        fontFamily: "inherit",
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={cardStyle}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 16 }}>Selecione seu Nicho</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                                {NICHES.map(niche => (
                                    <button key={niche} onClick={() => setFormData({ ...formData, niche })} style={{
                                        ...chipBase,
                                        background: formData.niche === niche ? "rgba(222,222,222,0.1)" : "transparent",
                                        borderColor: formData.niche === niche ? "#DEDEDE" : "#27272a",
                                        color: formData.niche === niche ? "#DEDEDE" : "#a1a1aa",
                                    }}>
                                        {niche}
                                    </button>
                                ))}
                            </div>

                            <div style={{ marginTop: 24 }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 12 }}>Público-alvo</p>
                                <textarea
                                    value={formData.targetAudience}
                                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                                    placeholder="Descreva seu público-alvo (ex: jovens de 18-25 anos interessados em empreendedorismo)"
                                    style={{ width: "100%", minHeight: 80, background: "#050505", border: "1px solid #27272a", borderRadius: 10, color: "white", padding: "12px", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={cardStyle}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 16 }}>Estilo Visual</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 24 }}>
                                {STYLES.map(s => (
                                    <button key={s} onClick={() => setFormData({ ...formData, style: s })} style={{
                                        ...chipBase,
                                        background: formData.style === s ? "rgba(222,222,222,0.1)" : "transparent",
                                        borderColor: formData.style === s ? "#DEDEDE" : "#27272a",
                                        color: formData.style === s ? "#DEDEDE" : "#a1a1aa",
                                    }}>
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 12 }}>Idioma</p>
                            <div style={{ display: "flex", gap: 10 }}>
                                {LANGUAGES.map(lang => (
                                    <button key={lang} onClick={() => setFormData({ ...formData, language: lang })} style={{
                                        ...chipBase,
                                        background: formData.language === lang ? "rgba(222,222,222,0.1)" : "transparent",
                                        borderColor: formData.language === lang ? "#DEDEDE" : "#27272a",
                                        color: formData.language === lang ? "#DEDEDE" : "#a1a1aa",
                                    }}>
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={cardStyle}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 16 }}>Prompts Gerados por IA</p>
                            {['Hook viral de 3 segundos', 'Roteiro completo para 60s', 'Chamada para ação poderosa'].map((prompt, i) => (
                                <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                                    <p style={{ fontSize: 11, color: "#71717a", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px 0" }}>Prompt {i + 1}</p>
                                    <p style={{ fontSize: 14, color: "#a1a1aa", margin: 0, lineHeight: 1.6 }}>
                                        {prompt}: {formData.niche || "seu nicho"} para {formData.targetAudience || "seu público"} — estilo {formData.style || "único"}.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={cardStyle}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 16 }}>Revisão Final</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                                {[
                                    { label: "Nicho", value: formData.niche || "—" },
                                    { label: "Estilo", value: formData.style || "—" },
                                    { label: "Idioma", value: formData.language },
                                    { label: "Público", value: formData.targetAudience || "—" },
                                ].map(item => (
                                    <div key={item.label} style={{ background: "#0a0a0a", borderRadius: 10, padding: "12px 14px", border: "1px solid #1a1a1a" }}>
                                        <p style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px 0" }}>{item.label}</p>
                                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {generated && (
                                <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, color: "#10b981", fontSize: 14, fontWeight: 600, textAlign: "center" }}>
                                    ✅ Conteúdo viral gerado com sucesso!
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <RainbowButton onClick={handleGenerate} disabled={generating} style={{ minWidth: 220 }}>
                                    {generating ? "⏳ Gerando..." : generated ? "🔄 Gerar Novamente" : "🚀 Gerar Viral!"}
                                </RainbowButton>
                            </div>
                        </div>
                    </motion.div>
                );

            default: return null;
        }
    };

    return (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px", color: "white" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px 0" }}>⚡ Viral Creator</h1>
                <p style={{ color: "#71717a", margin: 0, fontSize: 15 }}>Crie conteúdo viral com o poder da IA em 4 passos simples</p>
            </div>

            {/* Stepper */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
                {STEPS.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                border: "2px solid", fontSize: 13, fontWeight: 700,
                                borderColor: currentStep === step.id ? "#DEDEDE" : currentStep > step.id ? "#10b981" : "#27272a",
                                background: currentStep === step.id ? "rgba(222,222,222,0.12)" : currentStep > step.id ? "rgba(16,185,129,0.12)" : "transparent",
                                color: currentStep === step.id ? "#DEDEDE" : currentStep > step.id ? "#10b981" : "#52525b",
                            }}>
                                {currentStep > step.id ? "✓" : step.id}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: currentStep === step.id ? "#DEDEDE" : "#52525b" }}>{step.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ width: 32, height: 1, background: currentStep > step.id ? "#10b981" : "#27272a", marginBottom: 20, flexShrink: 0 }} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                {renderStep()}
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
                <button onClick={handleBack} disabled={currentStep === 1} style={{ padding: "14px 24px", background: "transparent", border: "1px solid #27272a", borderRadius: 12, color: currentStep === 1 ? "#3f3f46" : "#a1a1aa", cursor: currentStep === 1 ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}>
                    ← Voltar
                </button>
                {currentStep < 4 && (
                    <PrimaryBtn onClick={handleNext} style={{ padding: "14px 28px", fontSize: 14 }}>
                        Próximo →
                    </PrimaryBtn>
                )}
            </div>
        </div>
    );
}
