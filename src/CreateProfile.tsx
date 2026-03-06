import React, { useState, useCallback, useMemo } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import confetti from 'canvas-confetti';

const Icon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
    const icons: Record<string, React.ReactNode> = {
        userCircle2: <React.Fragment><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></React.Fragment>,
        search: <React.Fragment><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></React.Fragment>,
        wand2: <React.Fragment><path d="m15 5 4 4" /><path d="M13 7 8.7 2.7a2 2 0 0 0-2.8 0L3.3 5.3a2 2 0 0 0 0 2.8L7.6 12.4l4.7-4.7" /><path d="m18 14 3 3" /><path d="m15 11 3 3" /><path d="m11 7 3 3" /><path d="m8 4 3 3" /><path d="m13 18 1 1" /><path d="m10 15 1 1" /><path d="m16 21 1 1" /></React.Fragment>,
        crown: <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />,
        userCircle: <React.Fragment><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></React.Fragment>,
        barChart2: <React.Fragment><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></React.Fragment>,
        tag: <React.Fragment><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><line x1="7" y1="7" x2="7.01" y2="7" /></React.Fragment>,
        camera: <React.Fragment><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></React.Fragment>,
        upload: <React.Fragment><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></React.Fragment>,
        sparkles: <React.Fragment><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></React.Fragment>,
        copy: <React.Fragment><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></React.Fragment>,
        checkCircle2: <React.Fragment><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></React.Fragment>,
        x: <React.Fragment><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></React.Fragment>,
        chevronRight: <polyline points="9 18 15 12 9 6" />,
        trendingUp: <React.Fragment><path d="m22 7-8.5 8.5-5-5L2 17" /><polyline points="16 7 22 7 22 13" /></React.Fragment>,
        target: <React.Fragment><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></React.Fragment>,
        zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
        alertCircle: <React.Fragment><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></React.Fragment>,
        lightbulb: <React.Fragment><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" /><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /></React.Fragment>
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

const NICHES = [
    "Beleza", "Moda", "Casa & Cozinha", "Fitness", "Pets",
    "Tech", "Alimentação", "Finanças", "Entretenimento", "Outro"
];

const AUDIENCES = ["18-24", "25-34", "35-44", "45+"];
const GENDERS = ["Feminino", "Masculino", "Marca/Empresa"];
const TONES = ["Profissional", "Descontraído", "Educativo", "Divertido", "Inspiracional"];
const FREQUENCIES = ["1x/dia", "2x/dia", "3x+/dia", "Alguns por semana"];
const CONTENT_TYPES = ["Review de produtos", "Unboxing", "Tutorial", "Lifestyle", "Comparações"];

const CreateProfile: React.FC = () => {
    const { addNotification } = useApp();
    const [tab, setTab] = useState<'analise' | 'assistente'>('analise');
    const [subTab, setSubTab] = useState<'perfil' | 'metricas'>('perfil');

    // Analise State
    const [niche, setNiche] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);

    // Assistente State
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        username: '',
        niche: '',
        audience: '',
        gender: '',
        tone: '',
        frequency: '',
        contentTypes: [] as string[]
    });
    const [result, setResult] = useState<any | null>(null);

    const analysisPhrases = [
        "Analisando seu perfil...",
        "Identificando pontos de melhoria...",
        "Gerando recomendações personalizadas..."
    ];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
        multiple: false
    } as any);

    const runAnalysis = () => {
        if (!file || !niche) {
            addNotification("Ops!", "Selecione o nicho e envie a screenshot.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setAnalysisStep(0);
        setAnalysisResult(null);

        const interval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });

            setAnalysisStep(prev => {
                const next = Math.floor(analysisProgress / 33.33);
                return next < 3 ? next : 2;
            });
        }, 50);

        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisResult({
                pontosFortes: "Identidade visual coerente, boa frequência de postagens e nicho bem definido.",
                pontosMelhoria: "Sua bio pode ser mais direta com uma CTA clara. A foto de perfil precisa de mais contraste.",
                recomendacoes: "Use mais hooks nos primeiros 3 segundos. Experimente áudios tendenciais do seu nicho.",
                score: 85
            });
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#DEDEDE', '#DEDEDE', '#FFFFFF']
            });
            addNotification("Sucesso", "Análise concluída!");
        }, 5000);
    };

    const generateProfile = () => {
        if (!form.username || !form.niche) {
            addNotification("Ops!", "Preencha os campos obrigatórios.");
            return;
        }

        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult({
                usernames: [`${form.username}.shop`, `${form.username}_oficial`, `best_${form.username}`],
                bio: `✨ O melhor de ${form.niche}\n📦 Achadinhos testados\n👇 Clique abaixo para conferir!`,
                photoDesc: "Um avatar minimalista com fundo circular em gradiente cinza e a primeira letra do nome estilizada em branco.",
                videos: [
                    "Unboxing do produto mais vendido do mês",
                    "5 razões pelas quais você precisa disso",
                    "Minha rotina usando [Produto]",
                    "Expectativa vs Realidade shop",
                    "Como economizar com esses achadinhos",
                    "Review sincero: Vale a pena?",
                    "Dica secreta de [Nicho] que ninguém te conta"
                ],
                prompt: `Create a professional 3D minimalist avatar for a TikTok Shop account focused on ${form.niche}. Use a dark gray and white color palette.`
            });
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            addNotification("Perfil Gerado", "Tudo pronto para sua nova conta!");
        }, 3000);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addNotification("Copiado!", "Conteúdo copiado para a área de transferência.");
    };

    return (
        <div style={{ maxWidth: "896px", marginLeft: "auto", marginRight: "auto", paddingBottom: "80px" }}>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "30px", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.05em" }}>Criar Perfil</h1>
                <p style={{ color: "#a1a1aa", marginTop: "4px" }}>Ferramentas de IA para otimizar sua presença no TikTok Shop.</p>
            </div>

            {/* Main Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "32px", backgroundColor: "#09090B", padding: "4px", borderRadius: "9999px", border: "1px solid #27272a", width: "fit-content" }}>
                <button
                    onClick={() => setTab('analise')}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        borderRadius: "9999px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "all 0.2s",
                        backgroundColor: tab === 'analise' ? "#DEDEDE" : "transparent",
                        color: tab === 'analise' ? "#050505" : "#71717a",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: tab === 'analise' ? "0 10px 15px -3px rgba(222, 222, 222, 0.2)" : "none"
                    }}
                >
                    <Icon name="search" size={16} /> Análise de Conta
                </button>
                <button
                    onClick={() => setTab('assistente')}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        borderRadius: "9999px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "all 0.2s",
                        backgroundColor: tab === 'assistente' ? "#DEDEDE" : "transparent",
                        color: tab === 'assistente' ? "#050505" : "#71717a",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: tab === 'assistente' ? "0 10px 15px -3px rgba(222, 222, 222, 0.2)" : "none"
                    }}
                >
                    <Icon name="wand2" size={16} /> Assistente de Criação
                </button>
            </div>

            <AnimatePresence mode="wait">
                {tab === 'analise' ? (
                    <motion.div
                        key="analise"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            padding: "32px",
                            borderRadius: "24px",
                            backgroundColor: "#141414",
                            border: "1px solid #27272a"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "start", gap: "16px", marginBottom: "32px" }}>
                            <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: "rgba(222, 222, 222, 0.1)" }}>
                                <Icon name="crown" size={24} style={{ color: "#DEDEDE" }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Análise de Conta</h2>
                                <p style={{ color: "#71717a", fontSize: "14px" }}>Análise inteligente do seu perfil com recomendações personalizadas.</p>
                            </div>
                        </div>

                        {/* Sub Tabs */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
                            <button
                                onClick={() => setSubTab('perfil')}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    paddingLeft: "16px",
                                    paddingRight: "16px",
                                    paddingTop: "8px",
                                    paddingBottom: "8px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    transition: "all 0.2s",
                                    border: subTab === 'perfil' ? "1px solid #3f3f46" : "1px solid transparent",
                                    backgroundColor: subTab === 'perfil' ? "#27272a" : "transparent",
                                    color: subTab === 'perfil' ? "white" : "#71717a",
                                    cursor: "pointer"
                                }}
                            >
                                <Icon name="userCircle" size={16} /> Perfil — Foto, nome, bio
                            </button>
                            <button
                                onClick={() => setSubTab('metricas')}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    paddingLeft: "16px",
                                    paddingRight: "16px",
                                    paddingTop: "8px",
                                    paddingBottom: "8px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    transition: "all 0.2s",
                                    border: subTab === 'metricas' ? "1px solid #3f3f46" : "1px solid transparent",
                                    backgroundColor: subTab === 'metricas' ? "#27272a" : "transparent",
                                    color: subTab === 'metricas' ? "white" : "#71717a",
                                    cursor: "pointer"
                                }}
                            >
                                <Icon name="barChart2" size={16} /> Métricas — Insights, frequência
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                                    <Icon name="tag" size={12} /> Selecione seu nicho
                                </label>
                                <select
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#050505",
                                        border: "1px solid #27272a",
                                        borderRadius: "12px",
                                        paddingLeft: "16px",
                                        paddingRight: "16px",
                                        paddingTop: "12px",
                                        paddingBottom: "12px",
                                        fontSize: "14px",
                                        color: "white",
                                        outline: "none"
                                    }}
                                >
                                    <option value="">Escolha o nicho do seu perfil</option>
                                    {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                                    <Icon name="camera" size={12} /> Screenshot do Perfil
                                </label>
                                <p style={{ fontSize: "12px", color: "#71717a", marginBottom: "16px" }}>Faça um print do seu perfil no TikTok mostrando foto, nome, bio e informações visíveis.</p>

                                {!preview ? (
                                    <div
                                        {...getRootProps()}
                                        style={{
                                            border: "2px dashed #27272a",
                                            borderRadius: "16px",
                                            padding: "48px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            backgroundColor: isDragActive ? "rgba(222, 222, 222, 0.05)" : "rgba(0, 0, 0, 0.5)",
                                            borderColor: isDragActive ? "#DEDEDE" : "#27272a"
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        <Icon name="upload" size={32} style={{ color: "#71717a", marginBottom: "12px" }} />
                                        <p style={{ color: "#a1a1aa", fontSize: "14px" }}>Clique para enviar a screenshot</p>
                                        <p style={{ color: "#52525b", fontSize: "12px", marginTop: "4px" }}>PNG, JPG até 10MB</p>
                                    </div>
                                ) : (
                                    <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid #27272a", aspectRatio: "16/9", backgroundColor: "black" }}>
                                        <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                        <button
                                            onClick={() => setPreview(null)}
                                            style={{
                                                position: "absolute",
                                                top: "16px",
                                                right: "16px",
                                                padding: "8px",
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
                                        >
                                            <Icon name="x" size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                style={{
                                    width: "100%",
                                    paddingTop: "16px",
                                    paddingBottom: "16px",
                                    backgroundColor: "#DEDEDE",
                                    color: "#050505",
                                    fontWeight: "bold",
                                    borderRadius: "9999px",
                                    border: "none",
                                    cursor: isAnalyzing ? "default" : "pointer",
                                    transition: "all 0.2s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    boxShadow: "0 10px 15px -3px rgba(222, 222, 222, 0.2)",
                                    opacity: isAnalyzing ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => !isAnalyzing && (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseLeave={(e) => !isAnalyzing && (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <Icon name="sparkles" size={20} style={{ animation: isAnalyzing ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none" }} />
                                {isAnalyzing ? "Analisando..." : "Analisar minha conta"}
                            </button>

                            {isAnalyzing && (
                                <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div style={{ width: "100%", backgroundColor: "#18181b", height: "6px", borderRadius: "9999px", overflow: "hidden" }}>
                                        <motion.div
                                            style={{ backgroundColor: "#DEDEDE", height: "100%" }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${analysisProgress}%` }}
                                        />
                                    </div>
                                    <p style={{ textAlign: "center", fontSize: "12px", fontWeight: "medium", color: "#71717a" }}>
                                        {analysisPhrases[analysisStep]}
                                    </p>
                                </div>
                            )}

                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        marginTop: "40px",
                                        padding: "24px",
                                        borderRadius: "24px",
                                        backgroundColor: "rgba(39, 39, 42, 0.5)",
                                        border: "1px solid #27272a",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "24px"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <h3 style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Icon name="zap" size={16} style={{ color: "#DEDEDE" }} /> Resultado da Análise
                                        </h3>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a" }}>SCORE:</span>
                                            <span style={{ fontSize: "24px", fontWeight: 900, color: "#DEDEDE" }}>{analysisResult.score}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr", mdGridTemplateColumns: "1fr 1fr" as any, gap: "16px" }}>
                                        <div style={{ padding: "16px", backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                                            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#10b981", uppercase: "true" as any, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <Icon name="checkCircle2" size={12} /> Pontos Fortes
                                            </p>
                                            <p style={{ fontSize: "14px", color: "#d1d1d6" }}>{analysisResult.pontosFortes}</p>
                                        </div>
                                        <div style={{ padding: "16px", backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                                            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#f59e0b", uppercase: "true" as any, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <Icon name="alertCircle" size={12} /> Melhorias
                                            </p>
                                            <p style={{ fontSize: "14px", color: "#d1d1d6" }}>{analysisResult.pontosMelhoria}</p>
                                        </div>
                                    </div>

                                    <div style={{ padding: "16px", backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: "12px", border: "1px solid rgba(222, 222, 222, 0.2)" }}>
                                        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", uppercase: "true" as any, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                                            <Icon name="lightbulb" size={12} /> Recomendações Personalizadas
                                        </p>
                                        <p style={{ fontSize: "14px", color: "#d1d1d6" }}>{analysisResult.recomendacoes}</p>
                                    </div>

                                    <button
                                        onClick={() => copyToClipboard(`Score: ${analysisResult.score}\n\nPontos Fortes: ${analysisResult.pontosFortes}\n\nMelhorias: ${analysisResult.pontosMelhoria}\n\nRecomendações: ${analysisResult.recomendacoes}`)}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            paddingTop: "12px",
                                            paddingBottom: "12px",
                                            backgroundColor: "#27272a",
                                            color: "white",
                                            borderRadius: "12px",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            border: "none",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3f3f46")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
                                    >
                                        <Icon name="copy" size={16} /> Copiar Análise
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="assistente"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            padding: "32px",
                            borderRadius: "24px",
                            backgroundColor: "#141414",
                            border: "1px solid #27272a"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "start", gap: "16px", marginBottom: "32px" }}>
                            <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: "rgba(222, 222, 222, 0.1)" }}>
                                <Icon name="wand2" size={24} style={{ color: "#DEDEDE" }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Assistente de Criação</h2>
                                <p style={{ color: "#71717a", fontSize: "14px" }}>Deixa a IA te ajudar a criar um perfil estratégico para vender no TikTok Shop.</p>
                            </div>
                        </div>

                        {/* Stepper */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
                            {[1, 2, 3].map(s => (
                                <React.Fragment key={s}>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        transition: "all 0.2s",
                                        backgroundColor: step === s ? "#DEDEDE" : step > s ? "#10b981" : "#27272a",
                                        color: step === s ? "#050505" : "white"
                                    }}>
                                        {step > s ? <Icon name="checkCircle2" size={16} /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div style={{
                                            flex: 1,
                                            height: "1px",
                                            backgroundColor: step > s ? "#10b981" : "#27272a"
                                        }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", display: "block" }}>Nome de usuário desejado</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: achadinhosdaana"
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#050505",
                                            border: "1px solid #27272a",
                                            borderRadius: "12px",
                                            paddingLeft: "16px",
                                            paddingRight: "16px",
                                            paddingTop: "12px",
                                            paddingBottom: "12px",
                                            fontSize: "14px",
                                            color: "white",
                                            outline: "none"
                                        }}
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", display: "block" }}>Nicho principal</label>
                                    <select
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#050505",
                                            border: "1px solid #27272a",
                                            borderRadius: "12px",
                                            paddingLeft: "16px",
                                            paddingRight: "16px",
                                            paddingTop: "12px",
                                            paddingBottom: "12px",
                                            fontSize: "14px",
                                            color: "white",
                                            outline: "none"
                                        }}
                                        value={form.niche}
                                        onChange={(e) => setForm({ ...form, niche: e.target.value })}
                                    >
                                        <option value="">Escolha um nicho</option>
                                        {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "block" }}>Público-alvo</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", mdGridTemplateColumns: "repeat(4, 1fr)" as any, gap: "8px" }}>
                                        {AUDIENCES.map(a => (
                                            <button
                                                key={a}
                                                onClick={() => setForm({ ...form, audience: a })}
                                                style={{
                                                    paddingTop: "12px",
                                                    paddingBottom: "12px",
                                                    borderRadius: "12px",
                                                    border: form.audience === a ? "1px solid #DEDEDE" : "1px solid #27272a",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    transition: "all 0.2s",
                                                    backgroundColor: form.audience === a ? "rgba(222, 222, 222, 0.1)" : "rgba(0, 0, 0, 0.4)",
                                                    color: form.audience === a ? "white" : "#71717a",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "block" }}>Gênero do criador</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr", mdGridTemplateColumns: "repeat(3, 1fr)" as any, gap: "8px" }}>
                                        {GENDERS.map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setForm({ ...form, gender: g })}
                                                style={{
                                                    paddingTop: "12px",
                                                    paddingBottom: "12px",
                                                    borderRadius: "12px",
                                                    border: form.gender === g ? "1px solid #DEDEDE" : "1px solid #27272a",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    transition: "all 0.2s",
                                                    backgroundColor: form.gender === g ? "rgba(222, 222, 222, 0.1)" : "rgba(0, 0, 0, 0.4)",
                                                    color: form.gender === g ? "white" : "#71717a",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    style={{
                                        width: "100%",
                                        paddingTop: "16px",
                                        paddingBottom: "16px",
                                        backgroundColor: "#27272a",
                                        color: "white",
                                        fontWeight: "bold",
                                        borderRadius: "9999px",
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        marginTop: "16px"
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3f3f46")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
                                >
                                    Continuar <Icon name="chevronRight" size={18} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "block" }}>Tom da conta</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", mdGridTemplateColumns: "repeat(3, 1fr)" as any, gap: "8px" }}>
                                        {TONES.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setForm({ ...form, tone: t })}
                                                style={{
                                                    paddingTop: "12px",
                                                    paddingBottom: "12px",
                                                    borderRadius: "12px",
                                                    border: form.tone === t ? "1px solid #DEDEDE" : "1px solid #27272a",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    transition: "all 0.2s",
                                                    backgroundColor: form.tone === t ? "rgba(222, 222, 222, 0.1)" : "rgba(0, 0, 0, 0.4)",
                                                    color: form.tone === t ? "white" : "#71717a",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "block" }}>Frequência de posts</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                                        {FREQUENCIES.map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setForm({ ...form, frequency: f })}
                                                style={{
                                                    paddingTop: "12px",
                                                    paddingBottom: "12px",
                                                    borderRadius: "12px",
                                                    border: form.frequency === f ? "1px solid #DEDEDE" : "1px solid #27272a",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    transition: "all 0.2s",
                                                    backgroundColor: form.frequency === f ? "rgba(222, 222, 222, 0.1)" : "rgba(0, 0, 0, 0.4)",
                                                    color: form.frequency === f ? "white" : "#71717a",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "block" }}>Tipo de conteúdo (Multi-select)</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", mdGridTemplateColumns: "repeat(3, 1fr)" as any, gap: "8px" }}>
                                        {CONTENT_TYPES.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => {
                                                    const current = [...form.contentTypes];
                                                    const idx = current.indexOf(c);
                                                    if (idx > -1) current.splice(idx, 1);
                                                    else current.push(c);
                                                    setForm({ ...form, contentTypes: current });
                                                }}
                                                style={{
                                                    paddingTop: "12px",
                                                    paddingBottom: "12px",
                                                    borderRadius: "12px",
                                                    border: form.contentTypes.includes(c) ? "1px solid #DEDEDE" : "1px solid #27272a",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    transition: "all 0.2s",
                                                    backgroundColor: form.contentTypes.includes(c) ? "rgba(222, 222, 222, 0.1)" : "rgba(0, 0, 0, 0.4)",
                                                    color: form.contentTypes.includes(c) ? "white" : "#71717a",
                                                    cursor: "pointer",
                                                    position: "relative"
                                                }}
                                            >
                                                {c}
                                                {form.contentTypes.includes(c) && <Icon name="checkCircle2" size={12} style={{ position: "absolute", top: "4px", right: "4px", color: "#DEDEDE" }} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "16px" }}>
                                    <button onClick={() => setStep(1)} style={{ flex: 1, paddingTop: "16px", paddingBottom: "16px", backgroundColor: "#09090b", color: "white", fontWeight: "bold", borderRadius: "9999px", border: "1px solid #27272a", cursor: "pointer" }}>Voltar</button>
                                    <button onClick={() => setStep(3)} style={{ flex: 2, paddingTop: "16px", paddingBottom: "16px", backgroundColor: "#27272a", color: "white", fontWeight: "bold", borderRadius: "9999px", border: "none", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3f3f46")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}>Continuar</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {!result ? (
                                    <div style={{ textAlign: "center", paddingTop: "40px", paddingBottom: "40px" }}>
                                        <p style={{ color: "#71717a", marginBottom: "24px" }}>Tudo pronto! Pronto para gerar seu perfil estratégico?</p>
                                        <button
                                            onClick={generateProfile}
                                            disabled={isAnalyzing}
                                            style={{
                                                width: "100%",
                                                paddingTop: "20px",
                                                paddingBottom: "20px",
                                                backgroundColor: "#DEDEDE",
                                                color: "#050505",
                                                fontWeight: 900,
                                                fontStyle: "italic",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.1em",
                                                borderRadius: "9999px",
                                                border: "none",
                                                boxShadow: "0 20px 25px -5px rgba(222, 222, 222, 0.1)",
                                                cursor: isAnalyzing ? "default" : "pointer",
                                                transition: "all 0.2s",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                opacity: isAnalyzing ? 0.5 : 1
                                            }}
                                            onMouseEnter={(e) => !isAnalyzing && (e.currentTarget.style.transform = "scale(1.02)")}
                                            onMouseLeave={(e) => !isAnalyzing && (e.currentTarget.style.transform = "scale(1)")}
                                        >
                                            <Icon name="wand2" size={24} />
                                            {isAnalyzing ? "Gerando..." : "Gerar Perfil Completo"}
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr", mdGridTemplateColumns: "1fr 1fr" as any, gap: "24px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                <div style={{ padding: "20px", borderRadius: "24px", backgroundColor: "#1c1c1f", border: "1px solid #27272a" }}>
                                                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginBottom: "12px" }}>Sugestões de Usuário</p>
                                                    <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", padding: 0 }}>
                                                        {result.usernames.map(u => (
                                                            <li key={u} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", borderRadius: "8px", backgroundColor: "rgba(0, 0, 0, 0.4)", border: "1px solid #27272a" }}>
                                                                <code style={{ color: "#DEDEDE", fontWeight: "bold" }}>@{u}</code>
                                                                <button onClick={() => copyToClipboard(`@${u}`)} style={{ padding: "4px", background: "none", border: "none", color: "#71717a", cursor: "pointer" }}><Icon name="copy" size={14} /></button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div style={{ padding: "20px", borderRadius: "24px", backgroundColor: "#1c1c1f", border: "1px solid #27272a" }}>
                                                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginBottom: "12px" }}>Bio Otimizada</p>
                                                    <div style={{ position: "relative", padding: "16px", borderRadius: "12px", backgroundColor: "rgba(0, 0, 0, 0.4)", border: "1px solid #27272a" }}>
                                                        <pre style={{ fontSize: "14px", whiteSpace: "pre-wrap", fontFamily: "inherit", color: "white", margin: 0 }}>{result.bio}</pre>
                                                        <button onClick={() => copyToClipboard(result.bio)} style={{ position: "absolute", top: "8px", right: "8px", padding: "4px", background: "none", border: "none", color: "#71717a", cursor: "pointer" }}><Icon name="copy" size={16} /></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                <div style={{ padding: "20px", borderRadius: "24px", backgroundColor: "#1c1c1f", border: "1px solid #27272a" }}>
                                                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginBottom: "12px" }}>Foto de Perfil Sugerida</p>
                                                    <p style={{ fontSize: "14px", color: "#d1d1d6", marginBottom: "16px" }}>{result.photoDesc}</p>
                                                    <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: "black", border: "1px solid rgba(222, 222, 222, 0.2)", display: "flex", flexDirection: "column", gap: "12px" }}>
                                                        <p style={{ fontSize: "12px", color: "#71717a" }}>Prompt para Grok/DALL-E:</p>
                                                        <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#DEDEDE" }}>{result.prompt}</p>
                                                        <button
                                                            onClick={() => window.open(`https://grok.com?q=${encodeURIComponent('Create a profile picture: ' + result.prompt)}`, '_blank')}
                                                            style={{
                                                                width: "100%",
                                                                paddingTop: "12px",
                                                                paddingBottom: "12px",
                                                                backgroundColor: "#DEDEDE",
                                                                color: "#050505",
                                                                fontSize: "12px",
                                                                fontWeight: "bold",
                                                                borderRadius: "12px",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "8px"
                                                            }}
                                                        >
                                                            Criar avatar no Grok <Icon name="chevronRight" size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#1c1c1f", border: "1px solid #27272a" }}>
                                            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Icon name="trendingUp" size={16} style={{ color: "#10b981" }} /> Ideias para os Primeiros 7 Vídeos
                                            </h3>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr", smGridTemplateColumns: "1fr 1fr" as any, gap: "12px" }}>
                                                {result.videos.map((v, i) => (
                                                    <div key={i} style={{ display: "flex", gap: "16px", padding: "12px", borderRadius: "12px", backgroundColor: "black", border: "1px solid #27272a" }}>
                                                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#27272a", flexShrink: 0, display: "flex", alignItems: "center", justify: "center" as any, fontSize: "10px", fontWeight: "bold", color: "#71717a" }}>
                                                            {i + 1}
                                                        </div>
                                                        <p style={{ fontSize: "12px", color: "#d1d1d6", fontWeight: "medium" }}>{v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: "16px" }}>
                                            <button onClick={() => { setResult(null); setStep(1); }} style={{ flex: 1, paddingTop: "16px", paddingBottom: "16px", backgroundColor: "#1c1c1f", color: "white", fontWeight: "bold", borderRadius: "9999px", border: "none", cursor: "pointer" }}>Recomeçar</button>
                                            <button onClick={() => copyToClipboard(`Perfil TikTok Shop\n\nBio:\n${result.bio}\n\nIdeias de Conteúdo:\n${result.videos.join('\n')}`)} style={{ flex: 2, paddingTop: "16px", paddingBottom: "16px", backgroundColor: "#DEDEDE", color: "#050505", fontWeight: "bold", borderRadius: "9999px", border: "none", cursor: "pointer" }}>Copiar Tudo</button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateProfile;
