import React, { useState } from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';

const Auth: React.FC = () => {
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addNotification("Erro no login", error.message);
      } else if (data.user) {
        addNotification("Bem-vindo!", "Login realizado com sucesso.");
      }
    } catch (err: any) {
      addNotification("Erro", "Ocorreu um erro ao tentar entrar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <img
            src="https://i.postimg.cc/PrhMFyd6/1771503918895-019c75de-cef9-759f-b38e-636f7ae1437a-removebg-preview.png"
            alt="Creatoria Logo"
            className="w-20 h-20 object-contain mx-auto mb-4 drop-shadow-[0_0_15px_rgba(255,35,108,0.3)]"
          />
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Creatoria</h1>
          <p className="text-zinc-500 mt-2 font-medium">A plataforma definitiva para criadores.</p>
        </div>

        <div className="p-8 rounded-xl bg-[#0D0D0D] backdrop-blur-xl border border-zinc-800 shadow-2xl">
          <div className="flex gap-4 mb-8">
            <button
              className="flex-1 py-2 text-sm font-bold border-b-2 border-primary text-white transition-all"
            >
              Entrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Senha</label>
                <button type="button" className="text-[10px] font-bold text-primary hover:underline">Esqueceu a senha?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-tiktok-gradient text-white font-black italic uppercase tracking-widest rounded-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Processando..." : "Entrar"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500">
              Ao continuar, você concorda com nossos <button className="text-zinc-300 hover:underline">Termos de Uso</button> e <button className="text-zinc-300 hover:underline">Política de Privacidade</button>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
