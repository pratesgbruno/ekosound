"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import SonicWavePlayer from "../../components/SonicWavePlayer";

interface Track {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    coverUrl?: string;
    duration: number;
}

export default function PlayerClient() {
    const params = useParams();
    const playlistId = params.playlistId as string;

    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    useEffect(() => {
        // Mock data with a local file for guaranteed playback
        const timer = setTimeout(() => {
            setTracks([
                {
                    id: "1",
                    title: "Que entende o comportamento do",
                    artist: "brunogenovaprates",
                    audioUrl: "/demo.mp3", // Local file to avoid CORS
                    duration: 151,
                    coverUrl: "/uploaded_image_1766096393930.png"
                },
                {
                    id: "2",
                    title: "Inner Peace",
                    artist: "Mantra Collective",
                    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                    duration: 240,
                    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop"
                },
                {
                    id: "3",
                    title: "Deep Meditation",
                    artist: "Eko Mantras",
                    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                    duration: 180,
                    coverUrl: "https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=1000&auto=format&fit=crop"
                }
            ]);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return (
        <div className="flex h-screen bg-black text-white items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
        </div>
    );

    const currentTrack = tracks[currentTrackIndex];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* Full Screen Background */}
            <div className="absolute inset-0 z-0">
                {currentTrack?.coverUrl && (
                    <img
                        src={currentTrack.coverUrl}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-60 scale-105 blur-sm"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
            </div>

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
                <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition">
                    <ChevronDown size={24} />
                </button>
                <div className="text-xs text-white/80 font-mono">PLAYING FROM PLAYLIST</div>
            </div>

            {/* Main Content Area - could be a visualizer or just empty space to show the background */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                {/* Visualizer placeholder or centralized art could go here */}
            </div>

            {/* Bottom Player Section */}
            <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <SonicWavePlayer
                        tracks={tracks}
                        initialTrackIndex={currentTrackIndex}
                        onTrackChange={(track) => {
                            const index = tracks.findIndex(t => t.id === track.id);
                            if (index !== -1) setCurrentTrackIndex(index);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
