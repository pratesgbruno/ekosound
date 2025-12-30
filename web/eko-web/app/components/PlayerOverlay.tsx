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
    const [albumScale, setAlbumScale] = useState(1.0);
    const [showStickyHeader, setShowStickyHeader] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [bgImage, setBgImage] = useState('');
    const overlayRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const BG_IMAGES = [
        '0.png', '1.png', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg',
        '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '15.jpg',
        '16.jpg', '16.png', '17.jpg'
    ];

    // Background Image Selection
    useEffect(() => {
        if (currentTrack?.id) {
            const randomIndex = Math.floor(Math.random() * BG_IMAGES.length);
            setBgImage(`/bg/${BG_IMAGES[randomIndex]}`);
        }
    }, [currentTrack?.id]);

    // Color Extraction
    useEffect(() => {
        if (currentTrack?.cover && currentTrack.type !== 'video') {
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

    // Scroll Handler
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        const newScale = Math.max(0.7, 1.0 - (scrollTop / 600));
        setAlbumScale(newScale);
        setShowStickyHeader(scrollTop > 200);
    };

    // Entrance Animation
    useEffect(() => {
        if (isPlayerVisible && overlayRef.current) {
            anime({
                targets: overlayRef.current,
                opacity: [0, 1],
                translateY: [100, 0],
                easing: 'spring(1, 80, 10, 0)',
                duration: 500
            });
        }
    }, [isPlayerVisible]);

    const handleClose = () => {
        if (overlayRef.current) {
            anime({
                targets: overlayRef.current,
                opacity: 0,
                translateY: 100,
                easing: 'easeInQuad',
                duration: 300,
                complete: () => minimizePlayer()
            });
        } else {
            minimizePlayer();
        }
    };

    if (!hasHydrated || !currentTrack || !isPlayerVisible) return null;

    const isFav = favorites.includes(currentTrack.id);
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    const artistInfo = {
        name: currentTrack.artist || "EkoSound",
        bio: "Música terapêutica criada especialmente para ajudar no alívio da ansiedade, foco e relaxamento profundo.",
        monthlyListeners: 12500,
        isFollowing: false
    };

    return (
        <div
            ref={overlayRef}
            className={`absolute inset-0 z-[100] flex flex-col overflow-hidden ${currentTrack.type === 'video' ? 'bg-transparent pointer-events-none' : 'bg-black'}`}
        >
            {/* Background Image Layer */}
            {currentTrack.type !== 'video' && bgImage && (
                <div
                    className="absolute inset-0 z-0 scale-110"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(30px) brightness(0.4)',
                        opacity: 0.8
                    }}
                />
            )}

            {/* Video Background placeholder - Handled by PersistentVideo globally to keep playing */}
            {currentTrack.type === 'video' && (
                <div className="absolute top-0 left-0 right-0 h-[60vh] z-[1] pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            )}

            {currentTrack.type !== 'video' && (
                <div className="absolute inset-0 z-[1]" style={{ background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)` }} />
            )}

            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 z-[50] flex justify-between items-center p-6 pointer-events-none">
                <button
                    onClick={handleClose}
                    className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors pointer-events-auto"
                >
                    <ChevronDown size={24} />
                </button>
                <div className="text-center pointer-events-none">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase block">
                        {currentTrack.artist || "EkoSound"}
                    </span>
                    {showStickyHeader && (
                        <p className="text-xs font-bold text-white truncate max-w-[200px] animate-in fade-in slide-in-from-top-1">
                            {currentTrack.title}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setShowActionSheet(true)}
                    className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors pointer-events-auto"
                >
                    <MoreHorizontal size={24} />
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="absolute inset-0 z-10 overflow-y-auto scrollbar-hide pointer-events-none"
            >
                {/* Hollow space for video interaction */}
                <div className={currentTrack.type === 'video' ? "h-[60vh] w-full" : "h-20 w-full"} />

                {/* Content Panel */}
                <div className="relative z-10 bg-black min-h-screen pointer-events-auto pt-8">
                    {/* Media Info */}
                    <div className="flex flex-col items-center px-8 mb-8">
                        {currentTrack.type !== 'video' && (
                            <div className="w-full aspect-square max-w-[320px] mb-8 relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-white/10 blur-3xl scale-90 rounded-full opacity-40" />
                                <RotatingCover
                                    cover={currentTrack.cover || ""}
                                    isPlaying={isPlaying}
                                    scale={albumScale}
                                />
                            </div>
                        )}

                        <div className="text-center w-full mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2 truncate px-4">
                                {currentTrack.title}
                            </h2>
                            <p className="text-lg text-white/70 truncate">
                                {currentTrack.artist || currentTrack.category}
                            </p>
                        </div>

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

                    {/* Audio Controls */}
                    {currentTrack.type !== 'video' && (
                        <div className="px-8 mb-12">
                            <div className="mb-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={(e) => seek(Number(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, white ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-white/50 font-medium mb-8">
                                <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                                <span>-{Math.floor((duration - currentTime) / 60)}:{Math.floor((duration - currentTime) % 60).toString().padStart(2, '0')}</span>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <Shuffle size={24} className="text-white/70" />
                                <button onClick={prevTrack} className="text-white"><SkipBack size={36} /></button>
                                <button
                                    onClick={togglePlayPause}
                                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
                                >
                                    {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
                                </button>
                                <button onClick={nextTrack} className="text-white"><SkipForward size={36} /></button>
                                <Repeat size={24} className="text-white/70" />
                            </div>
                        </div>
                    )}

                    {/* Artist Card */}
                    <ArtistDetailsCard
                        artist={artistInfo}
                        onFollowToggle={() => showToast('Funcionalidade em breve!', 'info')}
                        mode="dark"
                    />

                    <div className="h-32" />
                </div>
            </div>

            <ActionSheet
                isOpen={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                trackTitle={currentTrack.title}
            />
        </div>
    );
}
