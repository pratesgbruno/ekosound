"use client";
import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import ColorThief from 'colorthief';
import { useAudioStore } from '../../store/useAudioStore';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Heart, MoreHorizontal, Shuffle, Repeat } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import RotatingCover from './RotatingCover';
import ArtistDetailsCard from './ArtistDetailsCard';
import ActionSheet from './ActionSheet';

export default function PlayerOverlay() {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        isPlayerVisible,
        minimizePlayer,
        nextTrack,
        prevTrack,
        currentTime,
        duration,
        seek,
        favorites,
        toggleFavorite,
        hasHydrated
    } = useAudioStore();

    const { showToast } = useToast();
    const [localColor, setLocalColor] = useState('#1a3c34');
    const [scrollY, setScrollY] = useState(0);
    const [albumScale, setAlbumScale] = useState(1.0);
    const [showStickyHeader, setShowStickyHeader] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Color Extraction
    useEffect(() => {
        if (currentTrack?.cover) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = currentTrack.cover;
            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    const color = colorThief.getColor(img);
                    setLocalColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
                } catch (e) { }
            };
        }
    }, [currentTrack]);

    // Scroll Handler - Parallax Logic
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setScrollY(scrollTop);

        // Album scale: 1.0 → 0.7 over 300px
        const newScale = Math.max(0.7, 1.0 - (scrollTop / 600));
        setAlbumScale(newScale);

        // Sticky header appears after 300px
        setShowStickyHeader(scrollTop > 300);
    };

    // ANIMATION: FLIP-like Entrance
    useEffect(() => {
        if (isPlayerVisible && overlayRef.current) {
            overlayRef.current.style.opacity = '0';
            overlayRef.current.style.transform = 'translateY(100px) scale(0.95)';

            anime({
                targets: overlayRef.current,
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.95, 1],
                duration: 500,
                easing: 'spring(1, 80, 10, 0)',
                delay: 50
            });
        }
    }, [isPlayerVisible]);

    const handleClose = () => {
        if (overlayRef.current) {
            anime({
                targets: overlayRef.current,
                opacity: 0,
                translateY: 40,
                scale: 0.95,
                duration: 300,
                easing: 'easeOutQuad',
                complete: () => minimizePlayer()
            });
        } else {
            minimizePlayer();
        }
    };

    if (!hasHydrated || !currentTrack || !isPlayerVisible) return null;

    const isFav = favorites.includes(currentTrack.id);
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    // Mock artist data
    const artistInfo = {
        name: currentTrack.artist || "EkoSound",
        bio: "Música terapêutica criada especialmente para ajudar no alívio da ansiedade, foco e relaxamento profundo. Combinamos sons binaurais com melodias suaves.",
        monthlyListeners: 12500,
        isFollowing: false
    };

    return (
        <div
            ref={overlayRef}
            className="absolute inset-0 z-[100] flex flex-col"
            style={{
                background: `linear-gradient(to bottom, ${localColor} 0%, #000000 100%)`,
            }}
        >
            {/* Sticky Header (Appears on Scroll) */}
            {showStickyHeader && (
                <div className="sticky-player-header flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <button onClick={handleClose} className="p-2 -ml-2">
                        <ChevronDown size={24} className="text-white" />
                    </button>
                    <div className="flex-1 text-center">
                        <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
                        <p className="text-xs text-white/60 truncate">{currentTrack.artist || currentTrack.category}</p>
                    </div>
                    <button
                        onClick={togglePlayPause}
                        className="p-2 -mr-2"
                    >
                        {isPlaying ? (
                            <Pause size={24} className="text-white" fill="currentColor" />
                        ) : (
                            <Play size={24} className="text-white" fill="currentColor" />
                        )}
                    </button>
                </div>
            )}

            {/* Scrollable Content */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto parallax-container scrollbar-hide"
            >
                {/* Zone 1: Header */}
                <div className="flex justify-between items-center p-6">
                    <button
                        onClick={handleClose}
                        className="p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors"
                    >
                        <ChevronDown size={24} />
                    </button>
                    <span className="text-xs font-bold tracking-widest text-white/80 uppercase">
                        {currentTrack.artist || "EkoSound"}
                    </span>
                    <button
                        onClick={() => setShowActionSheet(true)}
                        className="p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors"
                    >
                        <MoreHorizontal size={24} />
                    </button>
                </div>

                {/* Zone 2: Album Art & Track Info */}
                <div className="flex flex-col items-center px-8 mb-8">
                    <div className="w-full aspect-square max-w-[320px] mb-8 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/10 blur-3xl scale-90 rounded-full opacity-40" />
                        <RotatingCover
                            cover={currentTrack.cover || ""}
                            isPlaying={isPlaying}
                            scale={albumScale}
                        />
                    </div>

                    {/* Track Metadata */}
                    <div className="text-center w-full mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2 truncate px-4">
                            {currentTrack.title}
                        </h2>
                        <p className="text-lg text-white/70 truncate">
                            {currentTrack.artist || currentTrack.category}
                        </p>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => toggleFavorite(currentTrack.id)}
                        className="mb-4"
                    >
                        <Heart
                            size={28}
                            className={`transition-all ${isFav ? 'fill-[#a05e46] text-[#a05e46] scale-110' : 'text-white/60 hover:text-white'}`}
                        />
                    </button>
                </div>

                {/* Zone 3: Playback Controls */}
                <div className="px-8 mb-12">
                    {/* Progress Bar */}
                    <div className="mb-2">
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={(e) => seek(Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                            style={{
                                background: `linear-gradient(to right, white ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`
                            }}
                        />
                    </div>

                    {/* Time Labels */}
                    <div className="flex justify-between text-xs text-white/50 font-medium mb-8">
                        <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                        <span>-{Math.floor((duration - currentTime) / 60)}:{Math.floor((duration - currentTime) % 60).toString().padStart(2, '0')}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <button className="text-white/70 hover:text-white transition-colors">
                            <Shuffle size={24} />
                        </button>

                        <button onClick={prevTrack} className="text-white/90 hover:text-white transition-colors">
                            <SkipBack size={36} />
                        </button>

                        <button
                            onClick={togglePlayPause}
                            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                        >
                            {isPlaying ? (
                                <Pause size={36} fill="currentColor" />
                            ) : (
                                <Play size={36} fill="currentColor" className="ml-1" />
                            )}
                        </button>

                        <button onClick={nextTrack} className="text-white/90 hover:text-white transition-colors">
                            <SkipForward size={36} />
                        </button>

                        <button className="text-white/70 hover:text-white transition-colors">
                            <Repeat size={24} />
                        </button>
                    </div>
                </div>

                {/* Zone 4: Artist Details Card */}
                <ArtistDetailsCard
                    artist={artistInfo}
                    onFollowToggle={() => showToast('Funcionalidade em breve!', 'info')}
                />

                {/* Spacer for comfortable scrolling */}
                <div className="h-32" />
            </div>

            {/* Action Sheet */}
            <ActionSheet
                isOpen={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                trackTitle={currentTrack.title}
            />
        </div>
    );
}
