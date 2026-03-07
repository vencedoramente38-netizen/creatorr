import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
    { id: 1, label: 'Nicho' },
    { id: 2, label: 'Estilo' },
    { id: 3, label: 'Prompts AI' },
    { id: 4, label: 'Review' },
];

const NICHES = [
    "Curiosidades",
    "Finanças/Investimentos",
    "Saúde/Bem-estar",
    "Tecnologia",
    "Entretenimento",
    "Motivação",
    "Educação",
    "Estilo de Vida",
    "Outros"
];

const STYLES = [
    "Moderno / High Tech",
    "Minimalista",
    "Vibrante / Dinâmico",
    "Sombrio / Misterioso",
    "Estético / Calmo",
    "Infantil / Lúdico"
];

const Icon = ({ name, size = 20 }: { name: string; size?: number }) => {
    const icons: Record<string, React.ReactNode> = {
        rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
        sparkles: <><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /></>,
        wand: <><line x1="18" y1="2" x2="22" y2="6" /><line x1="2" y1="22" x2="16" y2="8" /></>,
        check: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
        palette: <><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.707-.484 2.155-1.204a3.303 3.303 0 0 0-.155-3.796 3.303 3.303 0 0 1 2.5-5.5h2.5c1.1 0 2-.9 2-2a6 6 0 0 0-6-6z" /></>,
        target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
        loader: <><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></>,
        copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
        external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icons[name] || null}
        </svg>
    );
};

