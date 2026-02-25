import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Check, 
  Video, 
  Crop, 
  Type, 
  Download, 
  X, 
  Plus, 
  Trash2, 
  Maximize, 
  AlignCenter, 
  AlignLeft, 
  AlignRight,
  Shield,
  Zap,
  Film
} from 'lucide-react';
import { cn } from './lib/utils';
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
      colors: ['#FF236C', '#FF236C']
    });
    addNotification("Vídeo exportado!", "O download começará em instantes.");
    // In a real app, this would trigger a download of the processed video
  };

  const selectedText = texts.find(t => t.id === selectedTextId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sync Editor</h1>
        <p className="text-zinc-400">Adicione textos e edite o enquadramento do seu vídeo</p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#09090B] border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 uppercase">
          <Shield size={12} className="text-emerald-500" /> Processamento Local • Sem Armazenamento
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
        {[
          { id: 1, label: 'Upload', icon: Upload },
          { id: 2, label: 'Área', icon: Crop },
          { id: 3, label: 'Texto', icon: Type },
          { id: 4, label: 'Download', icon: Download },
        ].map((s) => (
          <React.Fragment key={s.id}>
            <button 
              onClick={() => videoFile && setStep(s.id)}
              disabled={!videoFile && s.id > 1}
              className={cn(
                "flex flex-col items-center gap-2 transition-all",
                step === s.id ? "text-primary" : step > s.id ? "text-emerald-500" : "text-zinc-600",
                !videoFile && s.id > 1 && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                step === s.id ? "border-primary bg-primary/10" : 
                step > s.id ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800"
              )}>
                {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
            </button>
            {s.id < 4 && <div className={cn("w-8 h-px mb-6", step > s.id ? "bg-emerald-500" : "bg-zinc-800")} />}
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
            className="max-w-xl mx-auto"
          >
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video rounded-3xl border-2 border-dashed border-zinc-800 bg-[#09090B]/50 hover:bg-[#09090B] hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">Arraste seu vídeo aqui ou clique para selecionar</p>
                <p className="text-sm text-zinc-500 mt-1">Suportados: MP4, MOV, WEBM, AVI</p>
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Controls */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-6">
                <div>
                  <h3 className="text-lg font-bold">Enquadramento</h3>
                  <p className="text-xs text-zinc-500 mt-1">Canvas final sempre 1080×1920 (9:16)</p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-zinc-500 uppercase">Posições Predefinidas</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Tela cheia', 'Centro', 'Topo', 'Base', 'Esquerda', 'Direita'].map(pos => (
                      <button
                        key={pos}
                        onClick={() => setCropPosition(pos.toLowerCase())}
                        className={cn(
                          "px-3 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all",
                          cropPosition === pos.toLowerCase() ? "border-primary bg-primary/10 text-primary" : "border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Cantos Arredondados</p>
                    <span className="text-xs font-bold">{roundedCorners}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={roundedCorners}
                    onChange={(e) => setRoundedCorners(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Eixo X</label>
                    <input type="number" defaultValue={0} className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Eixo Y</label>
                    <input type="number" defaultValue={0} className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center gap-4">
              <div className="aspect-[9/16] w-full max-w-[320px] bg-black rounded-3xl border border-zinc-800 overflow-hidden relative shadow-2xl">
                {videoUrl && (
                  <video 
                    src={videoUrl} 
                    className="w-full h-full object-cover" 
                    style={{ borderRadius: `${roundedCorners}px` }}
                    autoPlay 
                    muted 
                    loop 
                  />
                )}
                <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none" />
              </div>
              <p className="text-xs text-zinc-500 font-medium">Preview do Enquadramento</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Controls */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Caixas de Texto</h3>
                  <button 
                    onClick={addText}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-full text-xs font-bold transition-all"
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                </div>

                {texts.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                    <p className="text-sm text-zinc-500">Nenhum texto adicionado ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {texts.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTextId(t.id)}
                        className={cn(
                          "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                          selectedTextId === t.id ? "border-primary bg-primary/5" : "border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Type size={16} className={selectedTextId === t.id ? "text-primary" : "text-zinc-500"} />
                          <span className="text-sm font-bold truncate max-w-[150px]">{t.text}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">{t.position}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeText(t.id); }}
                            className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
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
                    className="pt-6 border-t border-zinc-800 space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Conteúdo</label>
                      <textarea 
                        value={selectedText.text}
                        onChange={(e) => updateText(selectedText.id, { text: e.target.value })}
                        className="w-full p-4 bg-black/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Tipografia</label>
                        <select 
                          value={selectedText.font}
                          onChange={(e) => updateText(selectedText.id, { font: e.target.value })}
                          className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-sm"
                        >
                          {['Inter', 'Roboto', 'Montserrat', 'Oswald', 'Bebas Neue'].map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Posição</label>
                        <div className="flex gap-1">
                          {(['topo', 'centro', 'base'] as const).map(p => (
                            <button
                              key={p}
                              onClick={() => updateText(selectedText.id, { position: p })}
                              className={cn(
                                "flex-1 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all",
                                selectedText.position === p ? "border-primary bg-primary/10 text-primary" : "border-zinc-800"
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Tamanho</label>
                        <span className="text-xs font-bold">{selectedText.size}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="12" 
                        max="120" 
                        value={selectedText.size}
                        onChange={(e) => updateText(selectedText.id, { size: parseInt(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['#ffffff', '#000000', '#FF236C', '#ffff00', '#ff00ff', '#8000ff'].map(c => (
                        <button
                          key={c}
                          onClick={() => updateText(selectedText.id, { color: c })}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            selectedText.color === c ? "border-white scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center gap-4">
              <div className="aspect-[9/16] w-full max-w-[320px] bg-black rounded-3xl border border-zinc-800 overflow-hidden relative shadow-2xl">
                {videoUrl && (
                  <video 
                    src={videoUrl} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    muted 
                    loop 
                  />
                )}
                
                {/* Text Overlays */}
                {texts.map((t) => (
                  <div 
                    key={t.id}
                    className={cn(
                      "absolute inset-x-0 p-4 flex items-center justify-center text-center pointer-events-none",
                      t.position === 'topo' ? "top-10" : t.position === 'centro' ? "top-1/2 -translate-y-1/2" : "bottom-10"
                    )}
                  >
                    <span 
                      style={{ 
                        fontFamily: t.font, 
                        fontSize: `${t.size / 3}px`, 
                        color: t.color,
                        textShadow: t.hasStroke ? '0 0 5px rgba(0,0,0,0.8)' : 'none',
                        backgroundColor: t.hasBackground ? 'rgba(0,0,0,0.5)' : 'transparent',
                        padding: t.hasBackground ? '4px 8px' : '0',
                        borderRadius: '4px'
                      }}
                      className="font-bold uppercase tracking-tight"
                    >
                      {t.text}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 font-medium">Preview com Vídeo Real</p>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex flex-col items-center gap-8">
              <div className="aspect-[9/16] w-full max-w-[280px] bg-black rounded-3xl border border-zinc-800 overflow-hidden relative shadow-2xl">
                {videoUrl && <video src={videoUrl} className="w-full h-full object-cover" autoPlay muted loop />}
                {texts.map((t) => (
                  <div 
                    key={t.id}
                    className={cn(
                      "absolute inset-x-0 p-4 flex items-center justify-center text-center pointer-events-none",
                      t.position === 'topo' ? "top-10" : t.position === 'centro' ? "top-1/2 -translate-y-1/2" : "bottom-10"
                    )}
                  >
                    <span 
                      style={{ 
                        fontFamily: t.font, 
                        fontSize: `${t.size / 3}px`, 
                        color: t.color,
                        textShadow: '0 0 5px rgba(0,0,0,0.8)',
                      }}
                      className="font-bold uppercase tracking-tight"
                    >
                      {t.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex items-center gap-3">
                  <Shield size={20} className="text-emerald-500" />
                  <div>
                    <p className="text-xs font-bold">100% Privado</p>
                    <p className="text-[10px] text-zinc-500">Vídeo processado localmente</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex items-center gap-3">
                  <Zap size={20} className="text-primary" />
                  <div>
                    <p className="text-xs font-bold">Alta Qualidade</p>
                    <p className="text-[10px] text-zinc-500">Export em resolução original</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex items-center gap-3">
                  <Film size={20} className="text-purple-500" />
                  <div>
                    <p className="text-xs font-bold">Formato MP4</p>
                    <p className="text-[10px] text-zinc-500">Compatível com TikTok</p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md space-y-4">
                {loading ? (
                  <div className="p-8 rounded-3xl bg-[#09090B] border border-zinc-800">
                    <LoadingOverlay message="Processando vídeo..." />
                  </div>
                ) : (
                  <button 
                    onClick={handleExport}
                    className="w-full py-5 bg-tiktok-gradient text-white font-black italic uppercase text-xl tracking-widest rounded-full shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <Download size={24} /> Exportar Vídeo
                  </button>
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
