"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
    const pathname = usePathname();

    const tabs = [
        {
            id: 'home',
            label: 'Início',
            href: '/',
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            id: 'search',
            label: 'Buscar',
            href: '/search',
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            id: 'library',
            label: 'Biblioteca',
            href: '/library',
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        }
    ];

    return (
        <div className="absolute bottom-0 left-0 w-full z-40 px-4 pb-4">
            <nav className="glass-panel h-[72px] flex items-center justify-around w-full relative z-10">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${isActive ? 'text-[#a05e46] scale-105' : 'text-[#5c6b65]/60 hover:text-[#5c6b65]'}`}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? '-translate-y-0.5' : ''}`}>
                                {tab.icon(isActive)}
                            </div>
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? '' : 'opacity-80'}`}>
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
