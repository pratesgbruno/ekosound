"use client";
import React from 'react';
import { Home, Search, Library, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
    { id: 'home', label: 'Início', icon: Home, href: '/' },
    { id: 'search', label: 'Buscar', icon: Search, href: '/search' },
    { id: 'library', label: 'Biblioteca', icon: Library, href: '/library' },
    { id: 'profile', label: 'Perfil', icon: User, href: '/profile' },
];

export default function BottomNavigation() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/80 backdrop-blur-xl border-t border-white/20 z-[60] px-6 pb-safe pt-3 flex justify-between items-center rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="flex flex-col items-center gap-1 group relative py-1"
                    >
                        <div className={`
                            p-2 rounded-2xl transition-all duration-300
                            ${isActive
                                ? 'bg-[#a05e46] text-white'
                                : 'text-[#5c6b65]/60 group-hover:bg-black/5'}
                        `}>
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`
                            text-[10px] font-bold transition-colors
                            ${isActive ? 'text-[#a05e46]' : 'text-[#5c6b65]/40'}
                        `}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#a05e46] rounded-full" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
