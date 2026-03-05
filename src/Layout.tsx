import React, { useState } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Radar,
  FlaskConical,
  Video,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Check,
  UserCircle2,
  GraduationCap,
  Zap,
  Rocket
} from 'lucide-react';
import { Meteors } from './components/ui/meteors';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverHeader, PopoverTitle } from './components/ui/popover';
import { cn } from './lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { profile, notifications, markAllAsRead, setUser } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'radar', label: 'Radar de Produtos', icon: Radar },
    { id: 'criar-perfil', label: 'Criar Perfil', icon: UserCircle2 },
    { id: 'creator-lab', label: 'Creator Lab', icon: FlaskConical },
    { id: 'sync-editor', label: 'Sync Editor', icon: Video },
    { id: 'viral-creator', label: 'Viral Creator', icon: Rocket },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'my-prompts', label: 'Meus Prompts', icon: FileText },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('creator_lab_user');
  };

  return (
    <div className="flex h-screen w-full bg-[#000000] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        className="hidden lg:flex flex-col border-r border-zinc-800 bg-[#09090B] backdrop-blur-xl relative z-30"
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <img
            src="https://i.postimg.cc/PrhMFyd6/1771503918895-019c75de-cef9-759f-b38e-636f7ae1437a-removebg-preview.png"
            alt="Creatoria Logo"
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          {!sidebarCollapsed && (
            <span className="font-bold text-xl tracking-tight whitespace-nowrap">Creatoria</span>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors z-40"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                activeTab === item.id
                  ? "bg-tiktok-gradient text-white shadow-lg shadow-primary/20"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <item.icon size={20} className={cn("flex-shrink-0", activeTab === item.id ? "text-white" : "group-hover:text-zinc-200")} />
              {!sidebarCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              {sidebarCollapsed && (
                <div className="absolute left-16 bg-[#09090B] text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-zinc-800 z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all",
              sidebarCollapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#09090B] border-r border-zinc-800 z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.postimg.cc/PrhMFyd6/1771503918895-019c75de-cef9-759f-b38e-636f7ae1437a-removebg-preview.png"
                    alt="Creatoria Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <span className="font-bold text-xl">Creatoria</span>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-zinc-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      activeTab === item.id
                        ? "bg-tiktok-gradient text-white"
                        : "text-zinc-400 hover:bg-zinc-800"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-zinc-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <Meteors number={100} className="fixed inset-0 w-full h-full" />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <header className="h-16 border-b border-zinc-800 bg-[#09090B]/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex flex-col">
              <h2 className="text-sm font-medium text-zinc-400">Olá, <span className="text-white">{profile.name.split(' ')[0]}</span></h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-zinc-950">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[calc(100vw-32px)] sm:w-80 p-0 bg-[#09090B] border-zinc-800 shadow-2xl">
                  <PopoverHeader className="flex flex-row items-center justify-between border-b border-zinc-800 px-4 py-3">
                    <PopoverTitle className="text-sm font-bold">Notificações</PopoverTitle>
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-wider"
                    >
                      Marcar todas como lidas
                    </button>
                  </PopoverHeader>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-sm">Nenhuma notificação por enquanto.</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors flex gap-3 relative group">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                            <Check size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-white truncate">{n.title}</p>
                              <span className="text-[10px] text-zinc-500 whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{n.message}</p>
                          </div>
                          {!n.read && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-zinc-800">
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Sistema de Notificações Global</p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-[#09090B] border border-zinc-800 hover:border-zinc-700 transition-all">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline-block">{profile.name.split(' ')[0]}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2 bg-[#09090B] border-zinc-800">
                  <div className="p-2 border-b border-zinc-800 mb-1">
                    <p className="text-sm font-bold truncate">{profile.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    <User size={16} />
                    Ver Perfil
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    <Settings size={16} />
                    Configurações
                  </button>
                  <div className="h-px bg-zinc-800 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* Mobile Floating Menu Button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="fixed bottom-6 right-6 z-[60] flex lg:hidden h-14 w-14 items-center justify-center rounded-full bg-primary shadow-[0_0_30px_rgba(255,35,108,0.5)] text-white hover:scale-110 active:scale-95 transition-all animate-bounce-subtle"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Layout;
