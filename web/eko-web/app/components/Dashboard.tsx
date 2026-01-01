"use client";
import React, { useState } from 'react';
import { useAudioStore, Track } from '../../store/useAudioStore';
import { useToast } from '../context/ToastContext';
import { Heart } from 'lucide-react';
import CategoryScroll from './CategoryScroll';
import TabBar from './TabBar';

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

const TRACKS: Track[] = [
    {
        id: 1,
        title: "I release the fear",
        artist: "EkoSound",
        category: "Foco & Atenção",
        catId: 'foco',
        src: "/music/foco/release_fear.mp3?v=1",
        cover: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=150&q=80",
        description: "Medo de errar",
        type: 'audio'
    },
    {
        id: 2,
        title: "CONNECTED",
        artist: "EkoSound",
        category: "Foco & Atenção",
        catId: 'foco',
        src: "/music/foco/connected.mp3?v=1",
        cover: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?auto=format&fit=crop&w=150&q=80",
        description: "Conexão profunda",
        type: 'audio'
    },
    {
        id: 3,
        title: "WE ARE THE PEOPLE",
        artist: "EkoSound",
        category: "Redução de Ansiedade",
        catId: 'ansiedade',
        src: "/music/ansiedade/people_world.mp3?v=1",
        cover: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80",
        description: "Medo de dinheiro",
        type: 'audio'
    },
    {
        id: 4,
        title: "You Are Mine",
        artist: "EkoSound",
        category: "Relaxamento Guiado",
        catId: 'relaxamento',
        src: "/music/relaxamento/you_are_mine.mp3?v=1",
        cover: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=150&q=80",
        description: "Relacionamento tóxico",
        type: 'audio'
    },
    {
        id: 5,
        title: "Sono Profundo - Música Relaxante",
        artist: "EkoSound",
        category: "Sono Profundo",
        catId: 'sono',
        src: "",
        youtubeId: "AFQZWUo904Y",
        cover: "https://img.youtube.com/vi/AFQZWUo904Y/0.jpg",
        description: "Vídeo para sono profundo",
        type: 'video'
    },
    {
        id: 6,
        title: "Deep Sleep Meditation",
        artist: "EkoSound",
        category: "Sono Profundo",
        catId: 'sono',
        src: "",
        youtubeId: "8c2exTUZPHc",
        cover: "https://img.youtube.com/vi/8c2exTUZPHc/0.jpg",
        description: "Meditação para dormir",
        type: 'video'
    },
    {
        id: 7,
        title: "Healing Sleep Music",
        artist: "EkoSound",
        category: "Sono Profundo",
        catId: 'sono',
        src: "",
        youtubeId: "S3dPyhJlI0Q",
        cover: "https://img.youtube.com/vi/S3dPyhJlI0Q/0.jpg",
        description: "Música de cura para o sono",
        type: 'video'
    },
    {
        id: 8,
        title: "Deep Sleep & Relaxation",
        artist: "EkoSound",
        category: "Sono Profundo",
        catId: 'sono',
        src: "",
        youtubeId: "xNdO69JwcV8",
        cover: "https://img.youtube.com/vi/xNdO69JwcV8/0.jpg",
        description: "Frequência para sono profundo",
        type: 'video'
    },
    {
        id: 9,
        title: "Deep Relaxing Music",
        artist: "EkoSound",
        category: "Sono Profundo",
        catId: 'sono',
        src: "",
        youtubeId: "xDZglyqYzlg",
        cover: "https://img.youtube.com/vi/xDZglyqYzlg/0.jpg",
        description: "Música relaxante profunda para sono e foco",
        type: 'video'
    },
    {
        id: 10,
        title: "Função: desacelerar",
        artist: "Suno AI",
        category: "Alívio de Estresse",
        catId: 'estresse',
        src: "https://cdn1.suno.ai/b760a879-b1fc-4f8c-b4aa-990b9a7b2173.mp3",
        cover: "https://cdn2.suno.ai/image_large_b760a879-b1fc-4f8c-b4aa-990b9a7b2173.jpeg",
        description: "Desacelerar respiração e atenção",
        type: 'audio'
    },
    {
        id: 11,
        title: "Mantra Meditação",
        artist: "Suno AI",
        category: "Alívio de Estresse",
        catId: 'estresse',
        src: "https://cdn1.suno.ai/2c01df35-67b7-481a-8831-154cc0c29073.mp3",
        cover: "https://cdn2.suno.ai/image_large_2c01df35-67b7-481a-8831-154cc0c29073.jpeg",
        description: "Mantra suave para meditação",
        type: 'audio'
    },
    {
        id: 12,
        title: "MUSICANOVA",
        artist: "Suno AI",
        category: "Alívio de Estresse",
        catId: 'estresse',
        src: "https://cdn1.suno.ai/f2c1d3ed-bd17-481b-971d-a71e680f0010.mp3",
        cover: "https://cdn2.suno.ai/image_large_f2c1d3ed-bd17-481b-971d-a71e680f0010.jpeg",
        description: "Melodia nova de cura",
        type: 'audio'
    }
];

