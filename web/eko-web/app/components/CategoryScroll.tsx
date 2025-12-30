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
        <div className="shrink-0 z-10 w-full overflow-hidden select-none">
            <div
                ref={sliderRef}
                className="w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-6 py-5 flex items-center no-scrollbar"
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
                        className="flex flex-col items-center cursor-pointer snap-start"
                    >
                        <div className={`w-28 h-24 rounded-[32px] p-0.5 border-2 transition-all duration-500 ease-out ${!selectedCategory ? 'border-[#a05e46] shadow-xl shadow-[#a05e46]/15 -translate-y-1.5' : 'border-transparent'}`}>
                            <div className={`w-full h-full rounded-[28px] bg-white/40 backdrop-blur-xl flex flex-col items-center justify-center text-[#1a3c34] overflow-hidden relative transition-all ${!selectedCategory ? 'bg-white/70' : 'hover:bg-white/60'}`}>
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 transition-all ${!selectedCategory ? 'bg-[#a05e46] text-white shadow-md' : 'bg-black/5 text-[#1a3c34]'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </div>
                                <span className={`text-[11px] font-black tracking-tight transition-colors ${!selectedCategory ? 'text-[#a05e46]' : 'text-[#1a3c34]'}`}>
                                    Explorar Todos
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
                            className="flex flex-col items-center cursor-pointer snap-start"
                        >
                            <div className={`w-32 h-24 rounded-[32px] p-0.5 border-2 transition-all duration-500 ease-out ${selectedCategory === cat.id ? 'border-[#a05e46] shadow-xl shadow-[#a05e46]/15 -translate-y-1.5' : 'border-transparent'}`}>
                                <div className={`w-full h-full rounded-[28px] ${cat.bg} backdrop-blur-xl flex flex-col items-center justify-center ${cat.color} overflow-hidden relative transition-all ${selectedCategory === cat.id ? 'opacity-100 bg-white/60' : 'opacity-85 hover:opacity-100'}`}>
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 transition-all ${selectedCategory === cat.id ? 'bg-[#a05e46] text-white shadow-lg' : 'bg-white/50 shadow-sm'}`}>
                                        <div className="scale-100">
                                            {cat.icon}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black tracking-tight text-center px-3 leading-[1.1] transition-colors ${selectedCategory === cat.id ? 'text-[#1a3c34]' : 'text-current opacity-90'}`}>
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
