import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ExternalLink, Users } from 'lucide-react';
import { HoverBorderGradient } from './components/ui/hover-border-gradient';

export function Academy() {
    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            <header className="space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Academy</h1>
                </div>
                <p className="text-zinc-400 max-w-2xl">
                    Aprenda as melhores estratégias para viralizar no TikTok e escalar seus resultados com o Creator Lab e Vencedoramente.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl space-y-6"
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Comunidade VIP
                        </h2>
                        <p className="text-zinc-400">
                            Entre no nosso grupo exclusivo de alunos e receba suporte direto dos nossos especialistas.
                        </p>
                    </div>

                    <div className="pt-4">
                        <HoverBorderGradient
                            containerClassName="w-full"
                            className="w-full flex items-center justify-center space-x-2 py-4 text-lg font-medium"
                            onClick={() => window.open('https://chat.whatsapp.com/G82q1f2n7L576v6E4k9m3J', '_blank')}
                        >
                            <span>Entrar no Grupo WhatsApp</span>
                            <ExternalLink className="w-5 h-5" />
                        </HoverBorderGradient>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop"
                        alt="Academy Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-center space-y-2 p-6">
                            <span className="text-primary font-semibold tracking-wider uppercase text-xs">Em breve</span>
                            <h3 className="text-2xl font-bold">Cursos Exclusivos</h3>
                            <p className="text-zinc-400 text-sm">Estamos preparando um conteúdo épico para você.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
