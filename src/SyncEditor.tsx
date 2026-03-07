import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LoadingOverlay } from './components/ui/loading-overlay';
import confetti from 'canvas-confetti';

interface TextOverlay {
  id: string;
  text: string;
  font: string;
  size: number;
  color: string;
  position: 'topo' | 'centro' | 'base';
  hasStroke: boolean;
  hasBackground: boolean;
}

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
  const icons: Record<string, React.ReactNode> = {
    upload: <React.Fragment><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></React.Fragment>,
    check: <polyline points="20 6 9 17 4 12" />,
    video: <React.Fragment><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></React.Fragment>,
    crop: <React.Fragment><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></React.Fragment>,
    type: <React.Fragment><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></React.Fragment>,
    download: <React.Fragment><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></React.Fragment>,
    x: <React.Fragment><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></React.Fragment>,
    plus: <React.Fragment><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></React.Fragment>,
    trash2: <React.Fragment><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></React.Fragment>,
    maximize: <React.Fragment><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></React.Fragment>,
    alignCenter: <React.Fragment><line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" /></React.Fragment>,
    alignLeft: <React.Fragment><line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="10" x2="3" y2="10" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="15" y1="18" x2="3" y2="18" /></React.Fragment>,
    alignRight: <React.Fragment><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="10" x2="9" y2="10" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="9" y2="18" /></React.Fragment>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    film: <React.Fragment><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></React.Fragment>
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

const SyncEditor: React.FC = () => {
  const { addNotification } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Editor State
  const [cropPosition, setCropPosition] = useState('centro');
  const [roundedCorners, setRoundedCorners] = useState(0);
  const [texts, setTexts] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      addNotification("Vídeo carregado!", "Seu vídeo está pronto para edição.");
      setStep(2);
    }
  };

  const addText = () => {
    const newText: TextOverlay = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'Novo Texto',
      font: 'Inter',
      size: 48,
      color: '#ffffff',
      position: 'centro',
      hasStroke: true,
      hasBackground: false
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  };

  const updateText = (id: string, updates: Partial<TextOverlay>) => {
    setTexts(texts.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeText = (id: string) => {
    setTexts(texts.filter(t => t.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  const handleExport = async () => {
    setLoading(true);
    // Simulate export progress
    await new Promise(r => setTimeout(r, 3000));
    setLoading(false);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#DEDEDE', '#DEDEDE']
    });
    addNotification("Vídeo exportado!", "O download começará em instantes.");
    // In a real app, this would trigger a download of the processed video
  };

  const selectedText = texts.find(t => t.id === selectedTextId);

  return (
    <div style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto", display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "80px" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", letterSpacing: "-0.025em" }}>Creator Editor</h1>
        <p style={{ color: "#71717a" }}>Adicione textos e edite o enquadramento do seu vídeo</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", alignSelf: "center", paddingLeft: "12px", paddingRight: "12px", paddingTop: "4px", paddingBottom: "4px", backgroundColor: "#09090B", border: "1px solid #27272a", borderRadius: "9999px", fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>
          <Icon name="shield" size={12} style={{ color: "#10b981" }} /> Processamento Local • Sem Armazenamento
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", maxWidth: "28rem", marginLeft: "auto", marginRight: "auto" }}>
        {[
          { id: 1, label: 'Upload', icon: 'upload' },
          { id: 2, label: 'Área', icon: 'crop' },
          { id: 3, label: 'Texto', icon: 'type' },
          { id: 4, label: 'Download', icon: 'download' },
        ].map((s) => (
          <React.Fragment key={s.id}>
            <button
              onClick={() => videoFile && setStep(s.id)}
              disabled={!videoFile && s.id > 1}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s",
                background: "none",
                border: "none",
                cursor: videoFile || s.id === 1 ? "pointer" : "not-allowed",
                opacity: !videoFile && s.id > 1 ? 0.5 : 1,
                color: step === s.id ? "#DEDEDE" : step > s.id ? "#10b981" : "#52525b"
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid",
                transition: "all 0.2s",
                borderColor: step === s.id ? "#DEDEDE" : step > s.id ? "#10b981" : "#27272a",
                backgroundColor: step === s.id ? "rgba(222, 222, 222, 0.1)" : step > s.id ? "rgba(16, 185, 129, 0.1)" : "transparent"
              }}>
                {step > s.id ? <Icon name="check" size={18} /> : <Icon name={s.icon} size={18} />}
              </div>
              <span style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</span>
            </button>
            {s.id < 4 && (
              <div style={{
                width: "32px",
                height: "1px",
                marginBottom: "24px",
                backgroundColor: step > s.id ? "#10b981" : "#27272a"
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: "36rem", marginLeft: "auto", marginRight: "auto", width: "100%" }}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                aspectRatio: "16/9",
                borderRadius: "24px",
                border: "2px dashed #27272a",
                backgroundColor: "rgba(9, 9, 11, 0.5)",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                cursor: "pointer",
                padding: "24px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(9, 9, 11, 1)";
                e.currentTarget.style.borderColor = "rgba(222, 222, 222, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(9, 9, 11, 0.5)";
                e.currentTarget.style.borderColor = "#27272a";
              }}
            >
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "#DEDEDE" }}>
                <Icon name="upload" size={32} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>Arraste seu vídeo aqui ou clique para selecionar</p>
                <p style={{ fontSize: "14px", color: "#71717a", marginTop: "4px" }}>Suportados: MP4, MOV, WEBM, AVI</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="video/*"
                hidden
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              lgGridTemplateColumns: "1fr 1fr" as any,
              gap: "32px"
            }}
          >
            {/* Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #27272a", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Enquadramento</h3>
                  <p style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>Canvas final sempre 1080×1920 (9:16)</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Posições Predefinidas</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {['Tela cheia', 'Centro', 'Topo', 'Base', 'Esquerda', 'Direita'].map(pos => (
                      <button
                        key={pos}
                        onClick={() => setCropPosition(pos.toLowerCase())}
                        style={{
                          padding: "8px",
                          borderRadius: "12px",
                          border: "1px solid",
                          borderColor: cropPosition === pos.toLowerCase() ? "#DEDEDE" : "#27272a",
                          backgroundColor: cropPosition === pos.toLowerCase() ? "rgba(222, 222, 222, 0.1)" : "transparent",
                          color: cropPosition === pos.toLowerCase() ? "#DEDEDE" : "white",
                          fontSize: "10px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          transition: "all 0.2s",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => cropPosition !== pos.toLowerCase() && (e.currentTarget.style.borderColor = "#3f3f46")}
                        onMouseLeave={(e) => cropPosition !== pos.toLowerCase() && (e.currentTarget.style.borderColor = "#27272a")}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Cantos Arredondados</p>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>{roundedCorners}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={roundedCorners}
                    onChange={(e) => setRoundedCorners(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "#DEDEDE" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Eixo X</label>
                    <input type="number" defaultValue={0} style={{ width: "100%", padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid #27272a", borderRadius: "12px", fontSize: "14px", color: "white", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Eixo Y</label>
                    <input type="number" defaultValue={0} style={{ width: "100%", padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid #27272a", borderRadius: "12px", fontSize: "14px", color: "white", outline: "none" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              {/* Shine border wrapper */}
              <div style={{ position: "relative", display: "inline-block", borderRadius: "28px" }}>
                {/* Shine border effect */}
                <div style={{
                  position: "absolute",
                  inset: -3,
                  borderRadius: 31,
                  padding: 3,
                  background: "radial-gradient(transparent, transparent, #DEDEDE, #a855f7, #06b6d4, transparent, transparent)",
                  backgroundSize: "300% 300%",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  animation: "shine 3s infinite linear",
                  pointerEvents: "none",
                  zIndex: 10,
                }} />
                <div style={{
                  aspectRatio: "9/16",
                  width: "240px",
                  backgroundColor: "black",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}>
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: `${roundedCorners}px` }}
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", opacity: 0.4 }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><path d="m10 8 8 4-8 4V8z" />
                        </svg>
                        <p style={{ color: "white", fontSize: "12px", textAlign: "center" }}>Prévia do Vídeo</p>
                      </div>
                    </div>
                  )}
                  <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none", zIndex: 5 }} />
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "#71717a", fontWeight: "medium" as any }}>Preview do Enquadramento</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              lgGridTemplateColumns: "1fr 1fr" as any,
              gap: "32px"
            }}
          >
            {/* Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ padding: "24px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #27272a", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Caixas de Texto</h3>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(222, 222, 222, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addText}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      backgroundColor: "#DEDEDE",
                      color: "#050505",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon name="plus" size={14} /> Adicionar
                  </motion.button>
                </div>

                {texts.length === 0 ? (
                  <div style={{ paddingTop: "48px", paddingBottom: "48px", textAlign: "center", border: "2px dashed #27272a", borderRadius: "16px" }}>
                    <p style={{ fontSize: "14px", color: "#71717a" }}>Nenhum texto adicionado ainda.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {texts.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTextId(t.id)}
                        style={{
                          width: "100%",
                          padding: "16px",
                          borderRadius: "12px",
                          border: "1px solid",
                          borderColor: selectedTextId === t.id ? "#DEDEDE" : "#27272a",
                          backgroundColor: selectedTextId === t.id ? "rgba(222, 222, 222, 0.05)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "all 0.2s",
                          cursor: "pointer",
                          color: "white"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Icon name="type" size={16} style={{ color: selectedTextId === t.id ? "#DEDEDE" : "#71717a" }} />
                          <span style={{ fontSize: "14px", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px" }}>{t.text}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>{t.position}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeText(t.id); }}
                            style={{ padding: "6px", color: "#71717a", background: "none", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#71717a"}
                          >
                            <Icon name="trash2" size={14} />
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ paddingTop: "24px", borderTop: "1px solid #27272a", display: "flex", flexDirection: "column", gap: "24px" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Conteúdo</label>
                      <textarea
                        value={selectedText.text}
                        onChange={(e) => updateText(selectedText.id, { text: e.target.value })}
                        style={{ width: "100%", padding: "16px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid #27272a", borderRadius: "12px", fontSize: "14px", color: "white", outline: "none", resize: "none" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Tipografia</label>
                        <select
                          value={selectedText.font}
                          onChange={(e) => updateText(selectedText.id, { font: e.target.value })}
                          style={{ width: "100%", padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid #27272a", borderRadius: "12px", fontSize: "14px", color: "white", outline: "none" }}
                        >
                          {['Inter', 'Roboto', 'Montserrat', 'Oswald', 'Bebas Neue'].map(f => (
                            <option key={f} value={f} style={{ backgroundColor: "#050505" }}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Posição</label>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {(['topo', 'centro', 'base'] as const).map(p => (
                            <button
                              key={p}
                              onClick={() => updateText(selectedText.id, { position: p })}
                              style={{
                                flex: 1,
                                paddingTop: "8px",
                                paddingBottom: "8px",
                                borderRadius: "8px",
                                border: "1px solid",
                                borderColor: selectedText.position === p ? "#DEDEDE" : "#27272a",
                                backgroundColor: selectedText.position === p ? "rgba(222, 222, 222, 0.1)" : "transparent",
                                color: selectedText.position === p ? "#DEDEDE" : "white",
                                fontSize: "10px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                transition: "all 0.2s",
                                cursor: "pointer"
                              }}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Tamanho</label>
                        <span style={{ fontSize: "12px", fontWeight: "bold" }}>{selectedText.size}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="120"
                        value={selectedText.size}
                        onChange={(e) => updateText(selectedText.id, { size: parseInt(e.target.value) })}
                        style={{ width: "100%", accentColor: "#DEDEDE" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {['#ffffff', '#000000', '#FF236C', '#ffff00', '#ff00ff', '#8000ff'].map(c => (
                        <button
                          key={c}
                          onClick={() => updateText(selectedText.id, { color: c })}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "2px solid",
                            borderColor: selectedText.color === c ? "white" : "transparent",
                            transform: selectedText.color === c ? "scale(1.1)" : "scale(1)",
                            transition: "all 0.2s",
                            backgroundColor: c,
                            cursor: "pointer"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div style={{
                aspectRatio: "9/16",
                width: "100%",
                maxWidth: "320px",
                backgroundColor: "black",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}>
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                    y: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}
                />
                {videoUrl && (
                  <video
                    src={videoUrl}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    autoPlay
                    muted
                    loop
                  />
                )}

                {/* Text Overlays */}
                {texts.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      pointerEvents: "none",
                      top: t.position === 'topo' ? "40px" : t.position === 'centro' ? "50%" : "auto",
                      bottom: t.position === 'base' ? "40px" : "auto",
                      transform: t.position === 'centro' ? "translateY(-50%)" : "none"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: t.font,
                        fontSize: `${t.size / 3}px`,
                        color: t.color,
                        textShadow: t.hasStroke ? '0 0 5px rgba(0,0,0,0.8)' : 'none',
                        backgroundColor: t.hasBackground ? 'rgba(0,0,0,0.5)' : 'transparent',
                        padding: t.hasBackground ? '4px 8px' : '0',
                        borderRadius: '4px',
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "-0.025em"
                      }}
                    >
                      {t.text}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "#71717a", fontWeight: "medium" as any }}>Preview com Vídeo Real</p>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", display: "flex", flexDirection: "column", gap: "32px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
              <div style={{
                aspectRatio: "9/16",
                width: "100%",
                maxWidth: "280px",
                backgroundColor: "black",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}>
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                    y: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}
                />
                {videoUrl && <video src={videoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} autoPlay muted loop />}
                {texts.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      pointerEvents: "none",
                      top: t.position === 'topo' ? "40px" : t.position === 'centro' ? "50%" : "auto",
                      bottom: t.position === 'base' ? "40px" : "auto",
                      transform: t.position === 'centro' ? "translateY(-50%)" : "none"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: t.font,
                        fontSize: `${t.size / 3}px`,
                        color: t.color,
                        textShadow: '0 0 5px rgba(0,0,0,0.8)',
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "-0.025em"
                      }}
                    >
                      {t.text}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", width: "100%" }}>
                <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#09090B", border: "1px solid #27272a", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Icon name="shield" size={20} style={{ color: "#10b981" }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "bold" }}>100% Privado</p>
                    <p style={{ fontSize: "10px", color: "#71717a" }}>Vídeo processado localmente</p>
                  </div>
                </div>
                <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#09090B", border: "1px solid #27272a", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Icon name="plus" size={20} style={{ color: "#DEDEDE" }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "bold" }}>Alta Qualidade</p>
                    <p style={{ fontSize: "10px", color: "#71717a" }}>Export em resolução original</p>
                  </div>
                </div>
                <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#09090B", border: "1px solid #27272a", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Icon name="type" size={20} style={{ color: "#8b5cf6" }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "bold" }}>Formato MP4</p>
                    <p style={{ fontSize: "10px", color: "#71717a" }}>Compatível com TikTok</p>
                  </div>
                </div>
              </div>

              <div style={{ width: "100%", maxWidth: "28rem", display: "flex", flexDirection: "column", gap: "16px" }}>
                {loading ? (
                  <div style={{ padding: "32px", borderRadius: "24px", backgroundColor: "#09090B", border: "1px solid #27272a" }}>
                    <LoadingOverlay message="Processando vídeo..." />
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(222, 222, 222, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    style={{
                      width: "100%",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      backgroundColor: "#DEDEDE",
                      color: "#050505",
                      fontSize: "20px",
                      fontWeight: 900,
                      fontStyle: "italic",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderRadius: "9999px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Icon name="download" size={24} /> Exportar Vídeo
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SyncEditor;
