import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { AVATARS, Product } from './types';
import { LoadingOverlay } from './components/ui/loading-overlay';
import confetti from 'canvas-confetti';

const Icon = ({ name, size = 16, ...props }: { name: string, size?: number } & React.SVGProps<SVGSVGElement>) => {
  const icons: Record<string, React.ReactNode> = {
    check: <polyline points="20 6 9 17 4 12" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    plus: <React.Fragment><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></React.Fragment>,
    camera: <React.Fragment><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></React.Fragment>,
    user: <React.Fragment><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></React.Fragment>,
    mic: <React.Fragment><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></React.Fragment>,
    clock: <React.Fragment><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></React.Fragment>,
    smile: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></React.Fragment>,
    volume: <React.Fragment><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></React.Fragment>,
    refresh: <React.Fragment><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></React.Fragment>,
    copy: <React.Fragment><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></React.Fragment>,
    download: <React.Fragment><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></React.Fragment>,
    external: <React.Fragment><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></React.Fragment>,
    sparkles: <React.Fragment><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" /></React.Fragment>,
    wand: <React.Fragment><line x1="18" y1="2" x2="22" y2="6" /><line x1="2" y1="22" x2="16" y2="8" /><path d="M2 2v4h4" /><path d="M18 18v4h4" /><path d="M18 4h.01" /><path d="M22 8h.01" /><path d="M16 2h.01" /><path d="M4 18h.01" /><path d="M8 22h.01" /></React.Fragment>,
    file: <React.Fragment><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></React.Fragment>,
    x: <React.Fragment><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></React.Fragment>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    clapperboard: <React.Fragment><path d="M20.2 6 3 11l-.9-2.4 17.2-5z" /><rect x="2" y="8" width="20" height="14" rx="2" /></React.Fragment>,
    home: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    trees: <React.Fragment><path d="M10 22v-6.5" /><path d="M8 22v-4.5" /><path d="M12 22v-3.5" /><path d="M20 22v-5" /><path d="M18 22v-3" /><path d="M16 22v-4" /><path d="M14 22v-3" /><path d="M10 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M18 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></React.Fragment>,
    store: <React.Fragment><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></React.Fragment>,
    pen: <React.Fragment><path d="m11 15 3 3L22 8l-3-3L11 15Z" /><path d="m11 15-3 3h3l8-8-3-3-8 8Z" /><path d="m9 22 2-2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></React.Fragment>,
    cloud: <path d="M17.5 19c3.037 0 5.5-2.463 5.5-5.5a5.5 5.5 0 0 0-5.5-5.5c-.32 0-.63.027-.93.08a7 7 0 0 0-13.57 2.42A4.5 4.5 0 0 0 1 15.5C1 17.433 2.567 19 4.5 19h13Z" />,
    alert: <React.Fragment><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></React.Fragment>,
    laugh: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="M18 13.5c-1 2.5-3 4-6 4s-5-1.5-6-4" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></React.Fragment>,
    play: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="m10 8 8 4-8 4V8z" /></React.Fragment>,
    shoppingCart: <React.Fragment><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></React.Fragment>
  };

  const content = icons[name] || null;
  if (!content) return null;

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
      {...props}
    >
      {content}
    </svg>
  );
};

const IphoneMockup = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    width: "280px",
    height: "560px",
    background: "#141414",
    borderRadius: "40px",
    border: "8px solid #27272a",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column"
  }}>
    <div style={{
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "120px",
      height: "25px",
      background: "#27272a",
      borderBottomLeftRadius: "15px",
      borderBottomRightRadius: "15px",
      zIndex: 20
    }} />
    <div style={{
      flex: 1,
      padding: "20px",
      paddingTop: "40px",
      overflowY: "auto",
      fontSize: "10px",
      lineHeight: "1.4",
      color: "#a1a1aa",
      fontFamily: "monospace",
      backgroundColor: "#050505"
    }}>
      {children}
    </div>
    <div style={{
      height: "5px",
      width: "80px",
      background: "#3f3f46",
      margin: "10px auto",
      borderRadius: "10px",
      flexShrink: 0
    }} />
  </div>
);

