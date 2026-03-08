import React, { useState, useMemo } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from './types';

const Icon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
  const icons: Record<string, React.ReactNode> = {
    search: <React.Fragment><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></React.Fragment>,
    heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
    download: <React.Fragment><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></React.Fragment>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    trendingUp: <React.Fragment><path d="m22 7-8.5 8.5-5-5L2 17" /><polyline points="16 7 22 7 22 13" /></React.Fragment>,
    externalLink: <React.Fragment><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 22 3 22 10" /><line x1="10" y1="14" x2="22" y2="3" /></React.Fragment>,
    video: <React.Fragment><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></React.Fragment>,
    bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />,
    x: <React.Fragment><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></React.Fragment>,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    info: <React.Fragment><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></React.Fragment>,
    dollarSign: <React.Fragment><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></React.Fragment>,
    percent: <React.Fragment><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></React.Fragment>,
    truck: <React.Fragment><rect width="16" height="13" x="2" y="6" rx="2" /><path d="M18 9h2l3 3v7h-2" /><circle cx="7" cy="19" r="2" /><circle cx="17" cy="19" r="2" /></React.Fragment>,
    store: <React.Fragment><path d="m2 7 3-4h14l3 4" /><path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" /><path d="M9 7v1" /><path d="M15 7v1" /></React.Fragment>,
    shoppingCart: <React.Fragment><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></React.Fragment>,
    flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 3.333 3 5 1.237 2.062.326 3.919-.606 5.606-.8.8-1.144 1.341-1.144 2.894 0 2.209 1.791 4 4 4 2.209 0 4-1.791 4-4 0-1.553-.344-3.094-1.144-4.144C16.143 14.143 16 13.143 16 12.143c0-2.209-1.791-4-4-4-1.38 0-2.5 1.12-2.5 2.5 0 1.381 1.791 2.5 3.5 2.5 2.209 0 4-1.791 4-4" />,
    package: <React.Fragment><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.27 6.96 8.73 5.04 8.73-5.04" /><path d="M12 22.08V12" /></React.Fragment>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    palette: <React.Fragment><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.707-.484 2.155-1.204a3.303 3.303 0 0 0-.155-3.796 3.303 3.303 0 0 1 2.5-5.5h2.5c1.1 0 2-.9 2-2a6 6 0 0 0-6-6z" /></React.Fragment>,
    link: <React.Fragment><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></React.Fragment>
  };

  const content = icons[name] || null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {content}
    </svg>
  );
};

