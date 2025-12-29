"use client";
import React from 'react';

type Tab = {
    id: string;
    label: string;
};

interface TabBarProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
    return (
        <div className="flex items-center gap-3 px-6 py-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap
                            ${isActive
                                ? 'bg-[#d67c66] text-white shadow-lg shadow-[#d67c66]/20 scale-105'
                                : 'bg-white/40 text-[#5c554b]/80 border border-white/40 hover:bg-white/60'}
                        `}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
