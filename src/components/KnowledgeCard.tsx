"use client";

import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeCardProps {
    card: {
        title: string;
        points: string[];
    };
    style: "light" | "dark";
    ratio: "1:1" | "4:5";
}

export default function KnowledgeCard({ card, style, ratio }: KnowledgeCardProps) {
    const isDark = style === "dark";
    const isSquare = ratio === "1:1";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
        relative overflow-hidden shadow-2xl transition-all duration-500 rounded-lg
        ${isSquare ? "aspect-square" : "aspect-[4/5]"}
        ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800"}
        border ${isDark ? "border-slate-800" : "border-slate-100"}
      `}
        >
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full -mr-16 -mt-16 ${isDark ? "bg-blue-400" : "bg-blue-200"}`} />
            <div className={`absolute bottom-0 left-0 w-24 h-24 blur-3xl opacity-10 rounded-full -ml-12 -mb-12 ${isDark ? "bg-indigo-400" : "bg-indigo-200"}`} />

            <div className="relative h-full flex flex-col p-8 md:p-10">
                {/* Card Number / Decorative Element */}
                <div className={`text-xs font-mono uppercase tracking-widest mb-6 opacity-40 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    Knowledge Insight
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-8 mb-auto">
                    {card.title}
                </h3>

                {/* Points */}
                <div className="space-y-6 mt-4">
                    {card.points.map((point, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                            <div className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-blue-400" : "bg-blue-500"}`} />
                            <p className="text-base md:text-lg leading-relaxed opacity-90 font-medium">
                                {point}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-current opacity-10 flex justify-between items-center">
                    <span className="text-xs font-semibold tracking-tighter">Cardify AI</span>
                    <div className="w-8 h-1 bg-current opacity-50 rounded-full" />
                </div>
            </div>
        </motion.div>
    );
}
