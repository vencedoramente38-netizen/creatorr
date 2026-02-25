import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Camera,
  User,
  Mic,
  Clock,
  Smile,
  Volume2,
  Type,
  RefreshCw,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
  Search,
  Wand2,
  FileText,
  X,
  ShoppingCart,
  Clapperboard,
  Home,
  Trees,
  Store,
  PenTool,
  Star,
  Cloud,
  AlertCircle,
  Laugh
} from 'lucide-react';
import { cn } from './lib/utils';
import { AVATARS, Product } from './types';
import { LoadingOverlay } from './components/ui/loading-overlay';
import confetti from 'canvas-confetti';

const CreatorLab: React.FC = () => {
  const { products, favorites, addNotification } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<string | null>(null);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [scenario, setScenario] = useState('estudio');
  const [customScenario, setCustomScenario] = useState('');
  const [cameraStyle, setCameraStyle] = useState('avatar');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState('');
  const [duration, setDuration] = useState('16s');
  const [mood, setMood] = useState('animado');
  const [voiceType, setVoiceType] = useState('feminina');
  const [tonality, setTonality] = useState('medio');
  const [speech, setSpeech] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId);

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const handleGeneratePrompt = async () => {
    setLoading(true);
    setLoadingMessage('Otimizando prompt...');

    // Simulate generation steps
    await new Promise(r => setTimeout(r, 1500));
    setLoadingMessage('Gerando prompt otimizado para V03...');
    await new Promise(r => setTimeout(r, 2000));

    const prompt = `[V03 PROMPT]
OBJETIVO: Vídeo de alta conversão para TikTok Shop.
PRODUTO: ${selectedProduct?.name}
ESTILO: ${cameraStyle === 'avatar' ? 'Avatar Visual' : 'POV (Ponto de Vista)'}
CENÁRIO: ${scenario === 'personalizado' ? customScenario : scenario}
AVATAR: ${selectedAvatar?.name || 'Nenhum'}
DURAÇÃO: ${duration}
MOOD: ${mood}

ROTEIRO ESTRUTURADO:
0-3s: GANCHO - ${mood === 'urgente' ? 'PARE TUDO! Você precisa ver isso.' : 'Finalmente encontrei o segredo para...'}
3-10s: PROBLEMA/SOLUÇÃO - Mostra o ${selectedProduct?.name} em ação no cenário ${scenario}.
10-20s: BENEFÍCIOS - Close-ups detalhados, narração ${voiceType} em tom ${tonality}.
20-30s: CTA - Clique no link abaixo para garantir o seu com desconto.

INSTRUÇÕES DE EDIÇÃO:
- Cortes rápidos no ritmo da música.
- Legendas dinâmicas em cores TikTok (Rosa/Branco).
- Zoom in/out suave para manter retenção.`;

    setResult(prompt);
    setLoading(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF236C', '#FF236C', '#ffffff']
    });
    addNotification("Prompt gerado!", "Seu prompt V03 está pronto para uso.");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification("Copiado!", "Conteúdo copiado para a área de transferência.");
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#FF236C']
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingOverlay message={loadingMessage} /></div>;

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8 pb-20"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Resultado Final</h1>
          <button onClick={() => setResult(null)} className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold">
            <RefreshCw size={16} /> Refazer
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#09090B] border border-primary/30 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={40} className="text-primary" />
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-800">
              <img src={selectedProduct?.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Produto Selecionado</p>
              <p className="font-bold truncate">{selectedProduct?.name}</p>
              <button className="text-[10px] font-bold text-primary mt-1 flex items-center gap-1 hover:underline">
                <Download size={10} /> Baixar imagem
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#09090B] border border-primary/30 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={40} className="text-primary" />
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-800 flex items-center justify-center">
              {selectedAvatar ? (
                <img src={selectedAvatar.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-zinc-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Avatar do Vídeo</p>
              <p className="font-bold truncate">{selectedAvatar?.name || 'Nenhum'}</p>
              {selectedAvatar && (
                <button className="text-[10px] font-bold text-primary mt-1 flex items-center gap-1 hover:underline">
                  <Download size={10} /> Baixar imagem
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Prompt Gerado
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(result)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs font-bold transition-all"
              >
                <Copy size={14} /> Copiar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs font-bold transition-all">
                <RefreshCw size={14} /> Nova Variação
              </button>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800 font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {result}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-500" />
            Hashtags recomendadas
          </h3>
          <div className="flex flex-wrap gap-2">
            {['#tiktokshop', '#achadinhos', '#viral', '#review', '#unboxing', '#tiktokmademebuyit'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-300">{tag}</span>
            ))}
            <button
              onClick={() => handleCopy('#tiktokshop #achadinhos #viral #review #unboxing #tiktokmademebuyit')}
              className="ml-auto text-xs font-bold text-primary hover:underline"
            >
              Copiar todas
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-tiktok-gradient text-white flex flex-col items-center text-center space-y-4 shadow-2xl shadow-primary/20">
          <h2 className="text-2xl font-black italic uppercase">Crie o vídeo com IA</h2>
          <p className="text-sm font-medium opacity-90 max-w-md">
            Agora que você tem o prompt perfeito, use o Flow VEO3 do Google para gerar o vídeo em alta qualidade.
          </p>
          <button
            onClick={() => window.open('https://labs.google/fx/pt/tools/flow', '_blank')}
            className="px-8 py-4 bg-white text-black font-black rounded-full flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
          >
            Abrir Flow VEO3 <ExternalLink size={20} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creatoria</h1>
          <p className="text-zinc-400 mt-1">Crie roteiros e prompts virais otimizados para IA.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step === s ? "bg-primary text-white shadow-lg shadow-primary/30" :
                  step > s ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
              )}>
                {step > s ? <Check size={14} /> : s}
              </div>
              {s < 4 && <div className={cn("w-4 h-px", step > s ? "bg-emerald-500" : "bg-zinc-800")} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Pergunta 1: Produto */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                Selecionar um produto
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favoriteProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={cn(
                      "aspect-square rounded-2xl border-2 overflow-hidden relative transition-all group",
                      selectedProductId === p.id ? "border-primary shadow-lg shadow-primary/20" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    {selectedProductId === p.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-1"><Check size={16} /></div>
                      </div>
                    )}
                  </button>
                ))}
                <button
                  className="aspect-square rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-all"
                >
                  <Plus size={24} />
                  <span className="text-[10px] font-bold uppercase">Adicionar</span>
                </button>
              </div>
            </div>

            {/* Pergunta 2: Cenário */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                Cenário do vídeo (opcional)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'estudio', label: 'Estúdio Profissional', icon: Clapperboard },
                  { id: 'casa', label: 'Ambiente de Casa', icon: Home },
                  { id: 'externo', label: 'Ambiente Externo', icon: Trees },
                  { id: 'loja', label: 'Loja Física', icon: Store },
                  { id: 'minimalista', label: 'Minimalista', icon: Sparkles },
                  { id: 'personalizado', label: 'Personalizado', icon: PenTool },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScenario(item.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                      scenario === item.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <item.icon size={24} className={scenario === item.id ? "text-primary" : "text-zinc-500"} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
              {scenario === 'personalizado' && (
                <textarea
                  placeholder="Descreva o cenário desejado..."
                  value={customScenario}
                  onChange={(e) => setCustomScenario(e.target.value)}
                  className="w-full p-4 bg-black/50 border border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Pergunta 1: Estilo de Câmera */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">3</span>
                Estilo de câmera
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'avatar', label: 'Avatar Visual', desc: 'Um personagem digital apresenta o produto.', icon: User },
                  { id: 'pov', label: 'POV (Ponto de Vista)', desc: 'Visão em primeira pessoa mostrando o uso.', icon: Camera },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCameraStyle(item.id)}
                    className={cn(
                      "p-6 rounded-3xl border-2 flex flex-col items-start gap-3 transition-all text-left group",
                      cameraStyle === item.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl transition-all",
                      cameraStyle === item.id ? "bg-primary text-white" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
                    )}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="font-bold">{item.label}</p>
                      <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                    {cameraStyle === item.id && <div className="ml-auto bg-primary rounded-full p-1"><Check size={12} /></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 2: Avatares */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">4</span>
                Escolha um avatar
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <button
                  onClick={() => setSelectedAvatarId(null)}
                  className={cn(
                    "flex-shrink-0 w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                    selectedAvatarId === null ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <X size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase">Nenhum</span>
                </button>
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatarId(avatar.id)}
                    className={cn(
                      "flex-shrink-0 w-24 h-32 rounded-2xl border-2 overflow-hidden relative transition-all",
                      selectedAvatarId === avatar.id ? "border-primary shadow-lg shadow-primary/20" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <img src={avatar.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1">
                      <p className="text-[10px] font-bold text-center truncate">{avatar.name}</p>
                    </div>
                    {selectedAvatarId === avatar.id && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5"><Check size={10} /></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 3: Duração */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">5</span>
                Duração do vídeo
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {[
                  { id: '8s', label: '1 take', time: '8s' },
                  { id: '16s', label: '2 takes', time: '16s' },
                  { id: '24s', label: '3 takes', time: '24s' },
                  { id: '32s', label: '4 takes', time: '32s' },
                  { id: '40s', label: '5 takes', time: '40s' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDuration(item.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all",
                      duration === item.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</span>
                    <span className="text-sm font-black">{item.time}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 italic">* Vídeos mais curtos tendem a ter maior retenção no TikTok.</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Pergunta 1: Mood */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">6</span>
                Tom da fala
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'animado', label: 'Animado', icon: Star },
                  { id: 'calmo', label: 'Calmo', icon: Cloud },
                  { id: 'urgente', label: 'Urgente', icon: AlertCircle },
                  { id: 'divertido', label: 'Divertido', icon: Laugh },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMood(item.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                      mood === item.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <item.icon size={24} className={mood === item.id ? "text-primary" : "text-zinc-500"} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 2: Voz */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">7</span>
                Tipo de voz
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'feminina', label: 'Feminina', icon: Volume2 },
                  { id: 'masculina', label: 'Masculina', icon: Volume2 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setVoiceType(item.id)}
                    className={cn(
                      "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all group",
                      voiceType === item.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl transition-all",
                      voiceType === item.id ? "bg-primary text-white" : "bg-zinc-800 text-zinc-500"
                    )}>
                      <item.icon size={24} />
                    </div>
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 3: Tonalidade */}
            <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">8</span>
                Tonalidade da voz
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'grave', label: 'Grave' },
                  { id: 'medio', label: 'Médio' },
                  { id: 'agudo', label: 'Agudo' },
                  { id: 'doce', label: 'Doce' },
                  { id: 'energetico', label: 'Energético' },
                  { id: 'serio', label: 'Sério' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTonality(item.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-xs font-bold",
                      tonality === item.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="p-8 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-6">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <Check size={28} className="text-emerald-500" />
                Revisão Final
              </h3>

              <div className="space-y-4">
                {[
                  { label: 'Produto', value: selectedProduct?.name || 'Não selecionado', icon: ShoppingCart },
                  { label: 'Cenário', value: scenario === 'personalizado' ? customScenario : scenario, icon: Camera },
                  { label: 'Estilo', value: cameraStyle === 'avatar' ? 'Avatar Visual' : 'POV', icon: Camera },
                  { label: 'Avatar', value: selectedAvatar?.name || 'Nenhum', icon: User },
                  { label: 'Duração', value: duration, icon: Clock },
                  { label: 'Mood', value: mood, icon: Smile },
                  { label: 'Voz', value: `${voiceType} (${tonality})`, icon: Volume2 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-zinc-800/50 group">
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-zinc-500" />
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</p>
                        <p className="text-sm font-bold text-zinc-200 truncate max-w-[200px] sm:max-w-md">{item.value}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(i < 2 ? 1 : i < 5 ? 2 : 3)}
                      className="text-[10px] font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGeneratePrompt}
                disabled={!selectedProductId}
                className={cn(
                  "w-full py-5 rounded-3xl font-black italic uppercase text-xl tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl",
                  selectedProductId
                    ? "bg-tiktok-gradient text-white shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                Gerar Prompt V03 <Wand2 size={24} />
              </button>
              {!selectedProductId && <p className="text-center text-xs text-red-500 font-bold">Selecione um produto para continuar.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={cn(
            "px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all",
            step === 1 ? "opacity-0 pointer-events-none" : "bg-zinc-800 text-white hover:bg-zinc-700"
          )}
        >
          <ChevronLeft size={20} /> Voltar
        </button>

        {step < 4 && (
          <button
            onClick={nextStep}
            className="px-8 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
          >
            Próximo <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatorLab;
