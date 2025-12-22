export interface LyricLine {
    time: number;
    text: string;
}

export function parseLRC(lrc: string): LyricLine[] {
    const lines = lrc.split('\n');
    const lyrics: LyricLine[] = [];

    // Regex to match time tag [mm:ss.xx] or [mm:ss.xxx]
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    for (const line of lines) {
        const match = line.match(timeRegex);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3], 10);

            // Convert to total seconds
            // Note: milliseconds in LRC are usually hundredths (xx) or thousandths (xxx)
            // If 2 digits, it's hundredths. If 3, thousandths.
            const ms = match[3].length === 2 ? milliseconds * 10 : milliseconds;
            const time = minutes * 60 + seconds + ms / 1000;

            const text = line.replace(timeRegex, '').trim();

            if (text) {
                lyrics.push({ time, text });
            }
        }
    }

    return lyrics;
}
