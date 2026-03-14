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
              background: "#09090B",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Área da imagem */}
            <div style={{ position: "relative", height: 200, background: "#f5f5f5", overflow: "hidden" }}>
              <img
                src={product.image_url || product.imageUrl || product.image}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* Badges sobre a imagem */}
              <div style={{
                position: "absolute", top: 8, left: 8,
                background: "#FF4500", color: "white",
                borderRadius: 20, fontSize: 11, fontWeight: 700,
                padding: "3px 8px", display: "flex", alignItems: "center", gap: 4,
              }}>
                <Icon name="flame" size={12} /> Hot
              </div>

              <div style={{
                position: "absolute", top: 8, left: 60,
                background: "rgba(0,0,0,0.7)", color: "white",
                borderRadius: 20, fontSize: 11, padding: "3px 8px",
              }}>
                #{Math.floor(Math.random() * 10) + 1}
              </div>

              {/* Botões ação */}
              <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)", border: "none",
                    color: favorites.includes(product.id) ? "#FF4500" : "white", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Icon name="heart" size={16} style={{ fill: favorites.includes(product.id) ? "currentColor" : "none" }} />
                </button>
                <button
                  onClick={(e) => handleDownloadImage(e, product)}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)", border: "none",
                    color: "white", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Icon name="download" size={16} />
                </button>
              </div>

              {/* Botão Ver Análise Completa */}
              <button
                onClick={() => setSelectedProduct(product)}
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "rgba(255,69,0,0.9)",
                  color: "white", border: "none",
                  padding: "10px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", textAlign: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                Ver Análise Completa
              </button>
            </div>

            {/* Área de info */}
            <div style={{ padding: "12px 14px", background: "#09090B" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {product.name}
              </h3>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>{product.category}</p>

              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#eab308", display: "flex", alignItems: "center", gap: 2 }}>
                  <Icon name="star" size={12} style={{ fill: "currentColor" }} /> {product.rating || "4.7"}
                </span>
                • {product.sales?.toLocaleString() || "19.200"} vendas
              </div>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

              {/* Score Viral */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Score Viral</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{product.viralScore}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 2 }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    background: "linear-gradient(to right, #10b981, #DEDEDE)",
                    width: product.viralScore + "%"
                  }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "white" }}>{product.priceText}</span>
                <span style={{
                  display: "inline-block", background: "rgba(16,185,129,0.15)",
                  color: "#10b981", borderRadius: 20, fontSize: 11,
                  padding: "2px 8px", marginLeft: 8, fontWeight: 600
                }}>
                  {product.commission}% comissão
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {
          selectedProduct && (
            <div style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.85)",
              zIndex: 1000, display: "flex",
              alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)", padding: 16,
            }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                style={{ position: "absolute", inset: 0 }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                style={{
                  background: "#09090B",
                  borderRadius: 20,
                  maxWidth: 560, width: "100%",
                  maxHeight: "90vh", overflowY: "auto",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: 24, position: "relative",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                }}
              >
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{ position: "absolute", top: 16, right: 16, padding: "8px", color: "#64748b", cursor: "pointer", backgroundColor: "transparent", border: "none" }}
                >
                  <Icon name="x" size={20} />
                </button>

                <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
                  <div style={{ width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
                    <img src={selectedProduct.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{selectedProduct.category}</span>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", margin: "4px 0" }}>{selectedProduct.name}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8" }}>
                      <span style={{ color: "#eab308", display: "flex", alignItems: "center", gap: 2 }}>
                        <Icon name="star" size={12} style={{ fill: "currentColor" }} /> {selectedProduct.rating}
                      </span>
                      • {selectedProduct.sales.toLocaleString()} vendas
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 8, fontSize: 11, color: "#94a3b8" }}>
                        Concorrência {selectedProduct.concurrency}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginBottom: "20px", fontSize: "14px" }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "white" }}>{selectedProduct.priceText}</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>{selectedProduct.commission}% comissão</span>
                </div>

                <div style={{ display: "flex", gap: "12px", marginBottom: "24px", color: "#94a3b8", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="truck" size={14} /> 7-15 dias
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="store" size={14} /> Fornecedor {selectedProduct.supplierRating}/5
                  </div>
                </div>

                <button
                  onClick={() => handleAffiliate(selectedProduct)}
                  style={{
                    width: "100%",
                    background: "#FF4500",
                    color: "white", border: "none",
                    borderRadius: 12, padding: "13px",
                    fontSize: 15, fontWeight: 700,
                    cursor: "pointer", marginTop: 16,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                  }}
                >
                  <Icon name="link" size={20} /> Afiliar-se a este Produto
                </button>

                {/* Grid de Métricas */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "24px" }}>
                  {[
                    { label: "Score Viral", value: selectedProduct.viralScore },
                    { label: "Vendas/Dia", value: Math.round(selectedProduct.sales / 30) },
                    { label: "% Marg.", value: "30%" },
                    { label: "$ Com.", value: `R$ ${(parseFloat(selectedProduct.priceText.replace('R$ ', '').replace(',', '.')) * (selectedProduct.commission / 100)).toFixed(2)}` }
                  ].map((m, i) => (
                    <div key={i} style={{
                      background: "#09090B",
                      borderRadius: 12, padding: "12px 8px",
                      textAlign: "center",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <p style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>{m.label}</p>
                      <p style={{ fontSize: 16, fontWeight: 900, color: "white", margin: 0 }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Projeção de Lucro */}
                <div style={{ marginTop: "32px" }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: "white", marginBottom: "16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="dollarSign" size={16} /> Projeção de Lucro
                  </h4>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {[
                      { label: "Início", sales: 10 },
                      { label: "Crescimento", sales: 100 },
                      { label: "Escala", sales: 1000 }
                    ].map((p, i) => {
                      const comm = parseFloat(selectedProduct.priceText.replace('R$ ', '').replace(',', '.')) * (selectedProduct.commission / 100);
                      return (
                        <div key={i} style={{
                          background: "#09090B",
                          borderRadius: 12, padding: 14,
                          border: "1px solid rgba(255,255,255,0.06)",
                          flex: 1,
                        }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "white", marginBottom: 8 }}>{p.label}</p>
                          <p style={{ fontSize: 10, color: "#64748b", margin: 0 }}>{p.sales} vendas</p>
                          <p style={{ fontSize: 10, color: "#10b981", fontWeight: 700, margin: "4px 0" }}>R$ {comm.toFixed(2)}/vd</p>
                          <p style={{ fontSize: 12, fontWeight: 800, color: "white", margin: 0 }}>Total R$ {(comm * p.sales).toFixed(0)}</p>
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 10, color: "#64748b", marginTop: 12, fontStyle: "italic" }}>
                    * Projeção baseada em tráfego orgânico
                  </p>
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
