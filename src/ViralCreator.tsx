import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, Wand2, CheckCircle2, AlertCircle, Loader2, Send, Languages, Palette, Target } from 'lucide-react';
import { HoverBorderGradient } from './components/ui/hover-border-gradient';
import { cn } from './lib/utils';

const STEPS = [
    { id: 1, label: 'Nicho', icon: Target },
    { id: 2, label: 'Estilo', icon: Palette },
    { id: 3, label: 'Prompts AI', icon: Wand2 },
    { id: 4, label: 'Review', icon: CheckCircle2 },
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

export function ViralCreator() {
    const [currentStep, setCurrentStep] = useState(1);
    const [generating, setGenerating] = useState(false);
    const [formData, setFormData] = useState({
        niche: '',
        style: '',
        targetAudience: '',
        language: 'Português',
    });

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Selecione seu Nicho</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {NICHES.map((niche) => (
                                    <button
                                        key={niche}
                                        onClick={() => setFormData({ ...formData, niche })}
                                        className={cn(
                                            "p-4 rounded-xl text-sm font-medium transition-all duration-300 border",
                                            formData.niche === niche
                                                ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(255,35,108,0.2)]"
                                                : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
                                        )}
                                    >
                                        {niche}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Público Alvo</label>
                            <input
                                type="text"
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                placeholder="Ex: Jovens interessados em investimento"
                                className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Estilo Visual</label>
                            <div className="grid grid-cols-2 gap-3">
                                {STYLES.map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setFormData({ ...formData, style })}
                                        className={cn(
                                            "p-4 rounded-xl text-sm font-medium transition-all duration-300 border",
                                            formData.style === style
                                                ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(255,35,108,0.2)]"
                                                : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Idioma Principal</label>
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
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
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <div className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                                {generating ? (
                                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                ) : (
                                    <Sparkles className="w-12 h-12 text-primary" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Pronto para gerar?</h3>
                            <p className="text-zinc-400 max-w-sm">
                                Nossa IA vai criar prompts personalizados baseados nas suas escolhas para o Flow VEO3.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setGenerating(true);
                                setTimeout(() => {
                                    setGenerating(false);
                                    handleNext();
                                }, 3000);
                            }}
                            disabled={generating}
                            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(255,35,108,0.3)] disabled:opacity-50"
                        >
                            {generating ? "Gerando E estratégia..." : "Gerar Prompts e Estratégia"}
                        </button>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-start space-x-4">
                            <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div className="space-y-1">
                                <h4 className="font-bold">Estratégia Finalizada!</h4>
                                <p className="text-sm text-zinc-400">Tudo pronto para você começar a criar seu conteúdo viral.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
                                <h5 className="font-semibold text-primary">Instruções para o Flow VEO3</h5>
                                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 font-mono text-sm text-zinc-300">
                                    <p>Copie este código e cole no seu prompt do Flow VEO3:</p>
                                    <pre className="mt-4 whitespace-pre-wrap">
                                        {`STYL_ID: ${formData.style}\nNICHE: ${formData.niche}\nAUDIENCE: ${formData.targetAudience}\nLANG: ${formData.language}\nFORCE_VIRAL_HOOK: TRUE\nDYNAMIC_SUBTITLES: ENABLED`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <HoverBorderGradient
                            containerClassName="w-full"
                            className="w-full flex items-center justify-center space-x-2 py-4 text-lg font-medium"
                            onClick={() => window.open('https://flow.veo3.ai', '_blank')}
                        >
                            <span>Ir para o Flow VEO3</span>
                            <Rocket className="w-5 h-5 ml-2" />
                        </HoverBorderGradient>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
            <header className="space-y-4 text-center">
                <div className="inline-flex items-center space-x-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
                    <Rocket className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium uppercase tracking-widest">Viral Creator AI</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-primary to-primary bg-clip-text text-transparent italic">
                    DECOLE SEU CONTEÚDO
                </h1>
                <p className="text-zinc-400 text-lg">
                    O guia definitivo para criar canais dark de alta performance.
                </p>
            </header>

            {/* Stepper Progress */}
            <div className="flex justify-between items-center max-w-2xl mx-auto px-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800 -translate-y-1/2 -z-10" />
                {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isActive = currentStep >= step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center space-y-2">
                            <motion.div
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? '#FF236C' : '#18181b',
                                }}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
                                    isActive ? "border-primary shadow-[0_0_15px_rgba(255,35,108,0.5)]" : "border-zinc-800"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-600")} />
                            </motion.div>
                            <span className={cn(
                                "text-[10px] uppercase tracking-tighter font-bold",
                                isActive ? "text-primary" : "text-zinc-600"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Main Form Container */}
            <div className="bg-black/40 backdrop-blur-xl border border-zinc-800 p-6 sm:p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />

                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>

                {currentStep < 3 && (
                    <div className="flex justify-between pt-8 border-t border-zinc-800 mt-8">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="px-6 py-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !formData.niche) ||
                                (currentStep === 2 && !formData.style)
                            }
                            className="px-8 py-2 bg-zinc-900 border border-zinc-800 hover:border-primary/50 text-white rounded-xl transition-all disabled:opacity-50"
                        >
                            Próximo
                        </button>
                    </div>
                )}
            </div>

            {/* Aesthetic TikTok Glow Footer */}
            <div className="flex justify-center">
                <div className="px-6 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#FF236C]" />
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                        AI-Powered Viral Content Strategy Engine
                    </span>
                </div>
            </div>
        </div>
    );
}
