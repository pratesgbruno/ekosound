"use client";
import React, { useEffect, useRef } from 'react';

export default function OrganicBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Basic Parallax Effect for Desktop
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            // Check formatted to reduce execution on mobile if needed via window width
            if (window.innerWidth < 768) return;

            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20; // range -10 to 10
            const y = (clientY / window.innerHeight - 0.5) * 20;

            containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f4f6f0]">
            <div ref={containerRef} className="relative w-full h-full will-change-transform transition-transform duration-300 ease-out">
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
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
            </div>
        </div>
    );
}
