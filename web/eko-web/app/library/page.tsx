"use client";
import React from 'react';
import { useAudioStore } from '../../store/useAudioStore';
import { Heart } from 'lucide-react';

export default function LibraryPage() {
    const { favorites } = useAudioStore();

    return (
        <div className="px-6 pt-12">
            <h1 className="text-2xl font-bold text-[#1a3c34] mb-8">Sua Biblioteca</h1>

            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 shadow-sm border border-white/40">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-400 flex items-center justify-center text-white shadow-md">
                        <Heart fill="currentColor" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1a3c34]">Músicas Curtidas</h3>
                        <p className="text-xs text-[#5c6b65]">{favorites.length} músicas</p>
                    </div>
                </div>

                {['Playlists', 'Artistas', 'Álbuns'].map(item => (
                    <div key={item} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-white/30 border border-white/40" />
                        <h3 className="font-bold text-[#1a3c34]">{item}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
