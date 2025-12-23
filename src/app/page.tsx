"use client";

import { useState } from "react";
import { Sparkles, Type, Palette, Layout as LayoutIcon, AlertCircle, RefreshCcw } from "lucide-react";
import KnowledgeCard from "@/components/KnowledgeCard";

interface CardData {
    title: string;
    points: string[];
}

interface AIResponse {
    contentType: string;
    suggestedCards: number;
    strategy: string[];
    cards: CardData[];
}

export default function Home() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AIResponse | null>(null);
    const [error, setError] = useState("");

    // Card customization state
    const [style, setStyle] = useState<"light" | "dark">("light");
    const [ratio, setRatio] = useState<"1:1" | "4:5">("4:5");

    const handleGenerate = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: input }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "生成失败，稍后再试");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-slate-900 px-4 py-12 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-2 mb-4 bg-blue-50 text-blue-600 rounded-full">
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span className="text-sm font-bold tracking-wider uppercase">Beta v1.0</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-slate-900">
                        Cardify <span className="text-blue-600">AI</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        将枯燥的文本，自动转化为适合社交媒体分享的高颜值知识卡片
                    </p>
                </header>

                {/* Input Section */}
                <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-12 border border-slate-100">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label htmlFor="content" className="text-sm font-bold text-slate-700">
                                输入你的思考内容
                            </label>
                            <span className="text-xs text-slate-400">{input.length} 字符</span>
                        </div>
                        <textarea
                            id="content"
                            rows={6}
                            className="w-full p-5 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none text-slate-800 text-lg leading-relaxed placeholder:text-slate-300"
                            placeholder="在这里粘贴金句、读书笔记或任何感悟..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !input.trim()}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCcw className="w-6 h-6 animate-spin" />
                                <span>AI 正在思考并策划内容...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span className="text-lg">识别内容并生成卡片</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 italic text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </section>

                {/* Results Area */}
                {result && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {/* AI Analysis Info */}
                        <div className="flex flex-col md:flex-row gap-4 items-stretch">
                            <div className="flex-1 bg-blue-600 text-white p-6 rounded-3xl shadow-lg">
                                <span className="text-blue-100 text-xs font-bold uppercase tracking-widest block mb-1">内容识别类型</span>
                                <span className="text-2xl font-black">{result.contentType}</span>
                            </div>
                            <div className="flex-[2] bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">生成策略建议 ({result.suggestedCards} 张卡片)</span>
                                <div className="flex flex-wrap gap-2">
                                    {result.strategy.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                                            {i + 1}. {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Customization Controls */}
                        <div className="flex justify-between items-center px-2">
                            <h2 className="text-xl font-bold">欣赏与预览</h2>
                            <div className="flex gap-4">
                                <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                                    <button
                                        onClick={() => setStyle("light")}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${style === "light" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        <Palette className="w-4 h-4" /> 浅色
                                    </button>
                                    <button
                                        onClick={() => setStyle("dark")}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${style === "dark" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        <Palette className="w-4 h-4" /> 深色
                                    </button>
                                </div>
                                <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                                    <button
                                        onClick={() => setRatio("1:1")}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${ratio === "1:1" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        <LayoutIcon className="w-4 h-4" /> 1:1
                                    </button>
                                    <button
                                        onClick={() => setRatio("4:5")}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${ratio === "4:5" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        <LayoutIcon className="w-4 h-4" /> 4:5
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {result.cards.map((card, index) => (
                                <KnowledgeCard
                                    key={index}
                                    card={card}
                                    style={style}
                                    ratio={ratio}
                                />
                            ))}
                        </div>

                        <footer className="pt-20 pb-10 text-center flex flex-col items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">C</div>
                            <p className="text-slate-400 text-sm">© 2024 Cardify AI. 专业知识卡片生成引擎.</p>
                        </footer>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !result && (
                    <div className="text-center py-20 px-6 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Type className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">等待灵感降临</h3>
                        <p className="text-slate-400">在上方输入框粘贴内容，点击生成即可预览您的专属知识卡片</p>
                    </div>
                )}
            </div>
        </main>
    );
}
