import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './AppContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SideIcon = ({ type }: { type: string }) => {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case 'dashboard':
      return <svg {...common}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
    case 'radar':
      return <svg {...common}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="2" x2="12" y2="4" /></svg>;
    case 'creator-lab':
      return <svg {...common}><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" /></svg>;
    case 'viral-creator':
      return <svg {...common}><polyline points="13,2 13,9 20,9" /><polyline points="11,22 11,15 4,15" /><line x1="3" y1="3" x2="21" y2="21" /></svg>;
    case 'creator-editor':
      return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
    case 'academy':
      return <svg {...common}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
    case 'admin':
      return <svg {...common}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    default:
      return null;
  }
};

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
            position: "absolute",
            top: m.top,
            left: m.left,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
            animationName: "meteorFall",
            animationDelay: m.delay,
            animationDuration: m.duration,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}>
            <div style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 0,
              width: 80,
              height: 1,
              background: "linear-gradient(to right, white, transparent)",
              zIndex: -1,
            }} />
          </span>
        ))}
      </div>
    </>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isMobile, sidebarOpen, setSidebarOpen }) => {
  const { profile, setUser } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'radar', label: 'Radar de Produtos' },
    { id: 'creator-lab', label: 'Creator Lab' },
    { id: 'creator-editor', label: 'Creator Editor' },
    { id: 'viral-creator', label: 'Viral Creator' },
    { id: 'academy', label: 'Academy' },
    { id: 'admin', label: 'Admin' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('creator_lab_user');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#DEDEDE', position: 'relative', fontFamily: '"SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <MeteorShower />

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ translateX: isMobile ? (sidebarOpen ? 0 : '-100%') : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          width: '280px',
          background: '#0a0a0a',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          zIndex: 50,
          boxShadow: isMobile ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <div style={{ padding: '32px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#000', fontWeight: '900', fontSize: '20px' }}>C</span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>Creatoria</h1>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: activeTab === item.id ? '#fff' : '#71717a',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === item.id ? '600' : '500',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <SideIcon type={item.id} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 8px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={profile.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="Avatar"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }}
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid #0a0a0a' }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>{profile.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#71717a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{profile.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              color: "#ef4444",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "inherit",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sair
          </button>
        </div>
      </motion.aside>

      {isMobile && (
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          whileHover={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '28px',
            background: '#fff',
            color: '#000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 100,
            cursor: 'pointer',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <motion.div animate={{ rotate: sidebarOpen ? 90 : 0 }} transition={{ type: 'spring', damping: 20 }}>
            {sidebarOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </motion.div>
        </motion.button>
      )}

      <main style={{
        flex: 1,
        padding: isMobile ? '24px 16px' : '40px',
        marginLeft: isMobile ? 0 : 0,
        zIndex: 1,
        height: '100vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