export function ViralCreator() {
    const [currentStep, setCurrentStep] = useState(1);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [formData, setFormData] = useState({
        niche: '',
        style: '',
        targetAudience: '',
        language: 'Português',
    });

    const handleNext = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
    const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setGenerated(true);
            handleNext();
        }, 3000);
    };

    const cardBase: React.CSSProperties = {
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #27272a",
        backgroundColor: "transparent",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s",
        cursor: "pointer",
        textAlign: "left" as const,
        color: "white",
        fontFamily: "inherit",
    };

    const cardActive: React.CSSProperties = {
        ...cardBase,
        backgroundColor: "rgba(222,222,222,0.07)",
        border: "1px solid #DEDEDE",
        boxShadow: "0 0 12px rgba(222,222,222,0.1)",
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                                Selecione seu Nicho
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                                {NICHES.map((niche) => (
                                    <button key={niche} onClick={() => setFormData({ ...formData, niche })}
                                        style={formData.niche === niche ? cardActive : cardBase}>
                                        {niche}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                                Público Alvo
                            </label>
                            <input
                                type="text"
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                placeholder="Ex: Jovens interessados em investimento"
                                style={{ width: "100%", padding: "14px 16px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid #27272a", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                            />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                                Estilo Visual
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
                                {STYLES.map((style) => (
                                    <button key={style} onClick={() => setFormData({ ...formData, style })}
                                        style={formData.style === style ? cardActive : cardBase}>
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                                Idioma Principal
                            </label>
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                style={{ width: "100%", padding: "14px 16px", backgroundColor: "#09090B", border: "1px solid #27272a", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                            >
                                <option value="Português">Português</option>
                                <option value="Inglês">Inglês</option>
                                <option value="Espanhol">Espanhol</option>
                            </select>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: "24px", textAlign: "center" }}>
                        <div style={{ position: "relative" }}>
                            <div style={{ position: "absolute", inset: 0, background: "rgba(222,222,222,0.1)", filter: "blur(40px)", borderRadius: "50%" }} />
                            <div style={{ position: "relative", background: "#141414", border: "1px solid #27272a", padding: "24px", borderRadius: "16px" }}>
                                {generating ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                        <Icon name="loader" size={48} />
                                    </motion.div>
                                ) : (
                                    <Icon name="sparkles" size={48} />
                                )}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>Pronto para gerar?</h3>
                            <p style={{ color: "#71717a", maxWidth: "380px", margin: 0 }}>
                                Nossa IA vai criar prompts personalizados baseados nas suas escolhas para o Flow VEO3.
                            </p>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="rainbow-btn"
                            style={{
                                padding: "14px 36px",
                                fontSize: 15,
                                fontWeight: 700,
                                minWidth: 200,
                                opacity: generating ? 0.6 : 1,
                            }}
                        >
                            {generating ? "Gerando Estratégia..." : "Gerar Viral!"}
                        </button>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", padding: "20px 24px", borderRadius: "16px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
                            <Icon name="check" size={24} />
                            <div>
                                <h4 style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>Estratégia Finalizada!</h4>
                                <p style={{ fontSize: "14px", color: "#71717a", margin: 0 }}>Tudo pronto para você começar a criar seu conteúdo viral.</p>
                            </div>
                        </div>

                        <div>
                            <div style={{ background: "#141414", border: "1px solid #27272a", padding: "24px", borderRadius: "16px" }}>
                                <h5 style={{ fontWeight: "bold", color: "#DEDEDE", margin: "0 0 16px 0" }}>Instruções para o Flow VEO3</h5>
                                <div style={{ background: "rgba(0,0,0,0.5)", padding: "16px", borderRadius: "12px", border: "1px solid #27272a", fontFamily: "monospace", fontSize: "13px", color: "#d4d4d8" }}>
                                    <p style={{ margin: "0 0 12px 0" }}>Copie este código e cole no seu prompt do Flow VEO3:</p>
                                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: "12px" }}>
                                        {`STYL_ID: ${formData.style}\nNICHE: ${formData.niche}\nAUDIENCE: ${formData.targetAudience}\nLANG: ${formData.language}\nFORCE_VIRAL_HOOK: TRUE\nDYNAMIC_SUBTITLES: ENABLED`}
                                    </pre>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(`STYL_ID: ${formData.style}\nNICHE: ${formData.niche}\nAUDIENCE: ${formData.targetAudience}\nLANG: ${formData.language}\nFORCE_VIRAL_HOOK: TRUE\nDYNAMIC_SUBTITLES: ENABLED`)}
                                    style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#27272a", border: "none", borderRadius: "8px", color: "white", fontSize: "12px", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}
                                >
                                    <Icon name="copy" size={14} /> Copiar Prompt
                                </button>
                            </div>
                        </div>

                        <a
                            href="https://labs.google/fx/pt/tools/flow"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "#DEDEDE", color: "#050505", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", textDecoration: "none", cursor: "pointer" }}
                        >
                            Ir para o Flow VEO3 <Icon name="external" size={18} />
                        </a>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "80px" }}>
            <header style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "8px 16px", background: "#141414", border: "1px solid #27272a", borderRadius: "99px", color: "#71717a" }}>
                    <Icon name="rocket" size={16} />
                    <span style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>Viral Creator AI</span>
                </div>
                <h1 style={{ fontSize: "36px", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.03em", margin: 0 }}>
                    DECOLE SEU CONTEÚDO
                </h1>
                <p style={{ color: "#71717a", fontSize: "16px", margin: 0 }}>
                    O guia definitivo para criar canais dark de alta performance.
                </p>
            </header>

            {/* Stepper */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", maxWidth: "480px", margin: "0 auto", width: "100%", position: "relative" }}>
                <div style={{ position: "absolute", top: "20px", left: "32px", right: "32px", height: "1px", background: "#27272a", zIndex: 0 }} />
                {STEPS.map((step) => {
                    const isActive = currentStep >= step.id;
                    const isCurrent = currentStep === step.id;
                    return (
                        <div key={step.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
                            <motion.div
                                animate={{ scale: isCurrent ? 1.15 : 1, backgroundColor: isActive ? '#DEDEDE' : '#141414' }}
                                style={{
                                    width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                    border: isActive ? "2px solid #DEDEDE" : "2px solid #27272a",
                                    zIndex: 1, position: "relative",
                                    boxShadow: isActive ? "0 0 15px rgba(222,222,222,0.3)" : "none",
                                    color: isActive ? "#050505" : "#71717a",
                                    fontWeight: "bold", fontSize: "14px"
                                }}
                            >
                                {step.id}
                            </motion.div>
                            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold", color: isActive ? "#DEDEDE" : "#71717a" }}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Form Container */}
            <div style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", border: "1px solid #27272a", padding: "32px 40px", borderRadius: "24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -96, right: -96, width: 192, height: 192, background: "rgba(222,222,222,0.05)", filter: "blur(80px)", borderRadius: "50%" }} />
                <div style={{ position: "absolute", bottom: -96, left: -96, width: 192, height: 192, background: "rgba(222,222,222,0.05)", filter: "blur(80px)", borderRadius: "50%" }} />

                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>

                {currentStep < 3 && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "32px", borderTop: "1px solid #27272a", marginTop: "32px" }}>
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            style={{ padding: "10px 24px", color: "#71717a", background: "none", border: "none", cursor: currentStep === 1 ? "not-allowed" : "pointer", opacity: currentStep === 1 ? 0.3 : 1, fontSize: "14px", fontFamily: "inherit" }}
                        >
                            Voltar
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={(currentStep === 1 && !formData.niche) || (currentStep === 2 && !formData.style)}
                            className="neon-btn"
                            style={{
                                padding: "10px 28px",
                                background: "#DEDEDE",
                                color: "#050505",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                opacity: (currentStep === 1 && !formData.niche) || (currentStep === 2 && !formData.style) ? 0.4 : 1,
                                position: "relative",
                                overflow: "hidden",
                                fontFamily: "inherit",
                            }}
                        >
                            <span className="neon-top" style={{ position: "absolute", height: 1, opacity: 0, top: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)", transition: "opacity 0.5s ease", pointerEvents: "none" }} />
                            <span style={{ position: "absolute", height: 1, opacity: 0.3, bottom: 0, left: 0, right: 0, width: "75%", margin: "0 auto", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)", pointerEvents: "none" }} />
                            Próximo →
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ padding: "12px 24px", borderRadius: "16px", background: "rgba(20,20,20,0.5)", border: "1px solid #27272a", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#DEDEDE", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: "11px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        AI-Powered Viral Content Strategy Engine
                    </span>
                </div>
            </div>
        </div>
    );
}
