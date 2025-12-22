const admin = require('firebase-admin');

// INSTRUCTIONS:
// 1. Install dependencies: npm install firebase-admin
// 2. Download your Service Account Key from Firebase Console -> Project Settings -> Service Accounts -> Generate New Private Key
// 3. Save it as 'serviceAccountKey.json' in this folder.
// 4. Run: node seed.js

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const data = [
    {
        context: {
            title: "Libertação",
            iconUrl: "https://example.com/icons/libertacao.png",
            colorHex: "purple_to_blue" // Gradient name as per app logic
        },
        playlists: [
            {
                title: "Superando o Luto",
                description: "Frequências para auxiliar no processo de cura.",
                coverUrl: "https://example.com/covers/luto.jpg",
                tracks: [
                    {
                        title: "Aceitação",
                        artist: "Eko AI",
                        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Public test URL
                        duration: 300,
                        track_number: 1
                    },
                    {
                        title: "Paz Interior",
                        artist: "Freq 432Hz",
                        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        duration: 240,
                        track_number: 2
                    }
                ]
            },
            {
                title: "Ansiedade Zero",
                description: "Respire e acalme sua mente.",
                coverUrl: "https://example.com/covers/ansiedade.jpg",
                tracks: [
                    {
                        title: "Respiração Guiada",
                        artist: "Dr. Bruno",
                        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        duration: 180,
                        track_number: 1
                    }
                ]
            }
        ]
    },
    {
        context: {
            title: "Foco",
            iconUrl: "https://example.com/icons/foco.png",
            colorHex: "orange_to_red"
        },
        playlists: [
            {
                title: "Deep Work",
                description: "Foco profundo para trabalho.",
                coverUrl: "https://example.com/covers/focus.jpg",
                tracks: []
            }
        ]
    }
];

async function seed() {
    console.log("Starting seed...");

    try {
        for (const item of data) {
            // 1. Create Context
            const contextRef = await db.collection('contexts').add(item.context);
            console.log(`Created Context: ${item.context.title} (${contextRef.id})`);

            for (const pl of item.playlists) {
                // 2. Create Playlist
                const playlistData = {
                    contextId: contextRef.id,
                    title: pl.title,
                    description: pl.description,
                    coverUrl: pl.coverUrl
                };
                const plRef = await db.collection('playlists').add(playlistData);
                console.log(`  - Created Playlist: ${pl.title} (${plRef.id})`);

                // 3. Create Tracks
                for (const track of pl.tracks) {
                    const trackData = {
                        playlistId: plRef.id,
                        ...track
                    };
                    await db.collection('tracks').add(trackData);
                    console.log(`    - Created Track: ${track.title}`);
                }
            }
        }
        console.log("Seeding complete!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        process.exit();
    }
}

seed();
