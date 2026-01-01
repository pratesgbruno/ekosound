"use client";
import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { audioController } from '../../lib/AudioController';
import { useAudioStore } from '../../store/useAudioStore';

export default function AudioEngine() {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seek
    } = useAudioStore();
    const { showToast } = useToast();

    // Listen to Controller Errors
    useEffect(() => {
        const handleError = (error: any) => {
            if (error.type === 'interaction_required') {
                showToast(error.message, 'info');
            } else {
                showToast("Erro na reprodução. Verifique sua conexão.", 'error');
            }
        };

        audioController.on('error', handleError);
        return () => audioController.off('error', handleError);
    }, [showToast]);

    // Handle Media Session Metadata
    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.mediaSession) return;

        if (currentTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist || 'Unknown Artist',
                album: currentTrack.category || 'EkoSound',
                artwork: currentTrack.cover ? [
                    { src: currentTrack.cover, sizes: '512x512', type: 'image/jpeg' }
                ] : []
            });
        }
    }, [currentTrack]);

    // Handle Playback State
    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }, [isPlaying]);

    // Register Actions
    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.mediaSession) return;

        navigator.mediaSession.setActionHandler('play', () => {
            togglePlayPause();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            togglePlayPause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());

        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.seekTime !== undefined) {
                seek(details.seekTime);
            }
        });

    }, [togglePlayPause, nextTrack, prevTrack, seek]);

    // Initial log
    useEffect(() => {
        console.log("AudioEngine attached");
    }, []);

    return null;
}