const CreatorLab: React.FC = () => {
  const { products, favorites, addNotification } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [showRadarModal, setShowRadarModal] = useState(false);

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
      colors: ['#DEDEDE', '#141414', '#ffffff']
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
      colors: ['#DEDEDE']
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (loading) return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><LoadingOverlay message={loadingMessage} /></div>;

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "896px", margin: "0 auto", paddingBottom: "80px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.05em", textTransform: "uppercase", margin: 0 }}>Resultado Final</h1>
          <button onClick={() => setResult(null)} style={{ color: "#71717a", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "bold" }}>
            <Icon name="refresh" size={16} /> Refazer
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#09090B", border: "1px solid #141414", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", border: "1px solid #141414" }}>
              <img src={selectedProduct?.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", margin: 0 }}>Produto Selecionado</p>
              <p style={{ fontWeight: "bold", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedProduct?.name}</p>
              <button style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer" }}>
                <Icon name="download" size={10} /> Baixar imagem
              </button>
            </div>
          </div>

          <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#09090B", border: "1px solid #141414", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", border: "1px solid #141414", backgroundColor: "#141414", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selectedAvatar ? (
                <img src={selectedAvatar.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Icon name="user" size={24} style={{ color: "#3f3f46" }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", margin: 0 }}>Avatar do Vídeo</p>
              <p style={{ fontWeight: "bold", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedAvatar?.name || 'Nenhum'}</p>
              {selectedAvatar && (
                <button style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer" }}>
                  <Icon name="download" size={10} /> Baixar imagem
                </button>
              )}
            </div>
          </div>
        </div>

        {/* iPhone Mockup Integration */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginBottom: "16px" }}>Preview do Script</p>
          <IphoneMockup>
            <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
          </IphoneMockup>
        </div>

        <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="file" size={20} style={{ color: "#DEDEDE" }} />
              Prompt Gerado
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleCopy(result || "")}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: "#141414", border: "1px solid #27272a", borderRadius: "99px", fontSize: "12px", fontWeight: "bold", color: "white", cursor: "pointer" }}
              >
                <Icon name="copy" size={14} /> Copiar
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", backgroundColor: "#141414", border: "1px solid #27272a", borderRadius: "99px", fontSize: "12px", fontWeight: "bold", color: "white", cursor: "pointer" }}>
                <Icon name="refresh" size={14} /> Nova Variação
              </button>
            </div>
          </div>
          <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid #141414", fontFamily: "monospace", fontSize: "12px", color: "#d4d4d8", whiteSpace: "pre-wrap", maxHeight: "384px", overflowY: "auto" }}>
            {result}
          </div>
        </div>

        <div style={{ padding: "32px", borderRadius: "24px", backgroundColor: "#141414", color: "white", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", marginBottom: "16px" }}>Crie o vídeo com IA</h2>
          <p style={{ fontSize: "14px", fontWeight: "500", opacity: 0.9, maxWidth: "448px", margin: "0 auto 32px" }}>
            Agora que você tem o prompt perfeito, use o Flow VEO3 do Google para gerar o vídeo em alta qualidade.
          </p>
          <button
            onClick={() => window.open('https://labs.google/fx/pt/tools/flow', '_blank')}
            style={{ padding: "16px 32px", backgroundColor: "#DEDEDE", color: "#050505", fontWeight: 900, border: "none", borderRadius: "99px", display: "inline-flex", alignItems: "center", gap: "12px", cursor: "pointer", transition: "all 0.2s" }}
          >
            Abrir Flow VEO3 <Icon name="external" size={20} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: "896px", margin: "0 auto", paddingBottom: "80px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", letterSpacing: "-0.0125em" }}>Creator Editor</h1>
            <p style={{ color: "#a1a1aa", marginTop: "4px" }}>Crie roteiros e prompts virais otimizados para IA.</p>
          </div>

          {/* Stepper */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {[1, 2, 3, 4].map((s) => (
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
                  backgroundColor: step === s ? "#DEDEDE" : step > s ? "#10b981" : "#141414",
                  color: step === s ? "#050505" : "white",
                  boxShadow: step === s ? "0 10px 15px -3px rgba(222, 222, 222, 0.3)" : "none"
                }}>
                  {step > s ? <Icon name="check" size={14} /> : s}
                </div>
                {s < 4 && <div style={{ width: "16px", height: "1px", backgroundColor: step > s ? "#10b981" : "#141414" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Pergunta 1: Produto */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414", marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>1</span>
                  Selecionar um produto
                </h3>
                <button
                  onClick={() => setShowRadarModal(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer"
                  }}
                >
                  <Icon name="search" size={14} /> Escolher do radar
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
                {favoriteProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    style={{
                      aspectRatio: "1/1",
                      borderRadius: "16px",
                      border: "2px solid",
                      borderColor: selectedProductId === p.id ? "#DEDEDE" : "#141414",
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      background: "none"
                    }}
                  >
                    <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {selectedProductId === p.id && (
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(222, 222, 222, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ backgroundColor: "#DEDEDE", borderRadius: "50%", padding: "4px", color: "#050505" }}><Icon name="check" size={16} /></div>
                      </div>
                    )}
                  </button>
                ))}
                <button
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: "16px",
                    border: "2px dashed #141414",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    color: "#71717a",
                    background: "none",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <Icon name="plus" size={24} />
                  <span style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Adicionar</span>
                </button>
              </div>
            </div>

            {/* Pergunta 2: Cenário */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>2</span>
                Cenário do vídeo (opcional)
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                {[
                  { id: 'estudio', label: 'Estúdio Profissional', icon: 'clapperboard' },
                  { id: 'casa', label: 'Ambiente de Casa', icon: 'home' },
                  { id: 'externo', label: 'Ambiente Externo', icon: 'trees' },
                  { id: 'loja', label: 'Loja Física', icon: 'store' },
                  { id: 'minimalista', label: 'Minimalista', icon: 'sparkles' },
                  { id: 'personalizado', label: 'Personalizado', icon: 'pen' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScenario(item.id)}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid",
                      borderColor: scenario === item.id ? "#DEDEDE" : "#141414",
                      backgroundColor: scenario === item.id ? "rgba(222, 222, 222, 0.05)" : "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      color: "white"
                    }}
                  >
                    <Icon name={item.icon} size={24} style={{ color: scenario === item.id ? "#DEDEDE" : "#71717a" }} />
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>{item.label}</span>
                  </button>
                ))}
              </div>
              {scenario === 'personalizado' && (
                <textarea
                  placeholder="Descreva o cenário desejado..."
                  value={customScenario}
                  onChange={(e) => setCustomScenario(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    border: "1px solid #141414",
                    borderRadius: "16px",
                    fontSize: "14px",
                    color: "white",
                    outline: "none",
                    minHeight: "100px"
                  }}
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
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Pergunta 1: Estilo de Câmera */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>3</span>
                Estilo de câmera
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                {[
                  { id: 'avatar', label: 'Avatar Visual', desc: 'Um personagem digital apresenta o produto.', icon: 'user' },
                  { id: 'pov', label: 'POV (Ponto de Vista)', desc: 'Visão em primeira pessoa mostrando o uso.', icon: 'camera' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCameraStyle(item.id)}
                    style={{
                      padding: "24px",
                      borderRadius: "24px",
                      border: "2px solid",
                      borderColor: cameraStyle === item.id ? "#DEDEDE" : "#141414",
                      backgroundColor: cameraStyle === item.id ? "rgba(222, 222, 222, 0.05)" : "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "12px",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "white"
                    }}
                  >
                    <div style={{
                      padding: "12px",
                      borderRadius: "16px",
                      backgroundColor: cameraStyle === item.id ? "#DEDEDE" : "#141414",
                      color: cameraStyle === item.id ? "#050505" : "#71717a",
                      display: "flex"
                    }}>
                      <Icon name={item.icon} size={24} />
                    </div>
                    <div>
                      <p style={{ fontWeight: "bold", margin: 0 }}>{item.label}</p>
                      <p style={{ fontSize: "12px", color: "#71717a", marginTop: "4px", margin: 0 }}>{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 2: Avatares */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>4</span>
                Escolha um avatar
              </h3>
              <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px" }}>
                <button
                  onClick={() => setSelectedAvatarId(null)}
                  style={{
                    flexShrink: 0,
                    width: "96px",
                    height: "128px",
                    borderRadius: "16px",
                    border: "2px solid",
                    borderColor: selectedAvatarId === null ? "#DEDEDE" : "#141414",
                    backgroundColor: selectedAvatarId === null ? "rgba(222, 222, 222, 0.05)" : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    color: "white"
                  }}
                >
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#141414", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>
                    <Icon name="x" size={20} />
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Nenhum</span>
                </button>
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatarId(avatar.id)}
                    style={{
                      flexShrink: 0,
                      width: "96px",
                      height: "128px",
                      borderRadius: "16px",
                      border: "2px solid",
                      borderColor: selectedAvatarId === avatar.id ? "#DEDEDE" : "#141414",
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      background: "none"
                    }}
                  >
                    <img src={avatar.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px" }}>
                      <p style={{ fontSize: "10px", fontWeight: "bold", color: "white", textAlign: "center", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{avatar.name}</p>
                    </div>
                    {selectedAvatarId === avatar.id && (
                      <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#DEDEDE", borderRadius: "50%", padding: "2px", color: "#050505" }}>
                        <Icon name="check" size={10} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 3: Duração */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>5</span>
                Duração do vídeo
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px" }}>
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
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid",
                      borderColor: duration === item.id ? "#DEDEDE" : "#141414",
                      backgroundColor: duration === item.id ? "rgba(222, 222, 222, 0.05)" : "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      color: "white"
                    }}
                  >
                    <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>{item.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 900 }}>{item.time}</span>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "10px", color: "#71717a", fontStyle: "italic", marginTop: "16px" }}>* Vídeos mais curtos tendem a ter maior retenção no TikTok.</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Pergunta 1: Mood */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>6</span>
                Tom da fala
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                {[
                  { id: 'animado', label: 'Animado', icon: 'star' },
                  { id: 'calmo', label: 'Calmo', icon: 'cloud' },
                  { id: 'urgente', label: 'Urgente', icon: 'alert' },
                  { id: 'divertido', label: 'Divertido', icon: 'laugh' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMood(item.id)}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid",
                      borderColor: mood === item.id ? "#DEDEDE" : "#141414",
                      backgroundColor: mood === item.id ? "rgba(222, 222, 222, 0.05)" : "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      color: "white"
                    }}
                  >
                    <Icon name={item.icon} size={24} style={{ color: mood === item.id ? "#DEDEDE" : "#71717a" }} />
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 2: Voz */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>7</span>
                Tipo de voz
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { id: 'feminina', label: 'Feminina', icon: 'volume' },
                  { id: 'masculina', label: 'Masculina', icon: 'volume' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setVoiceType(item.id)}
                    style={{
                      padding: "24px",
                      borderRadius: "24px",
                      border: "2px solid",
                      borderColor: voiceType === item.id ? "#DEDEDE" : "#141414",
                      backgroundColor: voiceType === item.id ? "rgba(222, 222, 222, 0.05)" : "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      color: "white"
                    }}
                  >
                    <div style={{
                      padding: "12px",
                      borderRadius: "16px",
                      backgroundColor: voiceType === item.id ? "#DEDEDE" : "#141414",
                      color: voiceType === item.id ? "#050505" : "#71717a",
                      display: "flex"
                    }}>
                      <Icon name={item.icon} size={24} />
                    </div>
                    <span style={{ fontWeight: "bold" }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 3: Tonalidade */}
            <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(222, 222, 222, 0.1)", color: "#DEDEDE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>8</span>
                Tonalidade da voz
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}>
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
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid",
                      borderColor: tonality === item.id ? "#DEDEDE" : "#141414",
                      backgroundColor: tonality === item.id ? "rgba(222, 222, 222, 0.05)" : "transparent",
                      fontSize: "12px",
                      fontWeight: "bold",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      color: "white"
                    }}
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
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            <div style={{ padding: "32px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.05em", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <Icon name="check" size={28} style={{ color: "#10b981" }} />
                Revisão Final
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                {[
                  { label: 'Produto', value: selectedProduct?.name || 'Não selecionado', icon: 'shoppingCart' },
                  { label: 'Cenário', value: scenario === 'personalizado' ? customScenario : scenario, icon: 'camera' },
                  { label: 'Estilo', value: cameraStyle === 'avatar' ? 'Avatar Visual' : 'POV', icon: 'camera' },
                  { label: 'Avatar', value: selectedAvatar?.name || 'Nenhum', icon: 'user' },
                  { label: 'Duração', value: duration, icon: 'clock' },
                  { label: 'Mood', value: mood, icon: 'smile' },
                  { label: 'Voz', value: `${voiceType} (${tonality})`, icon: 'volume' },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "16px", backgroundColor: "#050505", border: "1px solid #141414" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Icon name={item.icon} size={18} style={{ color: "#71717a" }} />
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: "14px", fontWeight: "bold", color: "#e4e4e7", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{item.value}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(i < 2 ? 1 : i < 5 ? 2 : 3)}
                      style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGeneratePrompt}
                disabled={!selectedProductId}
                className="rainbow-btn"
                style={{
                  width: "100%",
                  padding: "20px",
                  borderRadius: "20px",
                  fontWeight: 900,
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  fontSize: "20px",
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  minWidth: "unset",
                }}
              >
                Gerar Roteiro <Icon name="wand" size={24} />
              </button>
              {!selectedProductId && <p style={{ textAlign: "center", fontSize: "12px", color: "#ef4444", fontWeight: "bold", marginTop: "12px" }}>Selecione um produto para continuar.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px" }}>
        <button
          onClick={prevStep}
          disabled={step === 1}
          style={{
            padding: "12px 24px",
            borderRadius: "99px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            backgroundColor: "#141414",
            color: "white",
            opacity: step === 1 ? 0 : 1,
            pointerEvents: step === 1 ? "none" : "auto"
          }}
        >
          <Icon name="chevronLeft" size={20} /> Voltar
        </button>

        {step < 4 && (
          <button
            onClick={nextStep}
            style={{
              padding: "12px 32px",
              borderRadius: "99px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor: "#DEDEDE",
              color: "#050505",
              boxShadow: "0 10px 15px -3px rgba(222, 222, 222, 0.2)"
            }}
          >
            Próximo <Icon name="chevronRight" size={20} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showRadarModal && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)"
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                width: "100%", maxWidth: "600px", background: "#09090B",
                borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", flexDirection: "column", maxHeight: "80vh", overflow: "hidden"
              }}
            >
              <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Escolher produto</h2>
                <button onClick={() => setShowRadarModal(false)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer" }}>
                  <Icon name="x" size={20} />
                </button>
              </div>
              <div style={{ padding: "20px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {products.map(product => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setShowRadarModal(false);
                    }}
                    style={{
                      background: "rgba(255,255,255,0.03)", borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.06)", padding: "12px",
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  >
                    <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", marginBottom: "12px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={product.image_url || product.imageUrl || product.image || ""}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={(e: any) => {
                          e.target.style.display = "none";
                          const fallback = document.createElement('div');
                          fallback.textContent = product.emoji || "📦";
                          fallback.style.fontSize = "32px";
                          e.target.parentNode.appendChild(fallback);
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px 0", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", color: "#71717a", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>{product.category}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#10b981" }}>{product.priceText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatorLab;
