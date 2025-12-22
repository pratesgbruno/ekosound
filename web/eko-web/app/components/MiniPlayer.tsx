"use client";
import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import ColorThief from 'colorthief';
import { useAudioStore } from '../../store/useAudioStore';
import { Play, Pause } from 'lucide-react';

export default function MiniPlayer() {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        setPlayerVisible,
        currentTime,
        duration,
    } = useAudioStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const [bgColor, setBgColor] = useState('rgba(214, 124, 102, 0.9)'); // Default terracota
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    // Extract dominant color from album art
    useEffect(() => {
        if (currentTrack?.cover) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = currentTrack.cover;
            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    const color = colorThief.getColor(img);
                    setBgColor(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`);
                } catch (e) {
                    console.error("Color extraction failed", e);
                }
            };
        }
    }, [currentTrack]);

    // Slide-up animation on mount using anime.js
    useEffect(() => {
        if (containerRef.current && currentTrack) {
            anime({
                targets: containerRef.current,
                translateY: [100, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutElastic(1, .6)',
            });
        }
    }, [currentTrack]);

    if (!currentTrack) return null;

    return (
        <div
            ref={containerRef}
            onClick={() => setPlayerVisible(true)}
            className="fixed bottom-6 left-4 right-4 z-40 cursor-pointer"
            style={{ opacity: 0 }} // Initial state for anime.js
        >
            <div
                className="relative rounded-2xl shadow-xl overflow-hidden backdrop-blur-md border border-white/50"
                style={{ background: bgColor }}
            >
                {/* Progress Bar at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                    <div
                        className="h-full bg-white/80 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-3 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                        <img
                            src={currentTrack.cover}
                            className="w-full h-full object-cover"
                            alt="Cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                            {currentTrack.title}
                        </h4>
                        <p className="text-xs text-white/80 truncate">
                            {currentTrack.category}
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlayPause();
                        }}
                        className="w-10 h-10 rounded-full bg-white/90 text-[#d67c66] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    >
                        {isPlaying ? (
                            <Pause size={18} fill="currentColor" />
                        ) : (
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
