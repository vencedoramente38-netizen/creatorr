import React, { useState, useMemo } from 'react';
import { useApp } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  Download,
  Star,
  TrendingUp,
  ExternalLink,
  Video,
  Bookmark,
  X,
  ChevronRight,
  Info,
  DollarSign,
  Percent,
  Truck,
  Store,
  ShoppingCart,
  Flame,
  Package,
  Shield,
  Palette,
  Link
} from 'lucide-react';
import { cn } from './lib/utils';
import { Product } from './types';

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
    // In a real app, this would trigger a download
  };

  const handleAffiliate = (product: Product) => {
    addNotification("Redirecionando...", "Abrindo link do TikTok Shop para afiliação.");
    window.open(product.tiktokUrl, '_blank');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Central de Mineração</h1>
          <p className="text-zinc-400 mt-1">Descubra produtos com alto potencial de vendas no TikTok Shop.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Produtos disponíveis', value: metrics.total, icon: Package, color: 'bg-primary' },
            { label: 'Produtos Hot', value: metrics.hot, icon: Flame, color: 'bg-primary' },
            { label: 'Score alto', value: metrics.highScore, icon: TrendingUp, color: 'bg-primary' },
            { label: 'Baixa concorrência', value: metrics.lowConcurrency, icon: Shield, color: 'bg-primary' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-3xl bg-[#09090B]/50 border border-zinc-800 flex items-center gap-4"
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0", card.color)}>
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-black">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#09090B]/50 border border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-[#09090B] border-zinc-800 text-zinc-400 hover:border-zinc-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-[#09090B] border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-primary/5"
          >
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 shadow-xl"
                >
                  Ver Detalhes
                </button>
              </div>

              {/* Floating Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90",
                    favorites.includes(product.id) ? "bg-primary text-white" : "bg-white/90 text-zinc-900 hover:bg-white"
                  )}
                >
                  <Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={(e) => handleDownloadImage(e, product)}
                  className="w-10 h-10 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center shadow-lg hover:bg-white transition-all active:scale-90"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                  <Star size={12} fill="currentColor" />
                  {product.rating} • {product.sales.toLocaleString()} vendas
                </div>
              </div>

              <h3 className="font-bold text-sm line-clamp-2 h-10 group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
                  <span>Score Viral</span>
                  <span>{product.viralScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${product.viralScore}%` }}
                    className={cn(
                      "h-full rounded-full",
                      product.viralScore > 90 ? "bg-emerald-500" : product.viralScore > 80 ? "bg-primary" : "bg-yellow-500"
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black">{product.priceText}</span>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20">
                  {product.commission}% comissão
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#09090B] border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-800">
                    <img src={selectedProduct.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{selectedProduct.category}</span>
                    <h2 className="text-xl font-bold line-clamp-1">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        {selectedProduct.rating} • {selectedProduct.sales.toLocaleString()} vendas
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded uppercase">
                        Concorrência {selectedProduct.concurrency}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Top Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex flex-col items-center text-center">
                    <TrendingUp size={20} className="text-emerald-500 mb-2" />
                    <span className="text-2xl font-black">{selectedProduct.viralScore}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Score Viral</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex flex-col items-center text-center">
                    <ShoppingCart size={20} className="text-primary mb-2" />
                    <span className="text-2xl font-black">{selectedProduct.salesPerDay}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Vendas/Dia</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex flex-col items-center text-center">
                    <Percent size={20} className="text-purple-500 mb-2" />
                    <span className="text-2xl font-black">{selectedProduct.margin}%</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Margem Est.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#09090B] border border-zinc-800 flex flex-col items-center text-center">
                    <DollarSign size={20} className="text-orange-500 mb-2" />
                    <span className="text-2xl font-black">R$ {(parseFloat(selectedProduct.priceText.replace('R$ ', '').replace(',', '.')) * (selectedProduct.commission / 100)).toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Comissão R$</span>
                  </div>
                </div>

                {/* Profit Projection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Projeção de Lucro
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Início', sales: 10, color: 'bg-[#09090B]' },
                      { label: 'Crescimento', sales: 100, color: 'bg-[#09090B] border-primary/20' },
                      { label: 'Escala', sales: 1000, color: 'bg-primary/5 border-primary/30' },
                    ].map((col) => {
                      const commPerSale = parseFloat(selectedProduct.priceText.replace('R$ ', '').replace(',', '.')) * (selectedProduct.commission / 100);
                      return (
                        <div key={col.label} className={cn("p-5 rounded-2xl border border-zinc-800", col.color)}>
                          <p className="text-xs font-bold text-zinc-500 uppercase mb-3">{col.label} ({col.sales} vendas)</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-zinc-400">Comissão/venda</span>
                              <span className="font-bold">R$ {commPerSale.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-zinc-800 my-2" />
                            <div className="flex justify-between items-end">
                              <span className="text-xs text-zinc-400">Lucro Total</span>
                              <span className="text-xl font-black text-emerald-500">R$ {(commPerSale * col.sales).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Creatives */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Palette size={20} className="text-primary" />
                    Criativos Recomendados
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-[9/16] rounded-xl bg-[#09090B] border border-zinc-800 overflow-hidden relative group cursor-pointer">
                        <img src={`https://picsum.photos/seed/${selectedProduct.id}-${i}/400/700`} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Video size={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Supplier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#09090B] border border-zinc-800">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">Prazo de Entrega</p>
                      <p className="font-bold">{selectedProduct.deliveryTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#09090B] border border-zinc-800">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Store size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">Fornecedor</p>
                      <div className="flex items-center gap-1 font-bold">
                        {selectedProduct.supplierRating}/5 <Star size={12} fill="currentColor" className="text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-zinc-800 bg-[#09090B] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAffiliate(selectedProduct)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Link size={20} /> Afiliar-se agora
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => { addNotification("Produto selecionado!", "Redirecionando para o Creatoria."); /* In a real app, change tab */ }}
                    className="flex-1 sm:flex-none px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Video size={18} />
                    Criar Vídeo
                  </button>
                  <button
                    onClick={(e) => handleDownloadImage(e, selectedProduct)}
                    className="p-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={cn(
                      "p-4 rounded-2xl transition-all",
                      favorites.includes(selectedProduct.id) ? "bg-primary text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"
                    )}
                  >
                    <Bookmark size={18} fill={favorites.includes(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Radar;
