import React from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import {
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Package,
  AlertTriangle,
  Flame,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard: React.FC = () => {
  const { stats } = useApp();

  const alerts = [
    { id: 1, icon: Flame, text: "Novo produto em alta no TikTok Shop", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/50" },
    { id: 2, icon: BarChart3, text: "Comissões pendentes para revisão", color: "text-primary", bg: "bg-primary/10", border: "border-primary/50" },
    { id: 3, icon: FileText, text: "Atualização de termos disponível", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/50" },
  ];

  const statCards = [
    { label: 'Faturamento Total', value: stats.faturamento, sublabel: 'Faturamento total', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Pedidos', value: stats.pedidos.toString(), sublabel: 'Pedidos', icon: ShoppingCart, color: 'text-primary' },
    { label: 'Comissão Total', value: stats.comissao, sublabel: 'Comissão total', icon: BarChart3, color: 'text-purple-500' },
    { label: 'Produtos Ativos', value: stats.produtosAtivos.toString(), sublabel: 'Produtos ativos', icon: Package, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resumo da Operação</h1>
        <p className="text-zinc-400 mt-1">Acompanhe faturamento e comissões do seu ecossistema TikTok Shop.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-[#09090B] border border-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-zinc-800 ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">{card.sublabel}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Evolution Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-[#09090B] border border-zinc-800"
        >
          <h3 className="text-lg font-bold mb-6">Evolução de Vendas</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF236C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF236C" stopOpacity={0} />
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
                  contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#FF236C"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alerts */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-[#09090B] border border-zinc-800"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-500" />
              Alertas de sistema
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-l-4 ${alert.bg} ${alert.border} transition-transform hover:translate-x-1 cursor-pointer`}
                >
                  <alert.icon size={16} className={alert.color} />
                  <span className="text-xs font-medium text-zinc-200">{alert.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
