"use client";
import React, { useRef } from 'react';

type Category = {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
};

interface CategoryScrollProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelect: (id: string | null) => void;
}

export default function CategoryScroll({ categories, selectedCategory, onSelect }: CategoryScrollProps) {

    // Logic for Drag-to-Scroll
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const slider = e.currentTarget;
        let startX = e.pageX - slider.offsetLeft;
        let scrollLeft = slider.scrollLeft;
        let velocity = 0;
        let lastX = e.pageX;
        let lastTime = Date.now();
        let isDragging = false;

        const handleMouseMove = (mmEvent: MouseEvent) => {
            const x = mmEvent.pageX - slider.offsetLeft;
            const distance = Math.abs(x - startX);
            if (distance > 5) isDragging = true;

            if (isDragging) {
                const walk = (x - startX);
                slider.scrollLeft = scrollLeft - walk;

                const now = Date.now();
                const dt = now - lastTime;
                const dx = mmEvent.pageX - lastX;
                if (dt > 0) velocity = dx / dt;
                lastX = mmEvent.pageX;
                lastTime = now;
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            if (isDragging && Math.abs(velocity) > 0.1) {
                let momentumScroll = velocity * 15;
                const animateMomentum = () => {
                    if (Math.abs(momentumScroll) < 0.5) {
                        slider.style.scrollSnapType = 'x proximity';
                        return;
                    }
                    slider.scrollLeft -= momentumScroll;
                    momentumScroll *= 0.92;
                    requestAnimationFrame(animateMomentum);
                };
                animateMomentum();
            } else {
                slider.style.scrollSnapType = 'x proximity';
            }

            if (isDragging) {
                const preventClick = (e: MouseEvent) => {
                    e.stopImmediatePropagation();
                    slider.removeEventListener('click', preventClick, true);
                };
                slider.addEventListener('click', preventClick, true);
            }
        };

        slider.style.scrollSnapType = 'none';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="pb-6 shrink-0 z-10 w-full overflow-hidden select-none">
            <div
                ref={sliderRef}
                className="w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-6 flex items-center no-scrollbar"
                style={{ scrollSnapType: 'none', scrollBehavior: 'auto' }}
                onMouseDown={handleMouseDown}
            >
                <div className="flex gap-3 w-max items-center pr-12">
                    {/* Categoria: Todos */}
                    <div
                        onClick={(e) => {
                            if (e.defaultPrevented) return;
                            onSelect(null);
                            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }}
                        className="flex flex-col items-center gap-2 cursor-pointer snap-start group"
                    >
                        <div className={`w-32 h-20 rounded-2xl p-0.5 border-2 transition-all duration-300 ${!selectedCategory ? 'border-[#a05e46] scale-[1.02]' : 'border-transparent hover:border-[#a05e46]/20'}`}>
                            <div className={`w-full h-full rounded-xl bg-white/40 backdrop-blur-md flex flex-col items-center justify-center text-[#1a3c34] overflow-hidden shadow-sm relative`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span className={`text-[11px] font-bold tracking-tight transition-colors ${!selectedCategory ? 'text-[#a05e46]' : 'text-[#1a3c34]'}`}>
                                    Todos
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Demais Categorias */}
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={(e) => {
                                if (e.defaultPrevented) return;
                                onSelect(cat.id === selectedCategory ? null : cat.id);
                                e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }}
                            className="flex flex-col items-center gap-2 cursor-pointer snap-start group"
                        >
                            <div className={`w-32 h-20 rounded-2xl p-0.5 border-2 transition-all duration-300 ${selectedCategory === cat.id ? 'border-[#a05e46] scale-[1.02]' : 'border-transparent hover:border-[#a05e46]/20'}`}>
                                <div className={`w-full h-full rounded-xl ${cat.bg} opacity-90 flex flex-col items-center justify-center ${cat.color} overflow-hidden shadow-sm relative`}>
                                    <div className="opacity-60 mb-1 scale-90">
                                        {cat.icon}
                                    </div>
                                    <span className={`text-[11px] font-bold tracking-tight text-center px-2 leading-tight transition-colors ${selectedCategory === cat.id ? 'text-[#1a3c34]' : ''}`}>
                                        {cat.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex-shrink-0 w-2" />
                </div>
            </div>
        </div>
    );
}
