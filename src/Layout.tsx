import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle } from './components/ui/popover';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Icon = ({ name, size = 16, ...props }: { name: string, size?: number } & React.SVGProps<SVGSVGElement>) => {
  const icons: Record<string, React.ReactNode> = {
    grid: <rect x="3" y="3" width="7" height="7" />,
    grid2: <rect x="3" y="14" width="7" height="7" />,
    grid3: <rect x="14" y="3" width="7" height="7" />,
    grid4: <rect x="14" y="14" width="7" height="7" />,
    target: <React.Fragment><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></React.Fragment>,
    play: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="m10 8 8 4-8 4V8z" /></React.Fragment>,
    video: <React.Fragment><path d="m22 8-6 4 6 4V8z" /><rect x="2" y="6" width="14" height="12" rx="2" ry="2" /></React.Fragment>,
    zap: <React.Fragment><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></React.Fragment>,
    rocket: <React.Fragment><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.5-1 1-4c2 0 3 0 4 1z" /><path d="M15 15v5c0 1-1 4-4 4v-5c1-1 1-2 1-4z" /><path d="m15 9 3 3" /></React.Fragment>,
    grad: <React.Fragment><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></React.Fragment>,
    file: <React.Fragment><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></React.Fragment>,
    settings: <React.Fragment><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></React.Fragment>,
    logout: <React.Fragment><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></React.Fragment>,
    bell: <React.Fragment><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></React.Fragment>,
    user: <React.Fragment><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></React.Fragment>,
    menu: <React.Fragment><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></React.Fragment>,
    x: <React.Fragment><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></React.Fragment>,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
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

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { profile, notifications, markAllAsRead, setUser } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Generate Meteors
  const [meteors, setMeteors] = useState<any[]>([]);
  useEffect(() => {
    const newMeteors = Array.from({ length: 30 }).map(() => ({
      id: Math.random(),
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 7}s`,
      opacity: 0.3 + Math.random() * 0.6,
      height: `${60 + Math.random() * 90}px`
    }));
    setMeteors(newMeteors);
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'radar', label: 'Radar de Produtos', icon: 'target' },
    { id: 'criar-perfil', label: 'Criar Perfil', icon: 'user' },
    { id: 'creator-lab', label: 'Creator Lab', icon: 'play' },
    { id: 'sync-editor', label: 'Sync Editor', icon: 'video' },
    { id: 'viral-creator', label: 'Viral Creator', icon: 'zap' },
    { id: 'academy', label: 'Academy', icon: 'grad' },
    { id: 'my-prompts', label: 'Meus Prompts', icon: 'file' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('creator_lab_user');
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", backgroundColor: "#050505", color: "white", overflow: "hidden" }}>
      <style>{`
        @keyframes meteorFall {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 0.8; }
          100% { transform: rotate(215deg) translateX(-600px); opacity: 0; }
        }
      `}</style>

      {/* Meteor Background */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {meteors.map((m) => (
          <span
            key={m.id}
            style={{
              position: "absolute",
              width: "2px",
              height: m.height,
              background: "linear-gradient(to bottom, #DEDEDE, #a855f7, transparent)",
              borderRadius: "9999px",
              opacity: m.opacity,
              top: "-10%",
              left: m.left,
              animation: `meteorFall ${m.duration} ${m.delay} linear infinite`
            }}
          />
        ))}
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        style={{
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #141414",
          background: "rgba(5, 5, 5, 0.97)",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 30
        }}
      >
        <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
          <img
            src="https://i.postimg.cc/rwwB300w/image.jpg"
            alt="Creatoria Logo"
            style={{ width: "40px", height: "40px", objectFit: "contain", flexShrink: 0 }}
          />
          {!sidebarCollapsed && (
            <span style={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "-0.025em", color: "#DEDEDE", whiteSpace: "nowrap" }}>
              Creatoria
            </span>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          style={{
            position: "absolute",
            right: "-12px",
            top: "40px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#141414",
            border: "1px solid #27272a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
            zIndex: 40
          }}
        >
          <Icon name={sidebarCollapsed ? "chevronRight" : "chevronLeft"} size={14} />
        </button>

        <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                transition: "all 0.2s",
                border: "none",
                cursor: "pointer",
                position: "relative",
                background: activeTab === item.id ? "rgba(222, 222, 222, 0.07)" : "transparent",
                color: activeTab === item.id ? "white" : "#a1a1aa",
                borderLeft: activeTab === item.id ? "3px solid #DEDEDE" : "3px solid transparent",
                textAlign: "left"
              }}
            >
              <Icon name={item.icon} size={20} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #141414" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "12px",
              color: "#a1a1aa",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              justifyContent: sidebarCollapsed ? "center" : "flex-start"
            }}
          >
            <Icon name="logout" size={20} />
            {!sidebarCollapsed && <span style={{ fontWeight: 500 }}>Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 10 }}>
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <header style={{
            height: "64px",
            borderBottom: "1px solid #141414",
            background: "rgba(5, 5, 5, 0.5)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 20
          }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 500, color: "#a1a1aa", margin: 0 }}>
                Olá, <span style={{ color: "white" }}>{profile.name.split(' ')[0]}</span>
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <button style={{
                    position: "relative",
                    padding: "8px",
                    color: "#a1a1aa",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}>
                    <Icon name="bell" size={20} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "16px",
                        height: "16px",
                        backgroundColor: "#ef4444",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        border: "2px solid #050505"
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" style={{ width: "320px", padding: 0, backgroundColor: "#09090B", border: "1px solid #141414", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                  <PopoverHeader style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #141414", padding: "12px 16px" }}>
                    <PopoverTitle style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>Notificações</PopoverTitle>
                    <button
                      onClick={markAllAsRead}
                      style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      Marcar todas
                    </button>
                  </PopoverHeader>
                  <div style={{ maxHeight: "384px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "32px", textAlign: "center", color: "#71717a", fontSize: "14px" }}>Nenhuma notificação.</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} style={{ padding: "16px", borderBottom: "1px solid #141414", transition: "background 0.2s", position: "relative" }}>
                          <div style={{ display: "flex", gap: "12px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(34, 197, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", flexShrink: 0 }}>
                              <Icon name="chevronRight" size={14} style={{ margin: "auto" }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                <p style={{ fontSize: "14px", fontWeight: "bold", color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</p>
                                <span style={{ fontSize: "10px", color: "#71717a", whiteSpace: "nowrap" }}>{n.time}</span>
                              </div>
                              <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "2px 0 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{n.message}</p>
                            </div>
                          </div>
                          {!n.read && (
                            <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)" }} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile */}
              <Popover>
                <PopoverTrigger asChild>
                  <button style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px 4px 4px 12px",
                    borderRadius: "9999px",
                    background: "#09090B",
                    border: "1px solid #141414",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#141414", overflow: "hidden", border: "1px solid #27272a" }}>
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>
                          <Icon name="user" size={16} />
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "white" }}>{profile.name.split(' ')[0]}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" style={{ width: "224px", padding: "8px", backgroundColor: "#09090B", border: "1px solid #141414" }}>
                  <div style={{ padding: "8px", borderBottom: "1px solid #141414", marginBottom: "4px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</p>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#a1a1aa",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left"
                    }}
                  >
                    <Icon name="user" size={16} />
                    Ver Perfil
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#a1a1aa",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left"
                    }}
                  >
                    <Icon name="settings" size={16} />
                    Configurações
                  </button>
                  <div style={{ height: "1px", backgroundColor: "#141414", margin: "4px 0" }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#ef4444",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left"
                    }}
                  >
                    <Icon name="logout" size={16} />
                    Sair
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          {/* Page Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {children}
          </div>

          {/* Mobile Floating Menu Button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 60,
              display: "flex",
              height: "56px",
              width: "56px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "#DEDEDE",
              color: "#050505",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            className="lg:hidden"
          >
            <Icon name="menu" size={28} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Layout;
