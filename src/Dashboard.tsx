import React from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Icon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({ name, size = 24, style }) => {
  const icons: Record<string, React.ReactNode> = {
    trendingUp: <React.Fragment><path d="m22 7-8.5 8.5-5-5L2 17" /><polyline points="16 7 22 7 22 13" /></React.Fragment>,
    shoppingCart: <React.Fragment><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></React.Fragment>,
    barChart3: <React.Fragment><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></React.Fragment>,
    package: <React.Fragment><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.27 6.96 8.73 5.04 8.73-5.04" /><path d="M12 22.08V12" /></React.Fragment>,
    alertTriangle: <React.Fragment><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></React.Fragment>,
    flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 3.333 3 5 1.237 2.062.326 3.919-.606 5.606-.8.8-1.144 1.341-1.144 2.894 0 2.209 1.791 4 4 4 2.209 0 4-1.791 4-4 0-1.553-.344-3.094-1.144-4.144C16.143 14.143 16 13.143 16 12.143c0-2.209-1.791-4-4-4-1.38 0-2.5 1.12-2.5 2.5 0 1.381 1.791 2.5 3.5 2.5 2.209 0 4-1.791 4-4" />,
    fileText: <React.Fragment><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></React.Fragment>
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

const Dashboard: React.FC = () => {
  const { stats, products } = useApp();

  const alerts = [
    { id: 1, icon: 'flame', text: "Novo produto em alta no TikTok Shop", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.5)" },
    { id: 2, icon: 'barChart3', text: "Comissões pendentes para revisão", color: "#DEDEDE", bg: "rgba(222, 222, 222, 0.1)", border: "rgba(222, 222, 222, 0.5)" },
    { id: 3, icon: 'fileText', text: "Atualização de termos disponível", color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.5)" },
  ];

  const statCards = [
    { label: 'Faturamento Total', value: stats.faturamento, sublabel: 'Faturamento total', icon: 'trendingUp', color: '#10b981' },
    { label: 'Pedidos', value: stats.pedidos.toString(), sublabel: 'Pedidos', icon: 'shoppingCart', color: '#DEDEDE' },
    { label: 'Comissão Total', value: stats.comissao, sublabel: 'Comissão total', icon: 'barChart3', color: '#a855f7' },
    { label: 'Produtos Ativos', value: products.length.toString(), sublabel: 'Produtos ativos', icon: 'package', color: '#f97316' },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "40px" }}>
      <div>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", letterSpacing: "-0.025em" }}>Resumo da Operação</h1>
        <p style={{ color: "#a1a1aa", marginTop: "4px" }}>Acompanhe faturamento e comissões do seu ecossistema TikTok Shop.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: "24px",
              borderRadius: "24px",
              backgroundColor: "#141414",
              border: "1px solid #27272a",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{
                padding: "8px",
                borderRadius: "12px",
                backgroundColor: "#27272a",
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Icon name={card.icon} size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "-0.025em" }}>{card.value}</h3>
            <p style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>{card.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* Featured Section: Continue de onde parou */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.15) 100%)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px",
            display: "flex", flexDirection: "column", gap: "20px", position: "relative", overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(168,85,247,0.2)", filter: "blur(60px)" }} />

          <div>
            <span style={{ fontSize: "11px", fontWeight: 900, background: "#a855f7", color: "white", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>Em Andamento</span>
            <h3 style={{ fontSize: "22px", fontWeight: 900, margin: "12px 0 8px 0" }}>Continue de onde parou</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: 0 }}>Você estava editando o roteiro para o produto "Escova Alisadora".</p>
          </div>

          <button className="rainbow-btn" style={{ width: "fit-content", padding: "12px 24px", minWidth: 160, borderRadius: "12px" }}>
            Continuar Agora →
          </button>
        </motion.div>

        {/* Dicas Rapidas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: "#141414", border: "1px solid #27272a", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Dicas para você 💡</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { text: "Vídeos com ganchos de curiosidade estão convertendo 30% mais hoje.", icon: "📈" },
              { text: "O cenário 'Estúdio' aumentou a retenção média em 4 segundos.", icon: "🧪" }
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "start" }}>
                <span style={{ fontSize: "20px" }}>{tip.icon}</span>
                <p style={{ fontSize: "13px", color: "#a1a1aa", margin: 0, lineHeight: 1.5 }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {/* Sales Evolution Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            gridColumn: "span 2",
            padding: "24px",
            borderRadius: "24px",
            backgroundColor: "#141414",
            border: "1px solid #27272a"
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "24px" }}>Evolução de Vendas</h3>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DEDEDE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DEDEDE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#DEDEDE"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
