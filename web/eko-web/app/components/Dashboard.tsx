"use client";
import React, { useState } from 'react';
import { useAudioStore } from '../../store/useAudioStore';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
    {
        id: 'foco', label: 'Foco & Atenção', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ), color: 'text-[#9c6e6e]', bg: 'bg-[#ebdcdb]'
    },
    {
        id: 'ansiedade', label: 'Redução de Ansiedade', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        ), color: 'text-[#5c7a64]', bg: 'bg-[#dbece0]'
    },
    {
        id: 'relaxamento', label: 'Relaxamento Guiado', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        ), color: 'text-[#8a9163]', bg: 'bg-[#f2f4e4]'
    },
    {
        id: 'sono', label: 'Sono Profundo', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>
        ), color: 'text-[#5c6b8a]', bg: 'bg-[#dee3ec]'
    },
    {
        id: 'estresse', label: 'Alívio de Estresse', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ), color: 'text-[#8a6e5c]', bg: 'bg-[#ece4de]'
    }
];

const TRACKS = [
    {
        id: 1,
        title: "I release the fear",
        category: "Foco & Atenção",
        catId: 'foco',
        src: "/music/foco/release_fear.mp3",
        cover: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=150&q=80",
        description: "Medo de errar"
    },
    {
        id: 2,
        title: "CONNECTED",
        category: "Foco & Atenção",
        catId: 'foco',
        src: "/music/foco/connected.mp3",
        cover: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?auto=format&fit=crop&w=150&q=80",
        description: "Conexão profunda"
    },
    {
        id: 3,
        title: "WE ARE THE PEOPLE",
        category: "Redução de Ansiedade",
        catId: 'ansiedade',
        src: "/music/ansiedade/people_world.mp3",
        cover: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
        description: "Medo de dinheiro"
    },
    {
        id: 4,
        title: "You Are Mine",
        category: "Relaxamento Guiado",
        catId: 'relaxamento',
        src: "/music/relaxamento/you_are_mine.mp3",
        cover: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=150&q=80",
        description: "Relacionamento tóxico"
    }
];

