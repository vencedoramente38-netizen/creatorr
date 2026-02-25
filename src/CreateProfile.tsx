import React, { useState, useCallback } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
    UserCircle2,
    Search,
    Wand2,
    Crown,
    UserCircle,
    BarChart2,
    Tag,
    Camera,
    Upload,
    Sparkles,
    Copy,
    CheckCircle2,
    X,
    ChevronRight,
    TrendingUp,
    Target,
    Zap
} from 'lucide-react';
import { cn } from './lib/utils';
import { useDropzone } from 'react-dropzone';
import confetti from 'canvas-confetti';

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
                colors: ['#E81C3E', '#FF236C', '#FFFFFF']
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
                bio: `✨ O melhor de ${form.form_niche || form.niche}\n📦 Achadinhos testados\n👇 Clique abaixo para conferir!`,
                photoDesc: "Um avatar minimalista com fundo circular em gradiente vermelho e a primeira letra do nome estilizada em branco.",
                videos: [
                    "Unboxing do produto mais vendido do mês",
                    "5 razões pelas quais você precisa disso",
                    "Minha rotina usando [Produto]",
                    "Expectativa vs Realidade shop",
                    "Como economizar com esses achadinhos",
                    "Review sincero: Vale a pena?",
                    "Dica secreta de [Nicho] que ninguém te conta"
                ],
                prompt: `Create a professional 3D minimalist avatar for a TikTok Shop account focused on ${form.niche}. Use a red and white color palette.`
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
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Criar Perfil</h1>
                <p className="text-zinc-400 mt-1">Ferramentas de IA para otimizar sua presença no TikTok Shop.</p>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-2 mb-8 bg-[#09090B] p-1 rounded-full border border-zinc-800 w-fit">
                <button
                    onClick={() => setTab('analise')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                        tab === 'analise' ? "bg-[#E81C3E] text-white shadow-lg shadow-red-500/20" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <Search className="w-4 h-4" /> Análise de Conta
                </button>
                <button
                    onClick={() => setTab('assistente')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                        tab === 'assistente' ? "bg-[#E81C3E] text-white shadow-lg shadow-red-500/20" : "text-zinc-500 hover:text-white"
                    )}
                >
                    <Wand2 className="w-4 h-4" /> Assistente de Criação
                </button>
            </div>

            <AnimatePresence mode="wait">
                {tab === 'analise' ? (
                    <motion.div
                        key="analise"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-8 rounded-2xl bg-[#040404] border border-zinc-800"
                    >
                        <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-[#E81C3E]/10">
                                <Crown className="w-6 h-6 text-[#E81C3E]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Análise de Conta</h2>
                                <p className="text-zinc-400 text-sm">Análise inteligente do seu perfil com recomendações personalizadas.</p>
                            </div>
                        </div>

                        {/* Sub Tabs */}
                        <div className="flex gap-2 mb-8">
                            <button
                                onClick={() => setSubTab('perfil')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                    subTab === 'perfil' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-800/50"
                                )}
                            >
                                <UserCircle className="w-4 h-4" /> Perfil — Foto, nome, bio
                            </button>
                            <button
                                onClick={() => setSubTab('metricas')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                    subTab === 'metricas' ? "bg-zinc-800 border-zinc-700 text-white" : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-800/50"
                                )}
                            >
                                <BarChart2 className="w-4 h-4" /> Métricas — Insights, frequência
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                                    <Tag className="w-3 h-3" /> Selecione seu nicho
                                </label>
                                <select
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E81C3E]"
                                >
                                    <option value="">Escolha o nicho do seu perfil</option>
                                    {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                                    <Camera className="w-3 h-3" /> Screenshot do Perfil
                                </label>
                                <p className="text-xs text-zinc-500 mb-4">Faça um print do seu perfil no TikTok mostrando foto, nome, bio e informações visíveis.</p>

                                {!preview ? (
                                    <div
                                        {...getRootProps()}
                                        className={cn(
                                            "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all",
                                            isDragActive ? "border-[#E81C3E] bg-[#E81C3E]/5" : "border-zinc-800 hover:border-zinc-700 bg-black/50"
                                        )}
                                    >
                                        <input {...getInputProps()} />
                                        <Upload className="w-8 h-8 text-zinc-500 mb-3" />
                                        <p className="text-zinc-400 text-sm">Clique para enviar a screenshot</p>
                                        <p className="text-zinc-600 text-xs mt-1">PNG, JPG até 10MB</p>
                                    </div>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden border border-zinc-800 aspect-video bg-black group">
                                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                        <button
                                            onClick={() => setPreview(null)}
                                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="w-full py-4 bg-[#E81C3E] text-white font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
                            >
                                {isAnalyzing ? (
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                ) : (
                                    <Sparkles className="w-5 h-5" />
                                )}
                                {isAnalyzing ? "Analisando..." : "Analisar minha conta"}
                            </button>

                            {isAnalyzing && (
                                <div className="space-y-3 pt-4">
                                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-[#E81C3E] h-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${analysisProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-center text-xs font-medium text-zinc-500">
                                        {analysisPhrases[analysisStep]}
                                    </p>
                                </div>
                            )}

                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-10 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-[#E81C3E]" /> Resultado da Análise
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-zinc-500">SCORE:</span>
                                            <span className="text-2xl font-black text-[#E81C3E]">{analysisResult.score}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-black/40 rounded-xl border border-emerald-500/20">
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase mb-2">✅ Pontos Fortes</p>
                                            <p className="text-sm text-zinc-300">{analysisResult.pontosFortes}</p>
                                        </div>
                                        <div className="p-4 bg-black/40 rounded-xl border border-amber-500/20">
                                            <p className="text-[10px] font-bold text-amber-500 uppercase mb-2">⚠️ Melhorias</p>
                                            <p className="text-sm text-zinc-300">{analysisResult.pontosMelhoria}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-black/40 rounded-xl border border-[#E81C3E]/20">
                                        <p className="text-[10px] font-bold text-[#E81C3E] uppercase mb-2">💡 Recomendações Personalizadas</p>
                                        <p className="text-sm text-zinc-300">{analysisResult.recomendacoes}</p>
                                    </div>

                                    <button
                                        onClick={() => copyToClipboard(`Score: ${analysisResult.score}\n\nPontos Fortes: ${analysisResult.pontosFortes}\n\nMelhorias: ${analysisResult.pontosMelhoria}\n\nRecomendações: ${analysisResult.recomendacoes}`)}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-all"
                                    >
                                        <Copy size={16} /> Copiar Análise
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
                        className="p-8 rounded-2xl bg-[#040404] border border-zinc-800"
                    >
                        <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-[#E81C3E]/10">
                                <Wand2 className="w-6 h-6 text-[#E81C3E]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Assistente de Criação</h2>
                                <p className="text-zinc-400 text-sm">Deixa a IA te ajudar a criar um perfil otimizado para vender no TikTok Shop.</p>
                            </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-2 mb-8">
                            {[1, 2, 3].map(s => (
                                <React.Fragment key={s}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        step === s ? "bg-[#E81C3E] text-white" : step > s ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
                                    )}>
                                        {step > s ? <CheckCircle2 size={16} /> : s}
                                    </div>
                                    {s < 3 && <div className={cn("flex-1 h-px", step > s ? "bg-emerald-500" : "bg-zinc-800")} />}
                                </React.Fragment>
                            ))}
                        </div>

                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome de usuário desejado</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: achadinhosdaana"
                                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E81C3E]"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nicho principal</label>
                                    <select
                                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E81C3E]"
                                        value={form.niche}
                                        onChange={(e) => setForm({ ...form, niche: e.target.value })}
                                    >
                                        <option value="">Escolha um nicho</option>
                                        {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Público-alvo</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {AUDIENCES.map(a => (
                                            <button
                                                key={a}
                                                onClick={() => setForm({ ...form, audience: a })}
                                                className={cn(
                                                    "py-3 rounded-xl border text-sm font-bold transition-all",
                                                    form.audience === a ? "border-[#E81C3E] bg-[#E81C3E]/10 text-white" : "border-zinc-800 bg-black/40 text-zinc-500 hover:border-zinc-700"
                                                )}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Gênero do criador</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        {GENDERS.map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setForm({ ...form, gender: g })}
                                                className={cn(
                                                    "py-3 rounded-xl border text-sm font-bold transition-all",
                                                    form.gender === g ? "border-[#E81C3E] bg-[#E81C3E]/10 text-white" : "border-zinc-800 bg-black/40 text-zinc-500 hover:border-zinc-700"
                                                )}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-zinc-800 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    Continuar <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Tom da conta</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {TONES.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setForm({ ...form, tone: t })}
                                                className={cn(
                                                    "py-3 rounded-xl border text-sm font-bold transition-all",
                                                    form.tone === t ? "border-[#E81C3E] bg-[#E81C3E]/10 text-white" : "border-zinc-800 bg-black/40 text-zinc-500 hover:border-zinc-700"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Frequência de posts</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {FREQUENCIES.map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setForm({ ...form, frequency: f })}
                                                className={cn(
                                                    "py-3 rounded-xl border text-sm font-bold transition-all",
                                                    form.frequency === f ? "border-[#E81C3E] bg-[#E81C3E]/10 text-white" : "border-zinc-800 bg-black/40 text-zinc-500 hover:border-zinc-700"
                                                )}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Tipo de conteúdo (Multi-select)</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                                                className={cn(
                                                    "py-3 rounded-xl border text-sm font-bold transition-all relative",
                                                    form.contentTypes.includes(c) ? "border-[#E81C3E] bg-[#E81C3E]/10 text-white" : "border-zinc-800 bg-black/40 text-zinc-500 hover:border-zinc-700"
                                                )}
                                            >
                                                {c}
                                                {form.contentTypes.includes(c) && <CheckCircle2 className="absolute top-1 right-1 text-[#E81C3E]" size={12} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-full">Voltar</button>
                                    <button onClick={() => setStep(3)} className="flex-[2] py-4 bg-zinc-800 text-white font-bold rounded-full">Continuar</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                {!result ? (
                                    <div className="text-center py-10">
                                        <p className="text-zinc-400 mb-6">Tudo pronto! Pronto para gerar seu perfil estratégico?</p>
                                        <button
                                            onClick={generateProfile}
                                            disabled={isAnalyzing}
                                            className="w-full py-5 bg-gradient-to-r from-[#E81C3E] to-[#FF236C] text-white font-black italic uppercase tracking-widest rounded-full shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Wand2 size={24} />
                                            {isAnalyzing ? "Gerando..." : "Gerar Perfil Completo"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-3">Sugestões de Usuário</p>
                                                    <ul className="space-y-2">
                                                        {result.usernames.map(u => (
                                                            <li key={u} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-zinc-800">
                                                                <code className="text-[#E81C3E] font-bold">@{u}</code>
                                                                <button onClick={() => copyToClipboard(`@${u}`)} className="p-1 hover:text-[#E81C3E]"><Copy size={14} /></button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-3">Bio Otimizada</p>
                                                    <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 relative">
                                                        <pre className="text-sm whitespace-pre-wrap font-sans text-white">{result.bio}</pre>
                                                        <button onClick={() => copyToClipboard(result.bio)} className="absolute top-2 right-2 p-1 hover:text-[#E81C3E]"><Copy size={16} /></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-3">Foto de Perfil Sugerida</p>
                                                    <p className="text-sm text-zinc-300 mb-4">{result.photoDesc}</p>
                                                    <div className="p-4 rounded-xl bg-black border border-[#E81C3E]/20 space-y-3">
                                                        <p className="text-xs text-zinc-500">Prompt para Grok/DALL-E:</p>
                                                        <p className="text-xs font-mono text-[#E81C3E]">{result.prompt}</p>
                                                        <button
                                                            onClick={() => window.open(`https://grok.com?q=${encodeURIComponent('Create a profile picture: ' + result.prompt)}`, '_blank')}
                                                            className="w-full py-3 bg-[#E81C3E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                                                        >
                                                            Criar avatar no Grok <ChevronRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                                            <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" /> Ideias para os Primeiros 7 Vídeos
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {result.videos.map((v, i) => (
                                                    <div key={i} className="flex gap-4 p-3 rounded-xl bg-black border border-zinc-800">
                                                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-xs text-zinc-300 font-medium">{v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button onClick={() => { setResult(null); setStep(1); }} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-full">Recomeçar</button>
                                            <button onClick={() => copyToClipboard(`Perfil TikTok Shop\n\nBio:\n${result.bio}\n\nIdeias de Conteúdo:\n${result.videos.join('\n')}`)} className="flex-[2] py-4 bg-[#E81C3E] text-white font-bold rounded-full">Copiar Tudo</button>
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
