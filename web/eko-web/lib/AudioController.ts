export type AudioEventCallback = (data: any) => void;

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
            // Only report actual media loading errors if there's a valid source
            if (this.audio && this.audio.src && !this.audio.src.endsWith('/') && this.audio.networkState !== 3) {
                console.error("Audio Error:", e);
                this.emit('error', e);
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

    public async playTrack(url: string) {
        if (!this.audio) return;

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
        } catch (e) {
            // Previous play was interrupted, it's fine
        }

        this.audio.pause();
        this.audio.src = url;
        this.audio.load();

        try {
            this.playPromise = this.audio.play();
            await this.playPromise;
            this.emit('play', null);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // Ignore AbortError as it's common when interrupting play
                return;
            }
            console.error("Play failed:", error);
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
            } catch (error: any) {
                if (error.name !== 'AbortError') {
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

    private emit(event: string, data: any) {
        const cbs = this.subscribers.get(event);
        if (cbs) {
            cbs.forEach(cb => cb(data));
        }
    }
}

export const audioController = AudioController.getInstance();
