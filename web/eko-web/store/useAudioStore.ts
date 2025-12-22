import { create } from 'zustand';

export interface Track {
    id: number | string;
    title: string;
    artist?: string;
    category: string;
    catId?: string;
    src: string;
    cover: string;
    description?: string;
    duration?: number;
}

interface AudioState {
    isPlaying: boolean;
    isPlayerVisible: boolean;
    currentTrack: Track | null;
    volume: number; // 0 to 1
    isMuted: boolean;
    currentTime: number;
    duration: number;
    dominantColor: string;
    requestedTime: number | null; // For seeking

    playlist: Track[];
    setPlaylist: (tracks: Track[]) => void;
    // Actions
    playTrack: (track: Track) => void;
    togglePlayPause: () => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setPlayerVisible: (visible: boolean) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    seek: (time: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setDominantColor: (color: string) => void;
    setRequestedTime: (time: number | null) => void;
    nextTrack: () => void; // Placeholder for now, logic likely needs playlist knowledge
    prevTrack: () => void;
    favorites: (string | number)[];
    toggleFavorite: (trackId: string | number) => void;
    // Helper to init favorites from local storage
    initializeFavorites: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    isPlaying: false,
    isPlayerVisible: false,
    currentTrack: null,
    playlist: [],
    volume: 1,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    dominantColor: '#121212',
    favorites: [],
    requestedTime: null,

    playTrack: (track) => set((state) => {
        if (state.currentTrack?.id === track.id) {
            return { isPlaying: !state.isPlaying, isPlayerVisible: true };
        }
        return { currentTrack: track, isPlaying: true, isPlayerVisible: true };
    }),

    togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setPlayerVisible: (visible) => set({ isPlayerVisible: visible }),
    setVolume: (volume) => set({ volume, isMuted: false }), // Unmute on volume change
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    seek: (time) => set({ requestedTime: time }), // Signal to engine
    setRequestedTime: (time) => set({ requestedTime: time }), // Reset signal
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({ duration }),
    setDominantColor: (dominantColor) => set({ dominantColor }),
    setPlaylist: (playlist) => set({ playlist }),

    nextTrack: () => {
        const { currentTrack, playlist } = get();
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        set({ currentTrack: playlist[nextIndex], isPlaying: true });
    },

    prevTrack: () => {
        const { currentTrack, playlist } = get();
        if (!currentTrack || playlist.length === 0) return;
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        set({ currentTrack: playlist[prevIndex], isPlaying: true });
    },

    toggleFavorite: (trackId) => set((state) => {
        const isFav = state.favorites.includes(trackId);
        const newFavorites = isFav
            ? state.favorites.filter(id => id !== trackId)
            : [...state.favorites, trackId];

        if (typeof window !== 'undefined') {
            localStorage.setItem('eko_favorites', JSON.stringify(newFavorites));
        }
        return { favorites: newFavorites };
    }),

    initializeFavorites: () => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('eko_favorites');
                if (saved) {
                    set({ favorites: JSON.parse(saved) });
                }
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }
}));

