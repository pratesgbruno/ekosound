"use client";
import React, { useEffect, useRef } from 'react';

import { useAudioStore } from '../../store/useAudioStore';

export default function OrganicBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [bgImage, setBgImage] = React.useState('');
    const { currentTrack } = useAudioStore();

    const BG_IMAGES = [
        '0.png', '1.png', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg',
        '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '15.jpg',
        '16.jpg', '16.png', '17.jpg'
    ];

    // Background Image Selection - changes on track change or initial load
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * BG_IMAGES.length);
        setBgImage(`/bg/${BG_IMAGES[randomIndex]}`);
    }, [currentTrack?.id]);

    // Basic Parallax Effect for Desktop
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            if (window.innerWidth < 768) return;

            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;

            containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f4f6f0]">
            {/* Background Image Layer */}
            {bgImage && (
                <div
                    className="absolute inset-0 z-0 scale-125 transition-all duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(60px) brightness(0.7) saturate(1.2)',
                        opacity: 0.6
                    }}
                />
            )}

            <div ref={containerRef} className="relative w-full h-full will-change-transform transition-transform duration-300 ease-out z-[1]">
                {/* Blob 1: Sage Green - Top Left */}
                <div
                    className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[#dbece5] rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob-slow"
                ></div>

                {/* Blob 2: Warm Beige - Right Center */}
                <div
                    className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-[#e8e4d9] rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob-med"
                ></div>

                {/* Blob 3: Soft Blue/Green - Bottom Left */}
                <div
                    className="absolute -bottom-[10%] left-[5%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] bg-[#d9e6e8] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-blob-fast"
                ></div>

                {/* Overlay Texture (Subtle Noise already in global but can reinforce here if needed) */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
            </div>
        </div>
    );
}
