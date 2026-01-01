import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audioController } from '../lib/AudioController';

export interface Track {
    id: string | number;
    title: string;
    artist?: string;
    category?: string;
    src: string;
    cover?: string;
    description?: string;
    catId?: string;
    type?: 'audio' | 'video';
    youtubeId?: string;
}

interface PlayerContext {
    type: 'home' | 'playlist' | 'artist';
    id?: string;
}

interface AudioState {
    // Media State
    currentTrack: Track | null;
    queue: Track[]; // Not fully implemented queue logic yet, but state exists
    context: PlayerContext;

    // Playback State
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    repeatMode: 'off' | 'all' | 'one';
    shuffle: boolean;

    // UI State
    isPlayerVisible: boolean; // Full Player
    isMiniPlayerVisible: boolean; // Derived usually, but useful if we want to hide it explicitly
    activePanel: 'none' | 'lyrics' | 'queue' | 'device';
    reduceTransparency: boolean;
    hasHydrated: boolean;

    // Favorites (persisted)
    favorites: (string | number)[];

    // Actions
    playTrack: (track: Track, context?: PlayerContext) => void;
    togglePlayPause: () => void;
    setIsPlaying: (playing: boolean) => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
    toggleMute: () => void;
    nextTrack: () => void;
    prevTrack: () => void;

    // UI Actions
    setPlayerVisible: (visible: boolean) => void;
    maximizePlayer: () => void;
    minimizePlayer: () => void;
    setActivePanel: (panel: 'none' | 'lyrics' | 'queue' | 'device') => void;
    toggleFavorite: (id: string | number) => void;
    setReduceTransparency: (reduce: boolean) => void;

    // Internal Sync
    syncTime: (time: number, duration: number) => void;
    setHasHydrated: (val: boolean) => void;
    initializeFavorites: () => void; // Legacy support match
    setPlaylist: (tracks: Track[]) => void; // Legacy support
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            queue: [],
            context: { type: 'home' },

            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            isMuted: false,
            repeatMode: 'off',
            shuffle: false,

            isPlayerVisible: false,
            isMiniPlayerVisible: true,
            activePanel: 'none',
            reduceTransparency: false,
            hasHydrated: false,
            favorites: [],

            playTrack: (track, context) => {
                const state = get();

                // If it's a new track, load and play
                if (state.currentTrack?.id !== track.id) {
                    if (track.type === 'video') {
                        audioController.stop();
                        set({
                            currentTrack: track,
                            isPlaying: true,
                            isPlayerVisible: true,
                            context: context || state.context
                        });
                    } else {
                        audioController.playTrack(track.src);
                        set({
                            currentTrack: track,
                            isPlaying: true,
                            isPlayerVisible: true,
                            context: context || state.context
                        });
                    }
                } else {
                    // Same track, just ensure playing and expand
                    if (!state.isPlaying) {
                        if (track.type !== 'video') {
                            audioController.togglePlay();
                        }
                        set({ isPlaying: true });
                    }
                    set({ isPlayerVisible: true });
                }
            },

            togglePlayPause: () => {
                const state = get();
                if (state.currentTrack) {
                    if (state.currentTrack.type !== 'video') {
                        audioController.togglePlay();
                    }
                    set({ isPlaying: !state.isPlaying });
                }
            },

            setIsPlaying: (playing) => set({ isPlaying: playing }),

            seek: (time) => {
                audioController.seek(time);
                set({ currentTime: time });
            },

            setVolume: (vol) => {
                audioController.setVolume(vol);
                set({ volume: vol });
            },

            toggleMute: () => {
                const state = get();
                const newMute = !state.isMuted;
                audioController.setVolume(newMute ? 0 : state.volume);
                set({ isMuted: newMute });
            },

            nextTrack: () => {
                const state = get();
                if (!state.currentTrack || state.queue.length === 0) return;

                const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
                const nextIndex = (currentIndex + 1) % state.queue.length;
                const nextTrack = state.queue[nextIndex];

                if (nextTrack) {
                    state.playTrack(nextTrack, state.context);
                }
            },

            prevTrack: () => {
                const state = get();
                if (!state.currentTrack || state.queue.length === 0) return;

                const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
                const prevIndex = (currentIndex - 1 + state.queue.length) % state.queue.length;
                const prevTrack = state.queue[prevIndex];

                if (prevTrack) {
                    state.playTrack(prevTrack, state.context);
                }
            },

            setPlayerVisible: (visible) => set({ isPlayerVisible: visible }),
            maximizePlayer: () => set({ isPlayerVisible: true }),
            minimizePlayer: () => set({ isPlayerVisible: false }),
            setActivePanel: (panel) => set({ activePanel: panel }),

            toggleFavorite: (id) => set((state) => {
                const favs = state.favorites.includes(id)
                    ? state.favorites.filter(f => f !== id)
                    : [...state.favorites, id];
                return { favorites: favs };
            }),

            setReduceTransparency: (reduce) => set({ reduceTransparency: reduce }),
            syncTime: (time, duration) => set({ currentTime: time, duration }),
            setHasHydrated: (val) => set({ hasHydrated: val }),
            initializeFavorites: () => { }, // Handled by persist
            setPlaylist: (tracks) => set({ queue: tracks })
        }),
        {
            name: 'ekosound-storage-v3', // New version key
            partialize: (state) => ({
                // Persist only what we need
                currentTrack: state.currentTrack,
                queue: state.queue,
                volume: state.volume,
                favorites: state.favorites,
                repeatMode: state.repeatMode,
                shuffle: state.shuffle,
                reduceTransparency: state.reduceTransparency
                // Explicitly NOT persistsing isPlaying
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);

// Hook up AudioController events to Store
// This needs to run once. We can put it here or in a helper.
// placing inside the file ensures it runs when module is imported.
if (typeof window !== 'undefined') {
    audioController.on('timeupdate', (data: unknown) => {
        const { currentTime, duration } = data as { currentTime: number, duration: number };
        useAudioStore.getState().syncTime(currentTime, duration);
    });
    audioController.on('ended', () => {
        useAudioStore.getState().setIsPlaying(false); // Or nextTrack()
    });
    audioController.on('play', () => useAudioStore.getState().setIsPlaying(true));
    audioController.on('pause', () => useAudioStore.getState().setIsPlaying(false));
    audioController.on('error', (e) => {
        console.error("Store received audio error:", e);
        useAudioStore.getState().setIsPlaying(false);
    });
}