export default function Dashboard() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const {
        playTrack,
        currentTrack,
        isPlaying,
        setPlaylist,
        togglePlayPause,
        favorites,
        toggleFavorite,
        initializeFavorites
    } = useAudioStore();
    const { showToast } = useToast();

    // Initialize Playlist & Favorites
    React.useEffect(() => {
        setPlaylist(TRACKS);
        initializeFavorites();
    }, [setPlaylist, initializeFavorites]);

    const filteredTracks = TRACKS.filter(t => {
        const matchesCategory = selectedCategory ? t.catId === selectedCategory : true;
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const displayTracks = filteredTracks;

    return (
        <>
            {/* 1. CAMADA DE FUNDO (AMBIENT LIGHT) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[40%] bg-[#dcedde] rounded-full blur-[80px] opacity-80 mix-blend-multiply"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[40%] bg-[#eaddd8] rounded-full blur-[80px] opacity-80 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-[#fdfbf7] to-transparent"></div>
            </div>

            <div className="px-6 pt-12 pb-4 flex justify-between items-start z-10">
                <div>
                    <h1 className="text-3xl text-[#4a453e] leading-tight">Olá,<br /><span className="font-semibold">Dra. Helena</span></h1>
                </div>
                <div className="relative glass p-2 rounded-full cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5c554b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <div className="absolute top-2 right-2.5 w-2 h-2 bg-[#d67c66] rounded-full border border-white"></div>
                </div>
            </div>

            {/* SEARCH BAR */}
            <div className="px-6 mb-4 z-10 relative">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5c554b]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar meditação..."
                        className="w-full bg-white/40 backdrop-blur-md border border-white/40 rounded-xl py-3 pl-10 pr-4 text-sm text-[#4a453e] placeholder-[#5c554b]/50 focus:outline-none focus:ring-1 focus:ring-[#d67c66]/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 2. CARDS SUPERIORES (DRAG FLUIDO COM INÉRCIA) */}
            <div className="pb-6 shrink-0 z-10 w-full overflow-hidden select-none">
                <div
                    id="category-carousel"
                    className="w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-6 flex items-center"
                    style={{ scrollSnapType: 'none', scrollBehavior: 'auto' }}
                    onMouseDown={(e) => {
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
                    }}
                >
                    <div className="flex gap-3 w-max items-center pr-12">
                        {/* Categoria: Todos */}
                        <div
                            onClick={(e) => {
                                setSelectedCategory(null);
                                e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }}
                            className={`bg-white/40 backdrop-blur-md border ${!selectedCategory ? 'border-[#d67c66] bg-white/60 shadow-sm' : 'border-white/20'} transition-all duration-300 flex-shrink-0 w-[80px] h-[85px] rounded-[22px] flex flex-col items-center justify-center p-2 text-center gap-1.5 cursor-pointer snap-center active:scale-95`}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${!selectedCategory ? 'bg-[#d67c66] text-white shadow-md shadow-[#d67c66]/20' : 'bg-[#5c554b]/5 text-[#5c554b]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                            <span className={`text-[10px] font-medium transition-colors ${!selectedCategory ? 'text-[#4a453e] font-semibold' : 'text-[#5c554b]/60'}`}>Todos</span>
                        </div>

                        {/* Demais Categorias */}
                        {CATEGORIES.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={(e) => {
                                    setSelectedCategory(cat.id === selectedCategory ? null : cat.id);
                                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                                }}
                                className={`bg-white/40 backdrop-blur-md border ${selectedCategory === cat.id ? 'border-[#d67c66] bg-white/60 shadow-sm' : 'border-white/20'} transition-all duration-300 flex-shrink-0 w-[100px] h-[85px] rounded-[22px] flex flex-col items-center justify-center p-2 text-center gap-1.5 cursor-pointer snap-center active:scale-95`}
                            >
                                <div className={`w-9 h-9 rounded-full ${cat.bg} opacity-90 flex items-center justify-center ${cat.color} transition-all ${selectedCategory === cat.id ? 'scale-110 shadow-md ring-1 ring-white/50' : ''}`}>
                                    {cat.icon}
                                </div>
                                <span className={`text-[10px] font-medium leading-tight px-1 transition-colors ${selectedCategory === cat.id ? 'text-[#4a453e] font-semibold' : 'text-[#5c554b]/60'}`}>{cat.label}</span>
                            </div>
                        ))}

                        {/* Spacer final para respiro no scroll */}
                        <div className="flex-shrink-0 w-2" />
                    </div>
                </div>
            </div>

            <div className="px-6 flex-1 overflow-y-auto pb-32 z-10 scrollbar-hide">
                <h3 className="text-lg font-medium text-[#5c554b] mb-3">
                    {searchTerm ? `Resultados para "${searchTerm}"` : (selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.label : 'Todos os Sons')}
                </h3>

                {/* 3. O CARD "TOCANDO AGORA" */}
                {currentTrack && !searchTerm && (
                    <div className="relative w-full p-4 rounded-3xl overflow-hidden border border-white/60 shadow-[0_8px_30px_rgba(214,124,102,0.15)] bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-xl mb-4">
                        <div className="flex items-center gap-4 relative z-10">
                            <img src={currentTrack.cover} className="w-14 h-14 rounded-xl shadow-md object-cover" alt="Album Cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif text-[#3D3430] font-semibold truncate">{currentTrack.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    {isPlaying ? (
                                        <div className="flex gap-1 h-3 items-end">
                                            <div className="w-1 bg-[#d67c66] rounded-full animate-[bounce_1s_infinite]"></div>
                                            <div className="w-1 h-3/4 bg-[#d67c66] rounded-full animate-[bounce_1.2s_infinite]"></div>
                                            <div className="w-1 h-full bg-[#d67c66] rounded-full animate-[bounce_0.8s_infinite]"></div>
                                            <div className="w-1 h-1/2 bg-[#d67c66] rounded-full animate-[bounce_1.1s_infinite]"></div>
                                        </div>
                                    ) : (
                                        <div className="w-1 h-1 bg-[#d67c66] rounded-full"></div>
                                    )}
                                    <span className="text-xs text-[#d67c66] font-medium truncate">{isPlaying ? 'Tocando agora' : 'Pausado'}</span>
                                </div>
                            </div>
                            <button
                                onClick={togglePlayPause}
                                className="w-10 h-10 rounded-full bg-[#d67c66] text-white flex items-center justify-center shadow-lg shrink-0"
                            >
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* List Items */}
                <div className="space-y-3">
                    {displayTracks.length === 0 ? (
                        <div className="text-center text-[#5c554b] py-8 text-sm">
                            Nenhum som encontrado.
                        </div>
                    ) : (
                        displayTracks.map((track) => {
                            const isFav = favorites.includes(track.id);
                            return (
                                <div
                                    key={track.id}
                                    onClick={() => playTrack(track)}
                                    className={`glass-card p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${currentTrack?.id === track.id ? 'bg-white/60 border-[#d67c66]/30' : 'opacity-70 hover:opacity-100 hover:bg-white/40'}`}
                                >
                                    <img src={track.cover} className="w-12 h-12 rounded-lg bg-gray-200 object-cover shadow-sm bg-stone-300" alt="Thumbnail" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-semibold truncate ${currentTrack?.id === track.id ? 'text-[#d67c66]' : 'text-[#4a453e]'}`}>{track.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-500 truncate">{track.description}</span>
                                        </div>
                                    </div>

                                    {/* Favorite Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(track.id);
                                            showToast(isFav ? "Removido dos favoritos" : "Adicionado aos favoritos", "info");
                                        }}
                                        className={`p-2 rounded-full transition ${isFav ? 'text-[#d67c66]' : 'text-gray-400 hover:text-[#d67c66]/70'}`}
                                        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isFav ? "currentColor" : "none"} stroke="currentColor">
                                            <path fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth={isFav ? "0" : "1.5"} d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <button className={`${currentTrack?.id === track.id ? 'text-[#d67c66]' : 'text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* AudioPlayer removed - replaced by Global PlayerOverlay */}
        </>
    );
}
