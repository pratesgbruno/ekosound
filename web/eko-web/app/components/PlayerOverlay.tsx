"use client";
import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import ColorThief from 'colorthief';
import { useAudioStore } from '../../store/useAudioStore';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Heart, MoreHorizontal, Shuffle, Repeat } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import RotatingCover from './RotatingCover';
import ArtistDetailsCard from './ArtistDetailsCard';
import LyricsCard from './LyricsCard';
import ActionSheet from './ActionSheet';

const LYRICS_MAP: Record<string, string> = {
    "10": "Função: desacelerar respiração e atenção\n\nSons:\n\t•\tVento suave (low-pass)\n\t\n•\tÁgua corrente distante\n\t•\tPássaros esparsos (bem espaçados, naturais)\n\nTécnica:\n\t•\tFade-in lento (10–15s)\n\t•\tSem ritmo marcado\n\t•\tVolume baixo, crescente\n\n⸻\n\nConexão Natural (1–3 min)\n\nFunção: criar sensação de segurança e presença\n\nSons de animais (escolher 2–3 no máximo):\n\t•\tPássaros matinais (aves leves, não agudas)\n\t•\tGrilos suaves\n\t•\tBaleia ou golfinho bem distante (opcional, grave)\n\nBase sonora:\n\t•\tDrone harmônico em 432Hz ou 422Hz\n\t•\tPads orgânicos, sem ataque\n\n⸻\n\nEstado Meditativo (3–6 min)\n\nFunção: manter foco sem estímulo cognitivo\n\nSons:\n\t•\tÁgua + vento contínuos\n\t•\tSons de animais quase imperceptíveis\n\t•\tNenhuma variação brusca\n\nImportante:\n\t•\tZero sons reconhecíveis em loop curto\n\t•\tNada que “conte história” (ex: pássaro chamando demais)\n\n⸻\n\nEncerramento Suave (últimos 30–45s)\n\nFunção: manter a pessoa meditando ou pronta para mantra guiado\n\t•\tRedução gradual dos sons animais\n\t•\tFica só o pad + ruído natural\n\t•\tFinal aberto (sem corte seco)",
    "11": "[INTRO | etéreo]\n[wind]\n[water]\nRespira…\nVocê está aqui.\n\n⸻\n\n[VERSO 1]\n[birds_soft]\nVocê está seguro\nNeste agora\nNeste corpo\nNeste chão\n\n[wind_low]\nNada falta\nNada ameaça\nA Terra sustenta\nO que você é\n\n⸻\n\n[REFRÃO | mantra]\n[whale_distant]\nNossa energia\nRessoa pela Terra\n\n[whale_distant]\nNossa energia\nRessoa…\n\n⸻\n\n[VERSO 2]\n[crickets_soft]\nSomos matéria deste mundo\nSomos pulso, som e silêncio\n\n[water_flow]\nTudo vibra\nTudo escuta\n\n[birds_sparse]\nO que sente é real\nO que vibra é verdade\nVocê pertence\nVocê permanece\n\n⸻\n\n[REFRÃO | mantra — repetir]\n[whale_low]\nNossa energia\nRessoa pela Terra\n\n[wind]\nNossa energia\nRessoa…\n\n⸻\n\n[PONTE | místico]\n[wind_low]\nNão há pressa\nNão há medo\n\n[water]\nSó presença\nSó energia\n\n[whale_very_distant]\nO corpo sabe\nA mente solta\nO espírito lembra\n\n⸻\n\n[OUTRO | mantra final]\n[birds_far]\nEnergia…\nPresença…\n\n[wind]\nTerra…\n\n[water + pad]\nEnergia…\nPresença…\nSomos.",
    "12": "Mantra (sussurrado, loop)\nI am still\nI am here\nI am breathing\nNothing else\n\nVerse 1\nCold light on my skin\nCity fades, I go in\nEvery thought slows down\nI don’t need a sound\n\nTime dissolves in space\nI release the race\nSilence holds my name\nNothing to explain\n\nMantra (repete, camadas)\nStill…\nHere…\nBreathing…\nClear…\n\nPre-Chorus\nI let the world pass by\nWithout touching my mind\n\nChorus (baixo pulsante entra, voz etérea)\nSlow vibration\nNo resistance\nI dissolve\nInto presence\n\nNo direction\nNo defense\nI exist\nThat’s enough\n\nPost-Chorus Mantra (robótico / vocoder)\nLet go\nLet go\nLet go\n\nVerse 2\nNeon dreams fall asleep\nI keep what I keep\nEvery breath aligns\nBody, heart and mind\n\nNo past, no after\nJust this pattern\nFloating in the sound\nGravity shuts down\n\nMantra (cresce, stereo wide)\nI am still\nI am whole\nI am quiet\nI let go\n\nBridge (instrumental | delay longo, synth psicodélico)\n(voz fragmentada)\nNo need…\nTo become…\nI already am…\n\nFinal Chorus (mais vazio, menos palavras)\nSlow vibration\nPure attention\nIn the dark\nI’m awake\n\nOutro (fade longo)\nStill…\nHere…\nBreathing…\nClear…"
};

