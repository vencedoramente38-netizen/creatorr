import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, DashboardStats, UserProfile, AppNotification, PRODUCTS_SEED } from './types';
import { STOR, sbGet } from './lib/supabase';

interface AppContextType {
  user: any | null;
  setUser: (user: any) => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  stats: DashboardStats;
  setStats: (stats: DashboardStats) => void;
  notifications: AppNotification[];
  addNotification: (title: string, message: string) => void;
  markAllAsRead: () => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: 'Usuário Demo', email: 'demo@creatoria.com.br', avatar: '' };
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = window.localStorage.getItem('adminProducts');
    return saved ? JSON.parse(saved) : PRODUCTS_SEED;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStats] = useState<DashboardStats>(() => {
    const saved = localStorage.getItem('dashboardData');
    const defaultDashboardData: DashboardStats = {
      faturamento: "R$ 0,00",
      pedidos: 0,
      comissao: "R$ 0,00",
      produtosAtivos: 0,
      chartData: [
        { month: 'Jan', vendas: 0 },
        { month: 'Fev', vendas: 0 },
        { month: 'Mar', vendas: 0 },
        { month: 'Abr', vendas: 0 },
        { month: 'Mai', vendas: 0 },
        { month: 'Jun', vendas: 0 },
      ]
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultDashboardData, ...parsed };
    }
    return defaultDashboardData;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: "Bem-vindo!", message: "Login realizado com sucesso.", time: "19:02", read: false },
      { id: '2', title: "Produto favoritado!", message: "Kit de skincare adicionado aos favoritos.", time: "18:45", read: false }
    ];
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Session is managed purely by App.tsx now
    const checkUser = async () => {
      const session = await STOR.g("session");
      setUser(session ?? null);
      if (session?.email) {
        setProfile(prev => ({ ...prev, email: session.email }));
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sbGet('products', 'select=*');
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Erro ao carregar produtos do Supabase:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('adminProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('favoriteIds', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('dashboardData', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const newFavs = isFav ? prev.filter(fid => fid !== id) : [...prev, id];

      if (notificationsEnabled) {
        const product = products.find(p => p.id === id);
        addNotification(isFav ? "Removido dos favoritos" : "Produto favoritado!", isFav ? `${product?.name} removido.` : `${product?.name} adicionado aos favoritos.`);
      }

      return newFavs;
    });
  };

  const addNotification = (title: string, message: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      profile, setProfile,
      products, setProducts,
      favorites, toggleFavorite,
      stats, setStats,
      notifications, addNotification,
      markAllAsRead,
      notificationsEnabled, setNotificationsEnabled
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
