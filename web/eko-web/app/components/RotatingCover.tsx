"use client";
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface RotatingCoverProps {
    cover: string;
    isPlaying: boolean;
    isBuffering?: boolean;
}

export default function RotatingCover({ cover, isPlaying, isBuffering = false }: RotatingCoverProps) {
    const coverRef = useRef<HTMLDivElement>(null);
    const rotationRef = useRef<anime.AnimeInstance | null>(null);

    useEffect(() => {
        if (!coverRef.current) return;

        // Stop any existing animation
        if (rotationRef.current) {
            rotationRef.current.pause();
        }

        if (isPlaying && !isBuffering) {
            // Start infinite rotation
            rotationRef.current = anime({
                targets: coverRef.current,
                rotate: '360deg',
                duration: 20000, // 20 seconds for full rotation
                easing: 'linear',
                loop: true,
            });
        } else {
            // Reset rotation smoothly
            anime({
                targets: coverRef.current,
                rotate: 0,
                duration: 400,
                easing: 'easeOutQuad',
            });
        }

        return () => {
            if (rotationRef.current) {
                rotationRef.current.pause();
            }
        };
    }, [isPlaying, isBuffering]);

    return (
        <div className="relative w-48 h-48 rounded-[30px] overflow-hidden shadow-2xl shrink-0">
            <div
                ref={coverRef}
                className={`w-full h-full transition-all duration-300 ${isBuffering ? 'blur-sm' : ''}`}
            >
                <img
                    src={cover}
                    className="w-full h-full object-cover"
                    alt="Album Cover"
                />
            </div>

            {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-white text-sm font-medium">Buffering...</span>
                </div>
            )}
        </div>
    );
}
