import PlayerClient from "./PlayerClient";

export const dynamicParams = false;

export function generateStaticParams() {
    // Define the playlist IDs you want to pre-render statically
    return [
        { playlistId: 'default' },
        { playlistId: 'meditation' },
        { playlistId: 'focus' },
        { playlistId: 'sleep' }
    ];
}

export default function Page() {
    return <PlayerClient />;
}