export default function PlayerOverlay() {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        isPlayerVisible,
        minimizePlayer,
        nextTrack,
        prevTrack,
        currentTime,
        duration,
        seek,
        favorites,
        toggleFavorite,
        hasHydrated
    } = useAudioStore();

    const { showToast } = useToast();
    const [localColor, setLocalColor] = useState('#1a3c34');
    const [albumScale, setAlbumScale] = useState(1.0);
    const [showStickyHeader, setShowStickyHeader] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [bgImage, setBgImage] = useState('');
    const overlayRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const BG_IMAGES = [
        '0.png', '1.png', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg',
        '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '15.jpg',
        '16.jpg', '16.png', '17.jpg'
    ];

    // Background Image Selection
    useEffect(() => {
        if (currentTrack?.id) {
            const randomIndex = Math.floor(Math.random() * BG_IMAGES.length);
            setBgImage(`/bg/${BG_IMAGES[randomIndex]}`);
        }
    }, [currentTrack?.id]);

    // Color Extraction
    useEffect(() => {
        if (currentTrack?.cover && currentTrack.type !== 'video') {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = currentTrack.cover;
            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    const color = colorThief.getColor(img);
                    setLocalColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
                } catch (e) { }
            };
        }
    }, [currentTrack]);

    // Scroll Handler with RAF
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        requestAnimationFrame(() => {
            const newScale = Math.max(0.7, 1.0 - (scrollTop / 600));
            setAlbumScale(newScale);
            setShowStickyHeader(scrollTop > 200);
        });
    };

    // Entrance Animation
    useEffect(() => {
        if (isPlayerVisible && overlayRef.current) {
            anime({
                targets: overlayRef.current,
                opacity: [0, 1],
                translateY: [100, 0],
                easing: 'spring(1, 80, 10, 0)',
                duration: 500
            });
        }
    }, [isPlayerVisible]);

    const handleClose = () => {
        if (overlayRef.current) {
            anime({
                targets: overlayRef.current,
                opacity: 0,
                translateY: 100,
                easing: 'easeInQuad',
                duration: 300,
                complete: () => minimizePlayer()
            });
        } else {
            minimizePlayer();
        }
    };

    if (!hasHydrated || !currentTrack || !isPlayerVisible) return null;

    const isFav = favorites.includes(currentTrack.id);
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    const artistInfo = {
        name: currentTrack.artist || "EkoSound",
        bio: "Música terapêutica criada especialmente para ajudar no alívio da ansiedade, foco e relaxamento profundo.",
        monthlyListeners: 12500,
        isFollowing: false
    };

    return (
        <div
            ref={overlayRef}
            className={`absolute inset-0 z-[100] flex flex-col overflow-hidden ${currentTrack.type === 'video' ? 'bg-transparent pointer-events-none' : 'bg-black'}`}
        >
            {/* Background Image Layer */}
            {currentTrack.type !== 'video' && bgImage && (
                <div
                    className="absolute inset-0 z-0 scale-110"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(30px) brightness(0.4)',
                        opacity: 0.8
                    }}
                />
            )}

            {/* Video Background placeholder - Handled by PersistentVideo globally to keep playing */}
            {currentTrack.type === 'video' && (
                <div className="absolute top-0 left-0 right-0 h-[60vh] z-[1] pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            )}

            {currentTrack.type !== 'video' && (
                <div className="absolute inset-0 z-[1]" style={{ background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)` }} />
            )}

            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 z-[50] flex justify-between items-center p-6 pointer-events-none">
                <button
                    onClick={handleClose}
                    className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors pointer-events-auto touch-manipulation"
                >
                    <ChevronDown size={24} />
                </button>
                <div className="text-center pointer-events-none mix-blend-difference">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase block">
                        {currentTrack.artist || "EkoSound"}
                    </span>
                    <div className={`overflow-hidden transition-all duration-300 ${showStickyHeader ? 'h-5 opacity-100' : 'h-0 opacity-0'}`}>
                        <p className="text-xs font-bold text-white truncate max-w-[200px]">
                            {currentTrack.title}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowActionSheet(true)}
                    className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors pointer-events-auto touch-manipulation"
                >
                    <MoreHorizontal size={24} />
                </button>
            </div>

            {/* Scroll Container - NOW INTERACTIVE */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden scrollbar-hide pointer-events-auto overscroll-y-contain"
            >
                {/* Hollow space for video interaction / Top Spacer */}
                <div
                    className="w-full transition-all duration-300"
                    style={{ height: currentTrack.type === 'video' ? '60vh' : '80px' }}
                />

                {/* Content Panel */}
                <div className="relative z-10 bg-black min-h-[calc(100vh-80px)] pointer-events-auto pt-8 pb-32 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    {/* Media Info */}
                    <div className="flex flex-col items-center px-8 mb-8">
                        {currentTrack.type !== 'video' && (
                            <div className="w-full aspect-square max-w-[320px] mb-8 relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-white/10 blur-3xl scale-90 rounded-full opacity-40 transition-opacity duration-700" />
                                <RotatingCover
                                    cover={currentTrack.cover || ""}
                                    isPlaying={isPlaying}
                                    scale={albumScale}
                                />
                            </div>
                        )}

                        <div className="text-center w-full mb-6 max-w-md mx-auto">
                            <h2 className="text-3xl font-bold text-white mb-2 leading-tight px-4">
                                {currentTrack.title}
                            </h2>
                            <p className="text-lg text-white/70 truncate">
                                {currentTrack.artist || currentTrack.category}
                            </p>
                        </div>

                        <button
                            onClick={() => toggleFavorite(currentTrack.id)}
                            className="mb-6 p-3 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Heart
                                size={28}
                                className={`transition-all duration-300 ${isFav ? 'fill-[#a05e46] text-[#a05e46] scale-110' : 'text-white/60 hover:text-white'}`}
                            />
                        </button>
                    </div>

                    {/* Audio Controls */}
                    {currentTrack.type !== 'video' && (
                        <div className="px-8 mb-12 max-w-md mx-auto">
                            <div className="mb-2 group relative py-2 cursor-pointer"
                                onTouchStart={(e) => {
                                    // Simple seek visual feedback optimization could go here
                                }}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={(e) => seek(Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full relative"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-white/50 font-medium mb-8 select-none">
                                <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                                <span>-{Math.floor((duration - currentTime) / 60)}:{Math.floor((duration - currentTime) % 60).toString().padStart(2, '0')}</span>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <button className="text-white/70 hover:text-white transition-colors p-2"><Shuffle size={20} /></button>
                                <button onClick={prevTrack} className="text-white hover:text-[#a05e46] transition-colors p-2 active:scale-95"><SkipBack size={40} strokeWidth={1.5} /></button>
                                <button
                                    onClick={togglePlayPause}
                                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_8px_24px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                </button>
                                <button onClick={nextTrack} className="text-white hover:text-[#a05e46] transition-colors p-2 active:scale-95"><SkipForward size={40} strokeWidth={1.5} /></button>
                                <button className="text-white/70 hover:text-white transition-colors p-2"><Repeat size={20} /></button>
                            </div>
                        </div>
                    )}

                    {/* Lyrics or Artist Card */}
                    <div className="border-t border-white/10 pt-4">
                        {LYRICS_MAP[String(currentTrack.id)] ? (
                            <LyricsCard lyrics={LYRICS_MAP[String(currentTrack.id)]} mode="dark" />
                        ) : (
                            <ArtistDetailsCard
                                artist={artistInfo}
                                onFollowToggle={() => showToast('Funcionalidade em breve!', 'info')}
                                mode="dark"
                            />
                        )}
                    </div>
                </div>
            </div>

            <ActionSheet
                isOpen={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                trackTitle={currentTrack.title}
            />
        </div>
    );
}
