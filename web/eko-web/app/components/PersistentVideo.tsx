"use client";
import React, { useEffect, useState } from 'react';
import { useAudioStore } from '../../store/useAudioStore';

export default function PersistentVideo() {
    const { currentTrack, isPlayerVisible, isPlaying } = useAudioStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !currentTrack || currentTrack.type !== 'video') {
        return null;
    }

    // Large state: Top 60% of the container
    // Mini state: Roughly over the MiniPlayer thumbnail (48x48px)
    // MiniPlayer is at bottom-[88px], left-4. Thumbnail is p-3 (12px) from left/top of MiniPlayer.
    // So roughly: bottom: 88 + 12 = 100px, left: 16 + 12 = 28px.

    // We use transition for smooth size/position change
    const isMini = !isPlayerVisible;

    const styles: React.CSSProperties = isMini ? {
        position: 'absolute',
        bottom: '100px',
        left: '28px',
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        zIndex: 45,
        opacity: isPlaying ? 1 : 0,
        pointerEvents: 'auto',
        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        background: 'black'
    } : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '60vh',
        zIndex: 95, // Behind PlayerOverlay (z-100) but above everything else
        opacity: 1,
        pointerEvents: 'auto',
        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        overflow: 'hidden'
    };

    return (
        <div style={styles}>
            <iframe
                src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&mute=0&controls=${isMini ? 0 : 1}&rel=0&modestbranding=1&playlist=${currentTrack.youtubeId}&loop=1&fs=1&playsinline=1&enablejsapi=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'auto'
                }}
            ></iframe>

            {/* Overlay to catch clicks in mini mode and maximize */}
            {isMini && (
                <div
                    className="absolute inset-0 cursor-pointer z-10"
                    onClick={() => useAudioStore.getState().maximizePlayer()}
                />
            )}
        </div>
    );
}
