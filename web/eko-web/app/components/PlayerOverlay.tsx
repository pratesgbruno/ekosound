"use client";
import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import ColorThief from 'colorthief';
import { useAudioStore } from '../../store/useAudioStore';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Heart, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { parseLRC, LyricLine } from '../../utils/lrcParser';
import RotatingCover from './RotatingCover';
import MiniPlayer from './MiniPlayer';

const MOCK_LYRICS = `
[00:00.00] (Instrumental Intro)
[00:05.00] Breathe in deeply...
[00:10.00] Let go of the stress...
[00:15.00] Feel the rhythm of the universe...
[00:20.00] You are safe here.
[00:25.00] (Music swells)
[00:30.00] Release the fear.
[00:35.00] Embrace the light.
`;

export default function PlayerOverlay() {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        isPlayerVisible,
        setPlayerVisible,
        nextTrack,
        prevTrack,
        currentTime,
        duration,
        seek,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        favorites,
        toggleFavorite,
        dominantColor,
        setDominantColor
    } = useAudioStore();

    const { showToast } = useToast();
    const [localColor, setLocalColor] = useState('#121212');
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const overlayRef = useRef<HTMLDivElement>(null);
    const playButtonRef = useRef<HTMLButtonElement>(null);

    // Parse Lyrics on Track Change
    useEffect(() => {
        const parsed = parseLRC(MOCK_LYRICS);
        setLyrics(parsed);
    }, [currentTrack]);

    // Find active lyric index
    const activeLyricIndex = lyrics.findIndex((line, i) => {
        const nextLine = lyrics[i + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    // Extract dominant color
    useEffect(() => {
        if (currentTrack?.cover) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = currentTrack.cover;
            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    const color = colorThief.getColor(img);
                    const hex = `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
                    setLocalColor(hex);
                    setDominantColor(hex);
                } catch (e) {
                    console.error("Color extraction failed", e);
                }
            };
        }
    }, [currentTrack, setDominantColor]);

    // Slide-in/out animation for full player with anime.js
    useEffect(() => {
        if (!overlayRef.current) return;

        if (isPlayerVisible) {
            // Slide in from bottom
            anime({
                targets: overlayRef.current,
                translateY: ['100%', '0%'],
                duration: 600,
                easing: 'spring(1, 80, 10, 0)',
            });
        }
    }, [isPlayerVisible]);

    // Button scale animation on click
    const handleButtonClick = (callback: () => void) => {
        if (playButtonRef.current) {
            anime({
                targets: playButtonRef.current,
                scale: [1, 0.95, 1],
                duration: 200,
                easing: 'easeOutQuad',
            });
        }
        callback();
    };

    if (!currentTrack) return null;

    const isFav = favorites.includes(currentTrack.id);
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const formatTime = (t: number) => {
        if (!t || isNaN(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {/* MINI PLAYER (Always visible when track exists and full player is closed) */}
            {!isPlayerVisible && <MiniPlayer />}

            {/* FULL PLAYER OVERLAY */}
            {isPlayerVisible && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex flex-col soft-shadow"
                    style={{
                        background: `linear-gradient(to bottom, ${localColor} 0%, #121212 100%)`,
                        transform: 'translateY(100%)', // Initial state for anime.js
                    }}
                >
                    {/* Header */}
                    <div className="pt-12 px-6 flex justify-between items-center text-white/90">
                        <button
                            onClick={() => {
                                // Slide out animation before hiding
                                if (overlayRef.current) {
                                    anime({
                                        targets: overlayRef.current,
                                        translateY: ['0%', '100%'],
                                        duration: 400,
                                        easing: 'easeInQuad',
                                        complete: () => setPlayerVisible(false),
                                    });
                                }
                            }}
                            className="p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition"
                        >
                            <ChevronDown size={24} />
                        </button>
                        <span className="text-xs font-medium uppercase tracking-widest opacity-80">Tocando Agora</span>
                        <button
                            onClick={() => {
                                toggleFavorite(currentTrack.id);
                                showToast(isFav ? "Removido dos favoritos" : "Adicionado aos favoritos", "info");
                            }}
                            className={`p-2 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition ${isFav ? 'text-[#d67c66]' : 'text-white'}`}
                        >
                            <Heart size={20} fill={isFav ? "currentColor" : "none"} strokeWidth={isFav ? 0 : 2} />
                        </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-hide relative">
                        <div className="flex flex-col items-center gap-6 pb-20">
                            {/* Rotating Album Cover */}
                            <RotatingCover
                                cover={currentTrack.cover}
                                isPlaying={isPlaying}
                            />

                            {/* Lyrics Section */}
                            <div className="w-full space-y-4 text-center">
                                {lyrics.map((line, i) => (
                                    <p
                                        key={i}
                                        className={`font-medium transition-all duration-300 ${i === activeLyricIndex
                                                ? 'text-white text-lg font-bold scale-110'
                                                : 'text-white/60 text-base scale-100 blur-[0.5px]'
                                            }`}
                                    >
                                        {line.text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Controls Area (Fixed at bottom) */}
                    <div className="bg-black/20 backdrop-blur-3xl rounded-t-[40px] px-8 pb-10 pt-2 border-t border-white/5">
                        {/* Scrubber */}
                        <div className="mb-8 pt-6">
                            <div
                                className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const p = (e.clientX - rect.left) / rect.width;
                                    seek(p * duration);
                                }}
                            >
                                <div
                                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs font-medium text-white/50">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Main Buttons */}
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => handleButtonClick(prevTrack)}
                                className="text-white/70 hover:text-white transition p-2"
                            >
                                <SkipBack size={32} />
                            </button>
                            <button
                                ref={playButtonRef}
                                onClick={() => handleButtonClick(togglePlayPause)}
                                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition active:scale-95"
                            >
                                {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                            </button>
                            <button
                                onClick={() => handleButtonClick(nextTrack)}
                                className="text-white/70 hover:text-white transition p-2"
                            >
                                <SkipForward size={32} />
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-3">
                            <button onClick={toggleMute} className="text-white/70 hover:text-white transition">
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <div
                                className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                    setVolume(p);
                                }}
                            >
                                <div
                                    className="absolute top-0 left-0 h-full bg-white/70 rounded-full"
                                    style={{ width: `${volume * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
