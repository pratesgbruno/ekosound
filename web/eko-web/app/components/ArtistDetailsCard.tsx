"use client";
import React from 'react';
import { UserPlus } from 'lucide-react';

interface ArtistDetailsCardProps {
    artist: {
        name: string;
        avatar?: string;
        bio: string;
        monthlyListeners: number;
        isFollowing?: boolean;
    };
    onFollowToggle?: () => void;
    mode?: 'light' | 'dark';
}

export default function ArtistDetailsCard({ artist, onFollowToggle, mode = 'light' }: ArtistDetailsCardProps) {
    const isDark = mode === 'dark';
    return (
        <div className="w-full px-6 py-8">
            <h2 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Sobre o artista</h2>

            <div className={`glass-panel p-6 space-y-4 ${isDark ? 'bg-black/20 border-white/10' : ''}`}>
                {/* Artist Header */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#a05e46] to-[#5c7a64] flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg">
                        {artist.avatar ? (
                            <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                        ) : (
                            artist.name.charAt(0)
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1a3c34]'}`}>{artist.name}</h3>
                        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5c6b65]'}`}>
                            {artist.monthlyListeners.toLocaleString('pt-BR')} ouvintes mensais
                        </p>
                    </div>

                    <button
                        onClick={onFollowToggle}
                        className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${isDark
                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                            : (artist.isFollowing
                                ? 'bg-white/10 text-[#1a3c34] border border-[#1a3c34]/20'
                                : 'bg-[#1a3c34] text-white hover:scale-105')
                            }`}
                    >
                        {artist.isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                </div>

                {/* Bio */}
                <p className={`leading-relaxed text-sm ${isDark ? 'text-white/80' : 'text-[#1a3c34]/80'}`}>
                    {artist.bio}
                </p>
            </div>
        </div>
    );
}
