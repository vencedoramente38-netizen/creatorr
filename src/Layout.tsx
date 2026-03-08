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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {content}
    </svg>
  );
};

// Clean SVG sidebar icons
const SideIcon = ({ type }: { type: string }) => {
  const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" as const, stroke: "currentColor" as const, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case 'dashboard':
      return <svg {...props}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
    case 'radar':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="2" x2="12" y2="4" /></svg>;
    case 'creator-lab':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" /></svg>;
    case 'creator-editor':
      return <svg {...props}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
    case 'viral-creator':
      return <svg {...props}><polyline points="13,2 13,9 20,9" /><polyline points="11,22 11,15 4,15" /><line x1="3" y1="3" x2="21" y2="21" /></svg>;
    case 'criar-perfil':
      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>;
    case 'academy':
      return <svg {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
    case 'admin':
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case 'settings':
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="4" /></svg>;
  }
};

// MagicUI-style Meteor Shower (white meteors)
const MeteorShower = () => {
  const [meteors, setMeteors] = useState<Array<{ id: number; top: string; left: string; delay: string; duration: string }>>([]);
  useEffect(() => {
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: "-5%",
      left: Math.floor(Math.random() * window.innerWidth) + "px",
      delay: (Math.random() * 5).toFixed(2) + "s",
      duration: (Math.floor(Math.random() * 8) + 3) + "s",
    }));
    setMeteors(generated);
  }, []);

  return (
    <>
      <style>{`
        @keyframes meteorFall {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 0.8; }
          100% { transform: rotate(215deg) translateX(-600px); opacity: 0; }
        }
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {meteors.map(m => (
          <span key={m.id} style={{
            position: "absolute", top: m.top, left: m.left,
            width: 2, height: 2, borderRadius: "50%",
            background: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
            animationName: "meteorFall", animationDelay: m.delay,
            animationDuration: m.duration, animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}>
            <div style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              left: 0, width: 80, height: 1,
              background: "linear-gradient(to right, white, transparent)", zIndex: -1,
            }} />
          </span>
        ))}
      </div>
    </>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { profile, notifications, markAllAsRead, setUser } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'radar', label: 'Radar de Produtos' },
    { id: 'criar-perfil', label: 'Criar Perfil' },
    { id: 'creator-lab', label: 'Creator Lab' },
    { id: 'creator-editor', label: 'Creator Editor' },
    { id: 'viral-creator', label: 'Viral Creator' },
    { id: 'academy', label: 'Academy' },
    { id: 'admin', label: 'Admin' },
    { id: 'settings', label: 'Configurações' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('creator_lab_user');
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", backgroundColor: "#050505", color: "white", overflow: "hidden", fontFamily: '"SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <MeteorShower />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 49,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isMobile ? 220 : (sidebarCollapsed ? 80 : 260) }}
        style={{
          width: 220,
          background: "rgba(5,5,5,0.97)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,.07)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
          transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
          transition: "transform 0.3s ease",
        }}
      >
        <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
          <img src="https://i.postimg.cc/Ghyb70wM/image-removebg-preview.png" alt="Creatoria Logo" style={{ width: "40px", height: "40px", objectFit: "contain", flexShrink: 0 }} />
          {(!sidebarCollapsed || isMobile) && (
            <span style={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "-0.025em", color: "#DEDEDE", whiteSpace: "nowrap" }}>
              Creatoria
            </span>
          )}
        </div>

        {!isMobile && (
          <button onClick={toggleSidebar} style={{ position: "absolute", right: "-12px", top: "40px", width: "24px", height: "24px", borderRadius: "50%", background: "#141414", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer", zIndex: 40 }}>
            <Icon name={sidebarCollapsed ? "chevronRight" : "chevronLeft"} size={14} />
          </button>
        )}

        <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => {
              setActiveTab(item.id);
              if (isMobile) setSidebarOpen(false);
            }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              padding: "12px", borderRadius: "12px", transition: "all 0.2s",
              border: "none", cursor: "pointer", position: "relative",
              background: activeTab === item.id ? "rgba(222, 222, 222, 0.07)" : "transparent",
              color: activeTab === item.id ? "white" : "#a1a1aa",
              borderLeft: activeTab === item.id ? "3px solid #DEDEDE" : "3px solid transparent",
              textAlign: "left", fontFamily: "inherit",
            }}>
              <SideIcon type={item.id} />
              {(!sidebarCollapsed || isMobile) && <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #141414" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", color: "#a1a1aa", background: "none", border: "none", cursor: "pointer", transition: "all 0.2s", justifyContent: (!sidebarCollapsed || isMobile) ? "flex-start" : "center", fontFamily: "inherit" }}>
            <Icon name="logout" size={20} />
            {(!sidebarCollapsed || isMobile) && <span style={{ fontWeight: 500 }}>Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        position: "relative",
        zIndex: 10,
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? 80 : 260),
        transition: "margin-left 0.3s ease"
      }}>
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <header style={{ height: "64px", borderBottom: "1px solid rgba(255,255,255,.07)", background: "rgba(5, 5, 5, 0.5)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 20 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 500, color: "#a1a1aa", margin: 0 }}>
                Olá, <span style={{ color: "white" }}>{profile.name.split(' ')[0]}</span>
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Popover>
                <PopoverTrigger asChild>
                  <button style={{ position: "relative", padding: "8px", color: "#a1a1aa", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                    <Icon name="bell" size={20} />
                    {unreadCount > 0 && (
                      <span style={{ position: "absolute", top: "4px", right: "4px", width: "16px", height: "16px", backgroundColor: "#ef4444", fontSize: "10px", fontWeight: "bold", color: "white", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "2px solid #050505" }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" style={{ width: "320px", padding: 0, backgroundColor: "#09090B", border: "1px solid #141414", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                  <PopoverHeader style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #141414", padding: "12px 16px" }}>
                    <PopoverTitle style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>Notificações</PopoverTitle>
                    <button onClick={markAllAsRead} style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>Marcar todas</button>
                  </PopoverHeader>
                  <div style={{ maxHeight: "384px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "32px", textAlign: "center", color: "#71717a", fontSize: "14px" }}>Nenhuma notificação.</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} style={{ padding: "16px", borderBottom: "1px solid #141414", position: "relative" }}>
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
                          {!n.read && <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)" }} />}
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 4px 4px 12px", borderRadius: "9999px", background: "#09090B", border: "1px solid #141414", cursor: "pointer", transition: "all 0.2s" }}>
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
                  <button onClick={() => setActiveTab('settings')} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px", borderRadius: "8px", fontSize: "14px", color: "#a1a1aa", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <Icon name="user" size={16} /> Ver Perfil
                  </button>
                  <button onClick={() => setActiveTab('settings')} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px", borderRadius: "8px", fontSize: "14px", color: "#a1a1aa", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <Icon name="settings" size={16} /> Configurações
                  </button>
                  <div style={{ height: "1px", backgroundColor: "#141414", margin: "4px 0" }} />
                  <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px", borderRadius: "8px", fontSize: "14px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <Icon name="logout" size={16} /> Sair
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "28px" }}>
            {children}
          </div>

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                position: "fixed",
                bottom: 24,
                left: 24,
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#DEDEDE",
                color: "#050505",
                border: "none",
                cursor: "pointer",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                fontSize: 20,
                fontWeight: 700,
                transition: "transform 0.3s ease",
                transform: sidebarOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
