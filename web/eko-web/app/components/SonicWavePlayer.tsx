"use client";

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
    Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
    ListMusic, Maximize2, Repeat, Shuffle, Heart, Disc
} from 'lucide-react';

export interface Track {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    coverUrl?: string;
    duration?: number;
}

export interface SonicWavePlayerRef {
    play: () => void;
    pause: () => void;
    toggle: () => void;
    next: () => void;
    prev: () => void;
    seek: (time: number) => void;
}

interface SonicWavePlayerProps {
    tracks: Track[];
    initialTrackIndex?: number;
    onTrackChange?: (track: Track) => void;
    onEnd?: () => void;
}

const SonicWavePlayer = forwardRef<SonicWavePlayerRef, SonicWavePlayerProps>(
    ({ tracks, initialTrackIndex = 0, onTrackChange, onEnd }, ref) => {
        // State
        const [isPlaying, setIsPlaying] = useState(false);
        const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [volume, setVolume] = useState(0.8);
        const [isMuted, setIsMuted] = useState(false);
        const [isDragging, setIsDragging] = useState(false);
        const [startOverlayVisible, setStartOverlayVisible] = useState(true);

        // Refs
        const audioRef = useRef<HTMLAudioElement>(null);
        const progressRef = useRef<HTMLDivElement>(null);

        const currentTrack = tracks[currentTrackIndex];

        // --- Layout Helpers ---
        // Generates random waveform bars for visual effect
        const renderWaveform = () => {
            return Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="w-1 bg-white/20 rounded-full transition-all duration-300 mx-[1px]"
                    style={{
                        height: isPlaying ? `${Math.random() * 100}%` : '20%',
                        opacity: isPlaying ? 0.8 : 0.3
                    }}
                />
            ));
        };

        // --- Logic ---
        const togglePlay = () => {
            if (!audioRef.current) return;
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            setStartOverlayVisible(false);
                        })
                        .catch((error) => {
                            console.error("Autoplay prevented:", error);
                            setStartOverlayVisible(true);
                            setIsPlaying(false);
                        });
                }
            }
        };

        const playTrack = (index: number) => {
            if (index < 0 || index >= tracks.length) return;
            setCurrentTrackIndex(index);
            // Wait for track to load in useEffect before playing
            if (onTrackChange) onTrackChange(tracks[index]);
            setIsPlaying(true);
        };

        const handleNext = () => {
            const nextIndex = (currentTrackIndex + 1) % tracks.length;
            playTrack(nextIndex);
        };

        const handlePrev = () => {
            const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            playTrack(prevIndex);
        };

        const handleTimeUpdate = () => {
            if (!audioRef.current || isDragging) return;
            setCurrentTime(audioRef.current.currentTime);
        };

        const handleLoadedMetadata = () => {
            if (!audioRef.current) return;
            setDuration(audioRef.current.duration);
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Auto-resume failed", e));
            }
        };

        const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!progressRef.current || !audioRef.current) return;
            const rect = progressRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = Math.max(0, Math.min(1, clickX / width));
            const newTime = percentage * (duration || 0); // Fallback to 0 if duration is NaN

            if (isFinite(newTime)) {
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (audioRef.current) {
                audioRef.current.volume = newVolume;
            }
            setIsMuted(newVolume === 0);
        };

        // Effects
        useEffect(() => {
            if (audioRef.current) {
                audioRef.current.volume = isMuted ? 0 : volume;
            }
        }, [volume, isMuted]);

        useImperativeHandle(ref, () => ({
            play: () => togglePlay(),
            pause: () => { if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); } },
            toggle: togglePlay,
            next: handleNext,
            prev: handlePrev,
            seek: (time) => { if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); } }
        }));

        const formatTime = (time: number) => {
            if (isNaN(time) || !isFinite(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        const progressPercent = (duration && isFinite(duration) && duration > 0)
            ? (currentTime / duration) * 100
            : 0;

        return (
            <>
                <audio
                    ref={audioRef}
                    src={currentTrack?.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => {
                        if (onEnd) onEnd();
                        handleNext();
                    }}
                    crossOrigin="anonymous"
                    onError={(e) => console.error("Audio Error:", e)}
                />

                {/* --- Start Overlay (Glass Card) --- */}
                {startOverlayVisible && !isPlaying && tracks.length > 0 && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
                        <button
                            onClick={togglePlay}
                            className="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
                                <Play size={40} className="fill-white text-white ml-2" />
                            </div>
                            <span className="relative text-white font-light tracking-widest text-sm uppercase">Start Experience</span>
                        </button>
                    </div>
                )}

                {/* --- Main Floating Glass Player --- */}
                <div className="w-[95%] max-w-4xl mx-auto h-[110px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex items-center p-4 gap-6 relative overflow-hidden transition-all hover:border-white/20">

                    {/* Background Shine Effect */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 pointer-events-none" />

                    {/* 1. Cover Art (Spinning Disc Style) */}
                    <div className="relative group shrink-0">
                        <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 shadow-lg relative z-10 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                            <img
                                src={currentTrack?.coverUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            {/* Vinyl Center Hole */}
                            <div className="absolute inset-0 m-auto w-4 h-4 bg-black/80 rounded-full border border-white/20" />
                        </div>
                        {/* Glow under cover */}
                        <div className="absolute inset-0 bg-rose-500/30 blur-xl rounded-full -z-0 scale-90 group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    {/* 2. Controls & Waveform (Center) */}
                    <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">

                        {/* Top Row: Info & Main Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col min-w-0 mr-4">
                                <h3 className="text-white font-bold text-lg leading-tight truncate drop-shadow-sm">
                                    {currentTrack?.title || "Select Track"}
                                </h3>
                                <p className="text-zinc-400 text-xs font-medium truncate">
                                    {currentTrack?.artist || "Unknown Artist"}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95">
                                    <SkipBack size={24} className="fill-current" />
                                </button>

                                <button
                                    onClick={togglePlay}
                                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isPlaying ? <Pause size={22} className="fill-black" /> : <Play size={22} className="fill-black ml-1" />}
                                </button>

                                <button onClick={handleNext} className="text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95">
                                    <SkipForward size={24} className="fill-current" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row: Scrubber & Time */}
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-[10px] text-zinc-500 font-mono w-8 text-right">{formatTime(currentTime)}</span>

                            <div
                                className="group/bar relative flex-1 h-8 flex items-center cursor-pointer"
                                ref={progressRef}
                                onClick={handleSeek}
                                onMouseDown={() => setIsDragging(true)}
                                onMouseUp={() => setIsDragging(false)}
                                onMouseLeave={() => setIsDragging(false)}
                            >
                                {/* Track Background */}
                                <div className="absolute inset-x-0 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
                                    {/* Filled Track */}
                                    <div
                                        className="h-full bg-gradient-to-r from-rose-500 to-orange-400 relative"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>

                            <span className="text-[10px] text-zinc-500 font-mono w-8">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* 3. Volume & Extras (Right) */}
                    <div className="hidden md:flex flex-col items-end gap-2 text-zinc-400">
                        <div className="flex items-center gap-2">
                            <Heart size={18} className="hover:text-rose-500 cursor-pointer transition-colors" />
                            <Shuffle size={16} className="hover:text-white cursor-pointer transition-colors" />
                            <Repeat size={16} className="hover:text-white cursor-pointer transition-colors" />
                        </div>

                        <div className="flex items-center gap-2 group/vol bg-white/5 px-2 py-1 rounded-full border border-white/5">
                            <button onClick={() => { setIsMuted(!isMuted); if (audioRef.current) audioRef.current.muted = !isMuted; }}>
                                {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                            <div className="w-16 h-1 bg-white/20 rounded-full relative cursor-pointer">
                                <input
                                    type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                                <div className="h-full bg-white rounded-full" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    }
);

SonicWavePlayer.displayName = "SonicWavePlayer";

export default SonicWavePlayer;
