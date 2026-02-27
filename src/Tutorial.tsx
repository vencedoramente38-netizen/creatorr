import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Video, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const Tutorial: React.FC = () => {
  const steps = [
    { title: 'Encontre o Produto', desc: 'Use o Radar de Produtos para identificar itens com alto Score Viral.', icon: Zap, color: 'text-yellow-500' },
    { title: 'Gere o Roteiro', desc: 'No Creator Lab, configure seu vídeo e gere um prompt V03 profissional.', icon: Play, color: 'text-primary' },
    { title: 'Crie o Vídeo', desc: 'Use o Flow VEO3 para transformar seu prompt em um vídeo cinematográfico.', icon: Video, color: 'text-primary' },
    { title: 'Edite e Publique', desc: 'Ajuste o enquadramento no Sync Editor e poste no TikTok Shop.', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutorial</h1>
        <p className="text-zinc-400 mt-1">Aprenda a dominar o ecossistema Creatoria em poucos minutos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-[#09090B] border border-zinc-800 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Play size={120} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Vídeo de Introdução</h3>
          <div className="aspect-video rounded-2xl bg-black border border-zinc-800 flex items-center justify-center relative group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform">
              <Play size={32} fill="currentColor" />
            </div>
            <img src="https://picsum.photos/seed/tutorial/800/450" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 rounded-2xl" />
          </div>
          <p className="text-sm text-zinc-400 mt-6">Assista ao guia rápido de 2 minutos para começar a faturar com o TikTok Shop.</p>
        </motion.div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={24} className="text-primary" />
            Passo a Passo
          </h3>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex items-start gap-4 hover:border-zinc-700 transition-all"
              >
                <div className={cn("p-3 rounded-xl bg-zinc-800 flex-shrink-0", step.color)}>
                  <step.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{step.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
            Ver documentação completa <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Tutorial;
