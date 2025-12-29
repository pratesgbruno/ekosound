"use client";
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { X, ListPlus, Album, Info, Share2 } from 'lucide-react';

interface ActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    trackTitle: string;
}

export default function ActionSheet({ isOpen, onClose, trackTitle }: ActionSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sheetRef.current) return;

        if (isOpen) {
            anime({
                targets: sheetRef.current,
                translateY: ['100%', '0%'],
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutQuad',
            });
        }
    }, [isOpen]);

    const handleClose = () => {
        if (sheetRef.current) {
            anime({
                targets: sheetRef.current,
                translateY: ['0%', '100%'],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: onClose,
            });
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    const actions = [
        { icon: ListPlus, label: 'Adicionar à playlist', action: () => console.log('Add to playlist') },
        { icon: Album, label: 'Ir para o álbum', action: () => console.log('Go to album') },
        { icon: Info, label: 'Ver créditos', action: () => console.log('View credits') },
        { icon: Share2, label: 'Compartilhar', action: () => console.log('Share') },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={handleClose}
            />

            {/* Action Sheet */}
            <div
                ref={sheetRef}
                className="absolute bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur-2xl rounded-t-[32px] p-6 shadow-2xl"
                style={{ transform: 'translateY(100%)', opacity: 0 }}
            >
                {/* Handle */}
                <div className="w-12 h-1 bg-[#5c6b65]/30 rounded-full mx-auto mb-6" />

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1a3c34] mb-1 truncate">{trackTitle}</h3>
                <p className="text-sm text-[#5c6b65] mb-6">Opções</p>

                {/* Actions */}
                <div className="space-y-2">
                    {actions.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                item.action();
                                handleClose();
                            }}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#a05e46]/10 transition-colors text-left"
                        >
                            <item.icon size={24} className="text-[#a05e46]" />
                            <span className="font-medium text-[#1a3c34]">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="w-full mt-4 py-4 rounded-2xl bg-[#5c6b65]/10 font-bold text-[#1a3c34] hover:bg-[#5c6b65]/20 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </>
    );
}
