"use client";
import { useEffect, useRef } from 'react';
import { useAudioStore } from '../../store/useAudioStore';

export default function AudioEngine() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Store State
    const {
        currentTrack,
        isPlaying,
        volume,
        isMuted,
        requestedTime,
        setIsPlaying,
        setCurrentTime,
        setDuration,
        nextTrack,
        setRequestedTime
    } = useAudioStore();

    // 1. Initialize Audio Object & Events
    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => {
            setIsPlaying(false);
            nextTrack(); // Auto-advance logic inside store or component
        };
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [setCurrentTime, setDuration, setIsPlaying, nextTrack]);

    // 2. Handle Track Changes
    useEffect(() => {
        if (!audioRef.current) return;
        if (!currentTrack) {
            audioRef.current.pause();
            audioRef.current.src = "";
            return;
        }

        const audio = audioRef.current;
        // Check if source changed to avoid reload on re-render
        // Note: We need a full URL check or just assume src is unique enough
        // Ideally we compare IDs but the Audio Element cares about src
        const currentSrc = audio.src;
        // We might need to construct absolute URL to compare if src is relative
        // For simplicity, let's assume if track ID changed, we reload.

        // Actually, let's rely on the store's track object reference change or ID.
        // We can store the last played ID in a ref if needed, but the effect dependency `currentTrack` deals with this.

        // Simple optimization: only set src if different
        if (!currentSrc.includes(currentTrack.src)) { // Loose check
            audio.src = currentTrack.src;
            audio.load(); // Important to load new source
            if (isPlaying) {
                audio.play().catch(e => console.error("Playback failed", e));
            }
        }
    }, [currentTrack, isPlaying]); // Added isPlaying to dependencies for consistency

    // 3. Handle Play/Pause
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        const audio = audioRef.current;
        if (isPlaying && audio.paused) {
            audio.play().catch(e => console.error("Play request failed", e));
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    }, [isPlaying, currentTrack]);

    // 4. Handle Volume & Mute
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // 5. Handle Seek
    useEffect(() => {
        if (audioRef.current && requestedTime !== null) {
            audioRef.current.currentTime = requestedTime;
            setRequestedTime(null); // Reset request
        }
    }, [requestedTime, setRequestedTime]);

    return (
        <audio
            ref={audioRef}
            className="hidden"
            preload="auto"
        />
    );
}
