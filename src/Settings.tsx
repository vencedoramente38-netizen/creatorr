import React, { useState, useRef } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Bell,
  Shield,
  Lock,
  Save,
  Image as ImageIcon,
  Check,
  LayoutDashboard,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Package
} from 'lucide-react';
import { cn } from './lib/utils';
import { LoadingOverlay } from './components/ui/loading-overlay';
import { DashboardStats } from './types';

const Settings: React.FC = () => {
  const {
    profile, setProfile,
    notificationsEnabled, setNotificationsEnabled,
    stats, setStats,
    addNotification
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Form States
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);

  const [dash, setDash] = useState<DashboardStats>(stats);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      setProfile({ name: profileName, email: profileEmail, avatar: avatarPreview });
      setLoading(false);
      addNotification("Perfil atualizado!", "Suas informações foram salvas com sucesso.");
    }, 1000);
  };

  const handleAdminAuth = () => {
    if (adminPassword === 'admin123') {
      setAdminAuthenticated(true);
      addNotification("Acesso concedido", "Bem-vindo ao painel de administração.");
    } else {
      addNotification("Erro", "Senha de admin incorreta.");
    }
  };

  const saveDashboard = () => {
    setStats(dash);
    localStorage.setItem('dashboardData', JSON.stringify(dash));
    addNotification("Dashboard atualizado!", "Números atualizados com sucesso!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-zinc-400 mt-1">Gerencie seu perfil e preferências do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User size={20} />
            </div>
            <h3 className="text-lg font-bold">Perfil</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden relative group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <User size={40} />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ImageIcon size={20} className="text-white" />
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" hidden />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-primary hover:underline"
              >
                Escolher da galeria
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Nome Completo</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Seu nome"
                className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Email</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              Salvar perfil
            </button>
          </div>
        </motion.div>

        {/* Notifications & Admin Access */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Bell size={20} />
              </div>
              <h3 className="text-lg font-bold">Notificações</h3>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-zinc-800">
              <div>
                <p className="text-sm font-bold">Ativar notificações</p>
                <p className="text-xs text-zinc-500 mt-0.5">Receba alertas sobre vendas e atualizações</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  notificationsEnabled ? "bg-emerald-500" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  notificationsEnabled ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </motion.div>

          {/* Admin Access Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-[#09090B] border border-zinc-800 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-bold">Painel de Admin</h3>
            </div>

            {!adminAuthenticated ? (
              <div className="space-y-4">
                <p className="text-xs text-zinc-500">Acesso restrito a administradores.</p>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input
                    type="password"
                    placeholder="Digite a senha de admin"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"
                  />
                </div>
                <button
                  onClick={handleAdminAuth}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                >
                  Acessar painel
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <Check className="text-emerald-500" size={20} />
                <p className="text-sm font-bold text-emerald-500">Autenticado como Administrador</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Admin Panel Content */}
      <AnimatePresence>
        {adminAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="space-y-8"
          >
            <div className="rounded-2xl bg-[#09090B] border border-zinc-800 p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#0000FB]" />
                Números do Dashboard
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Faturamento Total</label>
                  <input value={dash.faturamento} onChange={e => setDash({ ...dash, faturamento: e.target.value })}
                    className="w-full bg-[#09090B] border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm"
                    placeholder="R$ 0,00" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Pedidos</label>
                  <input type="number" value={dash.pedidos} onChange={e => setDash({ ...dash, pedidos: Number(e.target.value) })}
                    className="w-full bg-[#09090B] border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm"
                    placeholder="0" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Comissão Total</label>
                  <input value={dash.comissao} onChange={e => setDash({ ...dash, comissao: e.target.value })}
                    className="w-full bg-[#09090B] border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm"
                    placeholder="R$ 0,00" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Produtos Ativos</label>
                  <input type="number" value={dash.produtosAtivos} onChange={e => setDash({ ...dash, produtosAtivos: Number(e.target.value) })}
                    className="w-full bg-[#09090B] border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm"
                    placeholder="0" />
                </div>
              </div>

              {/* Gráfico — valores por mês */}
              <p className="text-xs text-zinc-400 mb-2">Valores do Gráfico (por mês)</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {dash.chartData.map((item, i) => (
                  <div key={i}>
                    <label className="text-xs text-zinc-500 mb-1 block">{item.month}</label>
                    <input type="number" value={item.vendas}
                      onChange={e => {
                        const updated = [...dash.chartData]
                        updated[i] = { ...updated[i], vendas: Number(e.target.value) }
                        setDash({ ...dash, chartData: updated })
                      }}
                      className="w-full bg-[#09090B] border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm"
                      placeholder="0" />
                  </div>
                ))}
              </div>

              <button onClick={saveDashboard}
                className="w-full bg-[#0000FB] text-white font-semibold py-2.5 rounded-full hover:bg-[#0000e0] transition-all">
                Salvar números
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default Settings;
