"use client";
import React from 'react';

export default function SearchPage() {
    return (
        <div className="px-6 pt-12">
            <h1 className="text-2xl font-bold text-[#1a3c34] mb-6">Buscar</h1>
            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Artistas, músicas ou podcasts"
                    className="w-full bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl py-4 px-6 text-sm text-[#1a3c34] placeholder-[#5c6b65]/50 focus:outline-none focus:ring-2 focus:ring-[#a05e46]/20 transition-all shadow-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {['Podcasts', 'Para Relaxar', 'Foco', 'Sono'].map(cat => (
                    <div key={cat} className="aspect-square rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 p-4 flex items-end shadow-sm hover:bg-white/50 transition-colors cursor-pointer">
                        <span className="font-bold text-[#1a3c34]">{cat}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
