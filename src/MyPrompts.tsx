import React from 'react';
import { motion } from 'motion/react';
import { FileText, Copy, Trash2, Search, Clock, Sparkles } from 'lucide-react';
import { useApp } from './AppContext';

const MyPrompts: React.FC = () => {
  const { addNotification } = useApp();

  const prompts = [
    { id: 1, title: 'Gancho Viral - Skincare', date: '23/02/2026', type: 'V03' },
    { id: 2, title: 'Review Unboxing - Tech', date: '22/02/2026', type: 'V03' },
    { id: 3, title: 'Storytelling - Moda', date: '20/02/2026', type: 'V02' },
  ];

  const handleCopy = () => {
    addNotification("Copiado!", "Prompt copiado para a área de transferência.");
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Prompts</h1>
          <p className="text-zinc-400 mt-1">Histórico de todos os roteiros e prompts gerados pela IA.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Buscar nos meus prompts..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#09090B] border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {prompts.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-200">{p.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                    <Clock size={10} /> {p.date}
                  </span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                    {p.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handleCopy}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
              >
                <Copy size={18} />
              </button>
              <button className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-[#09090B]/50 border border-dashed border-zinc-800 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600">
          <Sparkles size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Gere mais prompts</h3>
          <p className="text-sm text-zinc-500 max-w-xs">Use o Creator Lab para criar novos roteiros otimizados para viralizar no TikTok.</p>
        </div>
        <button className="px-6 py-2 bg-primary text-white font-bold rounded-full text-sm">Ir para Creator Lab</button>
      </div>
    </div>
  );
};

export default MyPrompts;
