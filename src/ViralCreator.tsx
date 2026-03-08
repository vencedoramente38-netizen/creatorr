import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = [
    { id: 1, label: 'Produto' },
    { id: 2, label: 'Público' },
    { id: 3, label: 'Ângulo' },
    { id: 4, label: 'Gerar' },
];

const PUBLI_ALVO = ["Jovens", "Mães", "Universitários", "Geral"];
const ANGULOS_VENDA = ["Humor", "Problema/Solução", "Polêmico"];

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
            {children}
        </button>
    );
}

export function ViralCreator() {
    const [currentStep, setCurrentStep] = useState(1);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [extracted, setExtracted] = useState(false);
    const [formData, setFormData] = useState({
        productLink: '', targetAudience: '', angle: ''
    });

    const handleNext = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
    const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleExtract = async () => {
        if (!formData.productLink) return;
        setExtracting(true);
        await new Promise(r => setTimeout(r, 1500));
        setExtracting(false);
        setExtracted(true);
    };

    const handleGenerate = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 2000));
        setGenerating(false);
        setGenerated(true);
    };

    const cardStyle: React.CSSProperties = {
        background: "#09090B", border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
    };

    const chipBase: React.CSSProperties = {
        padding: "12px 20px", borderRadius: 12, border: "1px solid",
        fontSize: 14, fontWeight: "bold", cursor: "pointer", transition: "all 0.2s",
        fontFamily: "inherit",
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Prompt copiado!");
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={cardStyle}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 16 }}>Link do Produto</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <input
                                    type="text"
                                    placeholder="Cole o link do TikTok Shop aqui..."
                                    value={formData.productLink}
                                    onChange={e => setFormData({ ...formData, productLink: e.target.value })}
                                    style={{ width: "100%", padding: "16px", background: "#141414", border: "1px solid #27272a", borderRadius: 12, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                                />
                                <button
                                    onClick={handleExtract}
                                    disabled={extracting || !formData.productLink}
                                    style={{
                                        padding: "14px", background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                                        color: "white", fontWeight: "bold", cursor: extracting || !formData.productLink ? "not-allowed" : "pointer",
                                        transition: "all 0.2s", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px"
                                    }}
                                >
                                    {extracting ? "Extraindo Dados..." : "Extrair Dados"}
                                </button>
                                {extracted && (
                                    <div style={{ padding: "12px", background: "rgba(16,185,129,0.1)", color: "#10b981", borderRadius: 8, fontSize: 13, fontWeight: "bold", textAlign: "center" }}>
                                        ✅ Dados extraídos com sucesso!
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={cardStyle}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 16 }}>Público-Alvo</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {PUBLI_ALVO.map(aud => (
                                    <button key={aud} onClick={() => setFormData({ ...formData, targetAudience: aud })} style={{
                                        ...chipBase,
                                        background: formData.targetAudience === aud ? "rgba(222,222,222,0.1)" : "transparent",
                                        borderColor: formData.targetAudience === aud ? "#DEDEDE" : "#27272a",
                                        color: formData.targetAudience === aud ? "#DEDEDE" : "#a1a1aa",
                                    }}>
                                        {aud}
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
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: 16 }}>Ângulo de Venda</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                                {ANGULOS_VENDA.map(ang => (
                                    <button key={ang} onClick={() => setFormData({ ...formData, angle: ang })} style={{
                                        ...chipBase,
                                        background: formData.angle === ang ? "rgba(222,222,222,0.1)" : "transparent",
                                        borderColor: formData.angle === ang ? "#DEDEDE" : "#27272a",
                                        color: formData.angle === ang ? "#DEDEDE" : "#a1a1aa",
                                    }}>
                                        {ang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div style={cardStyle}>
                            {!generated ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: "20px 0" }}>
                                    <p style={{ fontSize: 14, color: "#a1a1aa", textAlign: "center" }}>Seus dados estão prontos. Clique abaixo para gerar a estrutura viral.</p>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        style={{
                                            width: "100%", padding: "20px", background: "#DEDEDE", color: "#050505",
                                            fontWeight: 900, fontSize: "18px", borderRadius: "16px", border: "none",
                                            cursor: generating ? "wait" : "pointer", textTransform: "uppercase",
                                            transition: "opacity 0.2s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                    >
                                        {generating ? "⏳ Gerando Estrutura..." : "Gerar Estrutura Viral"}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#10b981", textTransform: "uppercase", margin: 0 }}>Prompt Gerado com Sucesso</p>
                                        <button onClick={() => copyToClipboard(`Atue como um especialista em vídeos virais do TikTok.\nProduto: ${formData.productLink}\nPúblico-alvo: ${formData.targetAudience}\nÂngulo de venda: ${formData.angle}\n\nCrie um roteiro de 60 segundos altamente engajante focado na conversão para Tiktok Shop.`)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "white", fontSize: 12, cursor: "pointer" }}>
                                            Copiar
                                        </button>
                                    </div>
                                    <div style={{ background: "#141414", border: "1px solid #27272a", borderRadius: 12, padding: "16px", fontSize: 14, color: "#e4e4e7", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                                        <span style={{ color: "#a855f7", fontWeight: "bold" }}>Atue como um especialista em vídeos virais do TikTok.</span>{"\n"}
                                        <span style={{ color: "#71717a" }}>Produto:</span> {formData.productLink || "[Link]"}{"\n"}
                                        <span style={{ color: "#71717a" }}>Público-alvo:</span> {formData.targetAudience || "[Público]"}{"\n"}
                                        <span style={{ color: "#71717a" }}>Ângulo de venda:</span> {formData.angle || "[Ângulo]"}{"\n\n"}
                                        Crie um roteiro de 60 segundos altamente engajante focado na conversão para Tiktok Shop. O texto deve prender a atenção nos primeiros 3 segundos e conduzir para uma venda irresistível no final.
                                    </div>
                                </div>
                            )}
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
                <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px 0", letterSpacing: "-0.025em" }}>⚡ Viral Boost</h1>
                <p style={{ color: "#71717a", margin: 0, fontSize: 15 }}>Crie a estrutura do seu vídeo viral no TikTok em 4 passos</p>
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
                <button onClick={handleBack} disabled={currentStep === 1 || generated} style={{ padding: "14px 24px", background: "transparent", border: "1px solid #27272a", borderRadius: 12, color: currentStep === 1 ? "#3f3f46" : "#a1a1aa", cursor: currentStep === 1 ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={e => { if (currentStep > 1) e.currentTarget.style.color = "white" }} onMouseLeave={e => { if (currentStep > 1) e.currentTarget.style.color = "#a1a1aa" }}>
                    ← Voltar
                </button>
                {currentStep < 4 && (
                    <PrimaryBtn onClick={handleNext} style={{ padding: "14px 28px", fontSize: 14 }} disabled={currentStep === 1 && !extracted}>
                        Próximo →
                    </PrimaryBtn>
                )}
            </div>
        </div>
    );
}
