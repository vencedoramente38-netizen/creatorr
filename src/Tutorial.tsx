import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Video, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const Tutorial: React.FC = () => {
  const steps = [
    { title: 'Encontre o Produto', desc: 'Use o Radar de Produtos para identificar itens com alto Score Viral.', icon: Zap, color: '#eab308' },
    { title: 'Gere o Roteiro', desc: 'No Creator Lab, configure seu vídeo e gere um prompt V03 profissional.', icon: Play, color: '#DEDEDE' },
    { title: 'Crie o Vídeo', desc: 'Use o Flow VEO3 para transformar seu prompt em um vídeo cinematográfico.', icon: Video, color: '#DEDEDE' },
    { title: 'Edite e Publique', desc: 'Ajuste o enquadramento no Creator Editor e poste no TikTok Shop.', icon: CheckCircle2, color: '#10b981' },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "80px", color: "white" }}>
      <div>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Tutorial</h1>
        <p style={{ color: "#a1a1aa", margin: 0, fontSize: "15px" }}>Aprenda a dominar o ecossistema Creatoria em poucos minutos.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", ...({ '@media (min-width: 768px)': { gridTemplateColumns: "1fr 1fr" } } as any) }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ padding: "32px", borderRadius: "24px", background: "#09090B", border: "1px solid #27272a", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: 0, right: 0, padding: "32px", opacity: 0.05, transition: "opacity 0.3s" }}>
            <Play size={120} color="#DEDEDE" />
          </div>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", marginTop: 0 }}>Vídeo de Introdução</h3>
          <div style={{ aspectRatio: "16/9", borderRadius: "16px", background: "black", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#DEDEDE", color: "black", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <Play size={32} fill="currentColor" />
            </div>
            <img src="https://picsum.photos/seed/tutorial/800/450" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, borderRadius: "16px" }} />
          </div>
          <p style={{ fontSize: "14px", color: "#a1a1aa", marginTop: "24px", marginBottom: 0 }}>Assista ao guia rápido de 2 minutos para começar a faturar com o TikTok Shop.</p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
            <BookOpen size={24} color="#DEDEDE" />
            Passo a Passo
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: "16px", borderRadius: "16px", background: "#09090B", border: "1px solid #27272a", display: "flex", alignItems: "flex-start", gap: "16px", transition: "all 0.2s" }}
              >
                <div style={{ padding: "12px", borderRadius: "12px", background: "#27272a", flexShrink: 0, color: step.color }}>
                  <step.icon size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: "bold", fontSize: "14px", margin: "0 0 4px 0" }}>{step.title}</h4>
                  <p style={{ fontSize: "12px", color: "#a1a1aa", margin: 0 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button style={{ width: "100%", padding: "16px", background: "#27272a", color: "white", fontWeight: "bold", borderRadius: "16px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", marginTop: "16px" }}>
            Ver documentação completa <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;

