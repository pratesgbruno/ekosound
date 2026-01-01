export type AudioEventCallback = (data: unknown) => void;

interface AudioErrorEvent {
    type: string;
    message: string;
}

class AudioController {
    private audio: HTMLAudioElement | null = null;
    private static instance: AudioController;
    private subscribers: Map<string, AudioEventCallback[]> = new Map();

    private constructor() {
        if (typeof window !== 'undefined') {
            this.audio = new Audio();
            this.setupListeners();
        }
    }

    public static getInstance(): AudioController {
        if (!AudioController.instance) {
            AudioController.instance = new AudioController();
        }
        return AudioController.instance;
    }

    private setupListeners() {
        if (!this.audio) return;

        this.audio.addEventListener('timeupdate', () => {
            this.emit('timeupdate', {
                currentTime: this.audio?.currentTime || 0,
                duration: this.audio?.duration || 0
            });
        });

        this.audio.addEventListener('ended', () => {
            this.emit('ended', null);
        });

        this.audio.addEventListener('canplay', () => {
            this.emit('loadedmetadata', {
                duration: this.audio?.duration || 0
            });
        });

        this.audio.addEventListener('error', (e) => {
            if (this.audio && this.audio.src) {
                const error = this.audio.error;
                console.error("Audio Error Event:", e, "Code:", error?.code, "Message:", error?.message, "Src:", this.audio.src);
                this.emit('error', error || new Error("Unknown audio error"));
            }
        });
    }

    private playPromise: Promise<void> | null = null;

    public stop() {
        if (!this.audio) return;
        this.audio.pause();
        // Properly clear source to prevent browser from loading current page as audio
        this.audio.removeAttribute('src');
        this.audio.load();
        this.emit('pause', null);
    }

    public async playTrack(url: string, retryCount = 0) {
        console.log(`AudioController.playTrack called (attempt ${retryCount + 1}):`, url);
        if (!this.audio) {
            console.error("AudioController: No audio element");
            return;
        }

        if (!url) {
            this.stop();
            return;
        }

        // If there's a pending play promise, we wait for it or ignore it
        // but calling pause() will interrupt it. We must handle the catch.
        try {
            if (this.playPromise) {
                await this.playPromise;
            }
        } catch {
            // Previous play was interrupted, it's fine
        }

        this.audio.pause();
        this.audio.src = url;
        this.audio.load();

        try {
            // Mobile Safari requires user interaction to play audio. 
            // Ensures volume is audible
            if (this.audio.volume === 0) this.audio.volume = 1.0;

            this.playPromise = this.audio.play();
            await this.playPromise;
            console.log("AudioController: Play started successfully for", url);
            this.emit('play', null);
        } catch (error) {
            // Type narrow error
            const err = error as Error;

            if (err.name === 'AbortError') {
                return;
            }
            if (err.name === 'NotAllowedError') {
                console.error("Auto-play blocked. User interaction required.");
                this.emit('error', { type: 'interaction_required', message: "Toque para reproduzir" } as AudioErrorEvent);
                return;
            }

            // Retry Logic for Network/Decode errors
            if (retryCount < 2) {
                console.warn(`Playback failed, retrying in ${1000 * (retryCount + 1)}ms...`);
                setTimeout(() => this.playTrack(url, retryCount + 1), 1000 * (retryCount + 1));
                return;
            }

            console.error("Play failed for url:", url, "Error:", error);
            this.emit('error', error);
        } finally {
            this.playPromise = null;
        }
    }

    public async togglePlay() {
        if (!this.audio) return;

        if (this.audio.paused) {
            try {
                this.playPromise = this.audio.play();
                await this.playPromise;
                this.emit('play', null);
            } catch (error) {
                const err = error as Error;
                if (err.name !== 'AbortError') {
                    console.error("Play failed:", error);
                }
            } finally {
                this.playPromise = null;
            }
        } else {
            // When pausing, we don't need to wait for playPromise here, 
            // the playTrack or earlier togglePlay will handle the AbortError catch.
            this.audio.pause();
            this.emit('pause', null);
        }
    }

    public seek(time: number) {
        if (this.audio) {
            this.audio.currentTime = time;
        }
    }

    public setVolume(vol: number) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, vol));
        }
    }

    public on(event: string, callback: AudioEventCallback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event)?.push(callback);
    }

    public off(event: string, callback: AudioEventCallback) {
        if (!this.subscribers.has(event)) return;
        const cbs = this.subscribers.get(event) || [];
        this.subscribers.set(event, cbs.filter(cb => cb !== callback));
    }

    private emit(event: string, data: unknown) {
        const cbs = this.subscribers.get(event);
        if (cbs) {
            cbs.forEach(cb => cb(data));
        }
    }
}

export const audioController = AudioController.getInstance();