const Radar: React.FC = () => {
  const { products, favorites, toggleFavorite, addNotification } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const metrics = useMemo(() => {
    return {
      total: products.length,
      hot: products.filter(p => p.viralScore >= 85).length,
      highScore: products.filter(p => p.viralScore >= 80).length,
      lowConcurrency: products.filter(p => p.concurrency === 'Baixa').length
    };
  }, [products]);

  const categories = [
    'Todos', 'Skincare', 'Pets', 'Casa & Cozinha', 'Acessórios',
    'Eletrônicos', 'Moda', 'Ferramentas', 'Saúde', 'Beleza'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === 'Todos' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Casa & Cozinha' && (p.category === 'Casa' || p.category === 'Cozinha'));

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleDownloadImage = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addNotification("Imagem baixada!", `A imagem de ${product.name} foi salva com sucesso.`);
  };

  const handleAffiliate = (product: Product) => {
    addNotification("Redirecionando...", "Abrindo link do TikTok Shop para afiliação.");
    window.open(product.tiktokUrl, '_blank');
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "80px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.05em" }}>Central de Mineração</h1>
          <p style={{ color: "#a1a1aa", marginTop: "4px" }}>Descubra produtos com alto potencial de vendas no TikTok Shop.</p>
        </div>

        {/* Metrics Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { label: 'Produtos disponíveis', value: metrics.total, icon: 'package', color: '#DEDEDE' },
            { label: 'Produtos Hot', value: metrics.hot, icon: 'flame', color: '#DEDEDE' },
            { label: 'Score alto', value: metrics.highScore, icon: 'trendingUp', color: '#DEDEDE' },
            { label: 'Baixa concorrência', value: metrics.lowConcurrency, icon: 'shield', color: '#DEDEDE' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: "16px",
                borderRadius: "24px",
                backgroundColor: "rgba(20, 20, 20, 0.5)",
                border: "1px solid #27272a",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                flexShrink: 0,
                backgroundColor: card.color === '#DEDEDE' ? "#27272a" : card.color
              }}>
                <Icon name={card.icon} size={20} />
              </div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</p>
                <p style={{ fontSize: "24px", fontWeight: 900 }}>{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ width: "100%" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <Icon
              name="search"
              size={18}
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#71717a" }}
            />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "48px",
                paddingRight: "16px",
                paddingTop: "16px",
                paddingBottom: "16px",
                backgroundColor: "rgba(20, 20, 20, 0.5)",
                border: "1px solid #27272a",
                borderRadius: "9999px",
                outline: "none",
                transition: "all 0.2s",
                fontSize: "14px",
                color: "white"
              }}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "all 0.2s",
                border: selectedCategory === cat ? "1px solid #DEDEDE" : "1px solid #27272a",
                backgroundColor: selectedCategory === cat ? "#DEDEDE" : "#141414",
                color: selectedCategory === cat ? "#050505" : "#a1a1aa",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: `3px solid ${product.viralScore > 94 ? '#DEDEDE' : product.viralScore > 90 ? '#a855f7' : '#06b6d4'}`,
              borderRadius: "16px",
              padding: "20px",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
            onClick={() => setSelectedProduct(product)}
          >
            {/* Header: thumbnail + name + score */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1, minWidth: 0 }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "10px", overflow: "hidden", background: "#1a1a1a", flexShrink: 0 }}>
                  <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "13px", margin: "0 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                  <p style={{ fontSize: "11px", color: "#71717a", margin: 0 }}>{product.category}</p>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "10px" }}>
                <p style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 2px 0", lineHeight: 1 }}>{product.viralScore}</p>
                <p style={{ fontSize: "9px", color: "#71717a", textTransform: "uppercase", fontWeight: "bold", margin: 0 }}>Score</p>
              </div>
            </div>

            {/* Separator */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "14px" }} />

            {/* Metrics 2x2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              {[
                { label: "Preço", value: product.priceText, color: "#DEDEDE" },
                { label: "Lucro Est.", value: `R$ ${(parseFloat(product.priceText.replace('R$ ', '').replace(',', '.') || '0') * (product.commission / 100)).toFixed(2)}`, color: "#10b981" },
                { label: "Views/mês", value: `${(product.salesPerDay * 30).toLocaleString()}`, color: "#a855f7" },
                { label: "Pedidos/mês", value: String(product.salesPerDay * 30), color: "#06b6d4" },
              ].map(m => (
                <div key={m.label} style={{ background: "#1a1a1a", borderRadius: "8px", padding: "8px 10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <p style={{ fontSize: "9px", color: "#71717a", margin: "0 0 3px 0", textTransform: "uppercase", fontWeight: "bold" }}>{m.label}</p>
                  <p style={{ fontSize: "13px", fontWeight: "bold", margin: 0, color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
              {['TikTok', 'Trending', 'Hot'].map(tag => (
                <span key={tag} style={{ fontSize: "9px", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: "20px", color: "#a1a1aa", fontWeight: "bold" }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={e => { e.stopPropagation(); setSelectedProduct(product); }}
                style={{ flex: 1, padding: "9px", background: "rgba(222,222,222,0.08)", border: "1px solid rgba(222,222,222,0.15)", borderRadius: "8px", color: "#DEDEDE", fontSize: "11px", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}
              >
                Ver Detalhes
              </button>
              <button
                onClick={e => e.stopPropagation()}
                style={{ flex: 1, padding: "9px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#71717a", fontSize: "11px", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}
              >
                Criar Vídeo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {
          selectedProduct && (
            <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "896px",
                  maxHeight: "90vh",
                  backgroundColor: "#141414",
                  border: "1px solid #27272a",
                  borderRadius: "24px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                }}
              >
                {/* Modal Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", borderBottom: "1px solid #27272a" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", border: "1px solid #27272a" }}>
                      <img src={selectedProduct.imageUrl} alt="" style={{ width: "100%", height: "100%", objectCover: "cover" }} />
                    </div>
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: "bold", color: "#DEDEDE", textTransform: "uppercase", letterSpacing: "0.1em" }}>{selectedProduct.category}</span>
                      <h2 style={{ fontSize: "20px", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedProduct.name}</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "bold", color: "#eab308" }}>
                          <Icon name="star" size={12} style={{ fill: "currentColor" }} />
                          {selectedProduct.rating} • {selectedProduct.sales.toLocaleString()} vendas
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "#27272a", paddingLeft: "8px", paddingRight: "8px", paddingTop: "2px", paddingBottom: "2px", borderRadius: "4px", textTransform: "uppercase" }}>
                          Concorrência {selectedProduct.concurrency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    style={{ padding: "8px", color: "#71717a", cursor: "pointer", backgroundColor: "transparent", border: "none", borderRadius: "50%", transition: "all 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#27272a", e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = "#71717a")}
                  >
                    <Icon name="x" size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "32px" }}>
                  {/* Top Info Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
                    <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#141414", border: "1px solid #27272a", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <Icon name="trendingUp" size={20} style={{ color: "#10b981", marginBottom: "8px" }} />
                      <span style={{ fontSize: "24px", fontWeight: 900 }}>{selectedProduct.viralScore}</span>
                      <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginTop: "4px" }}>Score Viral</span>
                    </div>
                    <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#141414", border: "1px solid #27272a", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <Icon name="shoppingCart" size={20} style={{ color: "#DEDEDE", marginBottom: "8px" }} />
                      <span style={{ fontSize: "24px", fontWeight: 900 }}>{selectedProduct.salesPerDay}</span>
                      <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginTop: "4px" }}>Vendas/Dia</span>
                    </div>
                    <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#141414", border: "1px solid #27272a", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <Icon name="percent" size={20} style={{ color: "#a855f7", marginBottom: "8px" }} />
                      <span style={{ fontSize: "24px", fontWeight: 900 }}>{selectedProduct.margin}%</span>
                      <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginTop: "4px" }}>Margem Est.</span>
                    </div>
                    <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#141414", border: "1px solid #27272a", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <Icon name="dollarSign" size={20} style={{ color: "#f97316", marginBottom: "8px" }} />
                      <span style={{ fontSize: "24px", fontWeight: 900 }}>R$ {(parseFloat(selectedProduct.priceText.replace('R$ ', '').replace(',', '.')) * (selectedProduct.commission / 100)).toFixed(2)}</span>
                      <span style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginTop: "4px" }}>Comissão R$</span>
                    </div>
                  </div>

                  {/* Profit Projection */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icon name="trendingUp" size={20} style={{ color: "#DEDEDE" }} />
                      Projeção de Lucro
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                      {[
                        { label: 'Início', sales: 10, bgcolor: "#141414" },
                        { label: 'Crescimento', sales: 100, bgcolor: "#141414", border: "rgba(222,222,222,0.2)" },
                        { label: 'Escala', sales: 1000, bgcolor: "rgba(222,222,222,0.05)", border: "rgba(222,222,222,0.3)" },
                      ].map((col) => {
                        const commPerSale = parseFloat(selectedProduct.priceText.replace('R$ ', '').replace(',', '.')) * (selectedProduct.commission / 100);
                        return (
                          <div key={col.label} style={{ padding: "20px", borderRadius: "24px", border: "1px solid #27272a", backgroundColor: col.bgcolor, borderColor: col.border || "#27272a" }}>
                            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", marginBottom: "12px" }}>{col.label} ({col.sales} vendas)</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                <span style={{ color: "#a1a1aa" }}>Comissão/venda</span>
                                <span style={{ fontWeight: "bold" }}>R$ {commPerSale.toFixed(2)}</span>
                              </div>
                              <div style={{ height: "1px", backgroundColor: "#27272a", marginTop: "8px", marginBottom: "8px" }} />
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <span style={{ fontSize: "12px", color: "#a1a1aa" }}>Lucro Total</span>
                                <span style={{ fontSize: "20px", fontWeight: 900, color: "#10b981" }}>R$ {(commPerSale * col.sales).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommended Creatives */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icon name="palette" size={20} style={{ color: "#DEDEDE" }} />
                      Criativos Recomendados
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ aspectRatio: "9/16", borderRadius: "12px", backgroundColor: "#141414", border: "1px solid #27272a", overflow: "hidden", position: "relative", cursor: "pointer" }}>
                          <img src={`https://picsum.photos/seed/${selectedProduct.id}-${i}/400/700`} alt="" style={{ width: "100%", height: "100%", objectCover: "cover", opacity: 0.5 }} />
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                              <Icon name="video" size={20} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Supplier */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "24px", backgroundColor: "#141414", border: "1px solid #27272a" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>
                        <Icon name="truck" size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Prazo de Entrega</p>
                        <p style={{ fontWeight: "bold" }}>{selectedProduct.deliveryTime}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "24px", backgroundColor: "#141414", border: "1px solid #27272a" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>
                        <Icon name="store" size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase" }}>Fornecedor</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}>
                          {selectedProduct.supplierRating}/5 <Icon name="star" size={12} style={{ fill: "currentColor", color: "#eab308" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{ padding: "24px", borderTop: "1px solid #27272a", backgroundColor: "#141414", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button
                    onClick={() => handleAffiliate(selectedProduct)}
                    style={{
                      width: "100%",
                      backgroundColor: "#DEDEDE",
                      color: "#050505",
                      fontWeight: 900,
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      borderRadius: "16px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon name="link" size={20} /> Afiliar-se agora
                  </button>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => { addNotification("Produto selecionado!", "Redirecionando para o Creatoria."); }}
                      style={{ flex: 1, height: "56px", backgroundColor: "#27272a", color: "white", fontWeight: "bold", borderRadius: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    >
                      <Icon name="video" size={18} />
                      Criar Vídeo
                    </button>
                    <button
                      onClick={(e) => handleDownloadImage(e, selectedProduct)}
                      style={{ width: "56px", height: "56px", backgroundColor: "#27272a", color: "white", borderRadius: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Icon name="download" size={18} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: favorites.includes(selectedProduct.id) ? "#DEDEDE" : "#27272a",
                        color: favorites.includes(selectedProduct.id) ? "#050505" : "white"
                      }}
                    >
                      <Icon name="bookmark" size={18} style={{ fill: favorites.includes(selectedProduct.id) ? "currentColor" : "none" }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        }
      </AnimatePresence >
    </div >
  );
};

export default Radar;
