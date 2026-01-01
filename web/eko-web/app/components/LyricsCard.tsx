"use client";
import React from 'react';

interface LyricsCardProps {
    lyrics: string;
    mode?: 'light' | 'dark';
}

export default function LyricsCard({ lyrics, mode = 'light' }: LyricsCardProps) {
    const isDark = mode === 'dark';

    // Safety check for lyrics - if empty, render nothing
    if (!lyrics) return null;

    return (
        <div className="w-full px-6 py-8">
            <h2 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Letra</h2>

            <div className={`glass-panel p-6 ${isDark ? 'bg-black/20 border-white/10' : ''}`}>
                <p className={`leading-relaxed text-base font-medium whitespace-pre-wrap tracking-wide ${isDark ? 'text-white/90' : 'text-[#1a3c34]/90'}`} style={{ lineHeight: '1.8' }}>
                    {lyrics}
                </p>
            </div>
        </div>
    );
}
