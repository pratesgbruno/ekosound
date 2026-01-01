"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAudioStore } from '../../store/useAudioStore';

export default function PersistentVideo() {
    const { currentTrack, isPlayerVisible, isPlaying, togglePlayPause } = useAudioStore();
    const [mounted, setMounted] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync Store State -> Iframe
    useEffect(() => {
        if (!iframeRef.current || !iframeRef.current.contentWindow) return;

        const action = isPlaying ? 'playVideo' : 'pauseVideo';
        iframeRef.current.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: action,
            args: []
        }), '*');
    }, [isPlaying, currentTrack?.id]);

    if (!mounted || !currentTrack || currentTrack.type !== 'video') {
        return null;
    }

    const isMini = !isPlayerVisible;

    const styles: React.CSSProperties = isMini ? {
        position: 'absolute',
        bottom: '100px',
        left: '28px',
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        zIndex: 45,
        opacity: 1, // Always visible if it's the current track
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
        zIndex: 95,
        opacity: 1,
        pointerEvents: 'auto',
        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        overflow: 'hidden'
    };

    return (
        <div style={styles}>
            <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=1&mute=0&controls=${isMini ? 0 : 1}&rel=0&modestbranding=1&loop=1&playlist=${currentTrack.youtubeId}&playsinline=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full object-cover pointer-events-auto"
            ></iframe>

            {/* Overlay for Mini Mode interaction */}
            {isMini && (
                <div
                    className="absolute inset-0 cursor-pointer z-10 bg-transparent"
                    onClick={() => useAudioStore.getState().maximizePlayer()}
                />
            )}
        </div>
    );
}