const TrackItem = React.memo(({
    track,
    index,
    isActive,
    isPlaying,
    isFavorite,
    onPlay,
    onToggleFavorite
}: {
    track: Track;
    index: number;
    isActive: boolean;
    isPlaying: boolean;
    isFavorite: boolean;
    onPlay: (track: Track) => void;
    onToggleFavorite: (e: React.MouseEvent, id: string | number) => void;
}) => (
    <div
        onClick={() => onPlay(track)}
        className={`group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-[#a05e46]/10 shadow-sm' : 'hover:bg-white/40'}`}
    >
        <div className="w-8 flex items-center justify-center shrink-0">
            {isActive && isPlaying ? (
                <div className="flex gap-[1.5px] items-end h-3">
                    <div className="w-[2.5px] bg-[#a05e46] animate-[soundwave_1s_infinite] h-2"></div>
                    <div className="w-[2.5px] bg-[#a05e46] animate-[soundwave_1.2s_infinite] h-full"></div>
                    <div className="w-[2.5px] bg-[#a05e46] animate-[soundwave_0.8s_infinite] h-1.5"></div>
                </div>
            ) : (
                <span className={`text-[11px] font-bold ${isActive ? 'text-[#a05e46]' : 'text-[#5c6b65]/40'}`}>
                    {(index + 1).toString().padStart(2, '0')}
                </span>
            )}
        </div>

        <div className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden shadow-sm">
            <img src={track.cover} className="w-full h-full object-cover" alt="Thumbnail" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className={`text-sm font-bold truncate ${isActive ? 'text-[#a05e46]' : 'text-[#1a3c34] group-hover:text-[#a05e46] transition-colors'}`}>
                {track.title}
            </h4>
            <span className="text-[11px] text-[#5c6b65] font-medium truncate">
                {track.artist || track.category}
            </span>
        </div>

        {/* Duration Placeholder */}
        <div className="text-[10px] text-[#5c6b65]/40 font-bold hidden group-hover:block">
            3:45
        </div>

        <button
            onClick={(e) => onToggleFavorite(e, track.id)}
            className={`p-2 rounded-full transition-all ${isFavorite ? 'text-[#a05e46] scale-110' : 'text-[#5c6b65]/30 hover:text-[#a05e46] scale-90'}`}
        >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
    </div>
));
TrackItem.displayName = "TrackItem";

export default function Dashboard() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [lang, setLang] = useState("PT");
    const {
        playTrack,
        currentTrack,
        isPlaying,
        setPlaylist,
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

    const filteredTracks = React.useMemo(() => TRACKS.filter(t => {
        const matchesCategory = selectedCategory ? t.catId === selectedCategory : true;
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const isFavorite = favorites.includes(t.id);
        const matchesTab = activeTab === 'all' ? true :
            activeTab === 'favorites' ? isFavorite :
                activeTab === 'music' ? true : true;

        return matchesCategory && matchesSearch && matchesTab;
    }), [selectedCategory, searchTerm, activeTab, favorites]);

    const handleToggleFavorite = React.useCallback((e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        toggleFavorite(id);
        // We need to check if it was favorite BEFORE toggle to show correct toast, 
        // OR we just trust the action. Since toggleFavorite is async state update, better check list.
        // Actually for UI feedback "Saved/Removed", we can infer.
        // Simplified:
        useAudioStore.getState().favorites.includes(id)
            ? showToast("Removido dos favoritos", "info")
            : showToast("Salvo nos favoritos", "success");
    }, [toggleFavorite, showToast]);

    return (
        <>
            {/* Background removed - is now global */}

            <div className="px-6 pt-8 pb-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#a05e46] flex items-center justify-center text-white font-bold text-lg shadow-md">
                        H
                    </div>
                    <div>
                        <span className="text-[10px] text-[#5c6b65] uppercase tracking-wider font-bold">Boa tarde</span>
                        <h1 className="text-xl text-[#1a3c34] font-extrabold leading-none">Helena</h1>
                    </div>
                </div>
                <div className="flex bg-white/30 backdrop-blur-md border border-white/40 rounded-full p-1 gap-1">
                    <button
                        onClick={() => setLang("PT")}
                        className={`px-3 py-1 text-[10px] font-extrabold rounded-full transition-all ${lang === 'PT' ? 'bg-[#a05e46] text-white shadow-sm' : 'text-[#1a3c34] hover:bg-black/5'}`}
                    >
                        PT
                    </button>
                    <button
                        onClick={() => setLang("EN")}
                        className={`px-3 py-1 text-[10px] font-extrabold rounded-full transition-all ${lang === 'EN' ? 'bg-[#a05e46] text-white shadow-sm' : 'text-[#1a3c34] hover:bg-black/5'}`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* TAB BAR */}
            <div className="z-20 relative mb-4">
                <TabBar
                    tabs={[
                        { id: 'all', label: 'Tudo' },
                        { id: 'music', label: 'Músicas' },
                        { id: 'favorites', label: 'Favoritos' }
                    ]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* CATEGORY SCROLL (Moods) */}
            <div className="mb-6">
                <div className="px-6 mb-3">
                    <h2 className="text-lg font-bold text-[#1a3c34]">Para você</h2>
                </div>
                <CategoryScroll
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </div>

            <div className="px-6 flex-1 overflow-y-auto pb-48 z-10 scrollbar-hide">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-[#1a3c34]">
                        {searchTerm ? `Resultados para "${searchTerm}"` : (selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.label : 'Deep House')}
                    </h3>
                </div>

                {/* List Items (Clean List Style) */}
                <div className="space-y-1">
                    {filteredTracks.length === 0 ? (
                        <div className="text-center text-[#5c6b65] py-8 text-sm">
                            Nenhum som encontrado.
                        </div>
                    ) : (
                        filteredTracks.map((track, index) => (
                            <TrackItem
                                key={track.id}
                                track={track}
                                index={index}
                                isActive={currentTrack?.id === track.id}
                                isPlaying={isPlaying}
                                isFavorite={favorites.includes(track.id)}
                                onPlay={playTrack}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* AudioPlayer removed - replaced by Global PlayerOverlay */}
        </>
    );
}
