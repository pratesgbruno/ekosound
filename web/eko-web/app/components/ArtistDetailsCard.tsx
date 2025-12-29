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
}

export default function ArtistDetailsCard({ artist, onFollowToggle }: ArtistDetailsCardProps) {
    return (
        <div className="w-full px-6 py-8">
            <h2 className="text-lg font-bold text-white mb-6">Sobre o artista</h2>

            <div className="glass-panel p-6 space-y-4">
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
                        <h3 className="text-xl font-bold text-[#1a3c34]">{artist.name}</h3>
                        <p className="text-sm text-[#5c6b65]">
                            {artist.monthlyListeners.toLocaleString('pt-BR')} ouvintes mensais
                        </p>
                    </div>

                    <button
                        onClick={onFollowToggle}
                        className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${artist.isFollowing
                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                            : 'bg-white text-[#1a3c34] hover:scale-105'
                            }`}
                    >
                        {artist.isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                </div>

                {/* Bio */}
                <p className="text-[#1a3c34]/80 leading-relaxed text-sm">
                    {artist.bio}
                </p>
            </div>
        </div>
    );
}
