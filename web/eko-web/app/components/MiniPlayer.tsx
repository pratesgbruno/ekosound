"use client";
import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import ColorThief from 'colorthief';
import { useAudioStore } from '../../store/useAudioStore';
import { Play, Pause, SkipForward } from 'lucide-react';

export default function MiniPlayer() {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        maximizePlayer,
        isPlayerVisible,
        currentTime,
        duration,
        nextTrack,
    } = useAudioStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const [bgColor, setBgColor] = useState('rgba(214, 124, 102, 0.9)');
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    // ... (useEffect for color extraction remains same)

    useEffect(() => {
        if (currentTrack?.cover) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = currentTrack.cover;
            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    const color = colorThief.getColor(img);
                    setBgColor(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.95)`);
                } catch (e) {
                    console.error("Color extraction failed", e);
                }
            };
        }
    }, [currentTrack]);

    useEffect(() => {
        if (containerRef.current && currentTrack && !isPlayerVisible) {
            anime({
                targets: containerRef.current,
                translateY: [40, 0],
                opacity: [0, 1],
                duration: 600,
                easing: 'spring(1, 80, 10, 0)',
            });
        }
    }, [currentTrack, isPlayerVisible]);

    if (!currentTrack || isPlayerVisible) return null;

    return (
        <div
            ref={containerRef}
            onClick={maximizePlayer}
            className="fixed bottom-[96px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 z-[55] cursor-pointer"
            style={{ opacity: 0 }}
        >
            <div
                className="relative bg-[#F4F6F0]/85 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/60 flex items-center p-3 gap-3"
            >
                {/* Progress Bar (Bottom Edge) - Only for audio */}
                {currentTrack.type !== 'video' && (
                    <div className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#E0E5D5] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#A05E46] transition-all duration-300 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                )}

                {/* Album Art */}
                <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden shadow-sm">
                    <img
                        src={currentTrack.cover}
                        className="w-full h-full object-cover"
                        alt="Cover"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-black truncate leading-tight">
                        {currentTrack.title}
                    </h4>
                    <p className="text-[11px] text-black/60 truncate font-medium">
                        {currentTrack.artist || currentTrack.category}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 ml-auto pr-1 pb-1">
                    {currentTrack.type === 'video' ? (
                        <div className="px-3 py-1 bg-[#a05e46]/10 rounded-full border border-[#a05e46]/20">
                            <span className="text-[10px] font-bold text-[#a05e46] uppercase">Vídeo</span>
                        </div>
                    ) : (
                        <>
                            {/* Visualizer Icon Placeholder */}
                            <div className="w-8 h-8 flex items-center justify-center opacity-40">
                                <div className="flex gap-0.5 items-end h-3">
                                    <div className="w-0.5 bg-black animate-[soundwave_1s_infinite] h-2"></div>
                                    <div className="w-0.5 bg-black animate-[soundwave_1.2s_infinite] h-full"></div>
                                    <div className="w-0.5 bg-black animate-[soundwave_0.8s_infinite] h-1.5"></div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlayPause();
                                }}
                                className="w-10 h-10 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-sm"
                            >
                                {isPlaying ? (
                                    <Pause size={18} fill="currentColor" />
                                ) : (
                                    <Play size={18} fill="currentColor" className="ml-0.5" />
                                )}
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextTrack();
                                }}
                                className="w-10 h-10 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-sm"
                            >
                                <SkipForward size={18} fill="currentColor" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
