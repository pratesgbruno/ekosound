"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Music, Trash2, Edit2, Save, X, Search, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Track {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    duration: number;
    category?: string;
}

export default function MusicManagementPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        audioUrl: "",
        duration: 0,
        category: "Meditation"
    });

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            const q = query(collection(db, "tracks"), orderBy("title"));
            const querySnapshot = await getDocs(q);
            const tracksData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Track[];

            // If empty (bypassed for demo), use mock
            if (tracksData.length === 0) {
                setTracks([
                    { id: "1", title: "Quiet Mind", artist: "Eko Meditations", audioUrl: "demo1.mp3", duration: 300, category: "Meditation" },
                    { id: "2", title: "Inner Light", artist: "Mantra Collective", audioUrl: "demo2.mp3", duration: 240, category: "Anxiety" },
                    { id: "3", title: "Resonance", artist: "Ambient Flow", audioUrl: "demo3.mp3", duration: 180, category: "Relief" }
                ]);
            } else {
                setTracks(tracksData);
            }
        } catch (error) {
            console.error("Error fetching tracks:", error);
            // Fallback to mock for UI demo
            setTracks([
                { id: "1", title: "Quiet Mind", artist: "Eko Meditations", audioUrl: "demo1.mp3", duration: 300, category: "Meditation" },
                { id: "2", title: "Inner Light", artist: "Mantra Collective", audioUrl: "demo2.mp3", duration: 240, category: "Anxiety" },
                { id: "3", title: "Resonance", artist: "Ambient Flow", audioUrl: "demo3.mp3", duration: 180, category: "Relief" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, "tracks", editingId), formData);
            } else {
                await addDoc(collection(db, "tracks"), formData);
            }
            setIsAdding(false);
            setEditingId(null);
            fetchTracks();
        } catch (error) {
            console.error("Error saving track:", error);
            alert("Error saving (check Firebase permissions)");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this track?")) return;
        try {
            await deleteDoc(doc(db, "tracks", id));
            fetchTracks();
        } catch (error) {
            console.error("Error deleting track:", error);
        }
    };

    const filteredTracks = tracks.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-neutral-500 hover:text-white transition mb-2 group"
                        >
                            <ChevronLeft size={20} className="transform group-hover:-translate-x-1 transition" />
                            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                        </button>
                        <h1 className="text-4xl font-black tracking-tight">Music Manager</h1>
                        <p className="text-neutral-500 mt-1 font-medium">Curate and manage your healing library</p>
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ title: "", artist: "", audioUrl: "", duration: 0, category: "" }); }}
                        className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
                    >
                        <Plus size={20} />
                        Add New Track
                    </button>
                </div>

                {/* Search & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title or artist..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent/50 transition backdrop-blur-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="glass p-4 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Tracks</p>
                            <p className="text-2xl font-black">{tracks.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Music className="text-accent" size={24} />
                        </div>
                    </div>
                </div>

                {/* Track List */}
                <div className="space-y-4">
                    {filteredTracks.map((track) => (
                        <div key={track.id} className="glass p-5 rounded-3xl flex items-center justify-between hover:bg-white/5 transition border border-white/5 group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center text-xl shadow-inner">
                                    🧘
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none mb-1">{track.title}</h3>
                                    <p className="text-sm text-neutral-500 font-medium">{track.artist}</p>
                                </div>
                                <div className="hidden md:block px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">{track.category || 'General'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={() => { setEditingId(track.id); setFormData({ ...track, category: track.category || "" }); setIsAdding(true); }}
                                    className="p-3 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(track.id)}
                                    className="p-3 rounded-xl hover:bg-red-500/10 text-neutral-500 hover:text-red-500 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Modal */}
                {isAdding && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                        <div className="glass-dark w-full max-w-md p-8 rounded-[40px] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black tracking-tight">{editingId ? 'Edit Track' : 'Add New Track'}</h2>
                                <button onClick={() => setIsAdding(false)} className="text-neutral-500 hover:text-white transition">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Track Title</label>
                                    <input
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-accent/50 transition"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Artist Name</label>
                                    <input
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-accent/50 transition"
                                        value={formData.artist}
                                        onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Audio URL (Direct MP3)</label>
                                    <input
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-accent/50 transition"
                                        value={formData.audioUrl}
                                        onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Duration (sec)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-accent/50 transition"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Category</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-accent/50 transition appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Meditation">Meditation</option>
                                            <option value="Anxiety">Anxiety</option>
                                            <option value="Sleep">Sleep</option>
                                            <option value="Focus">Focus</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-black py-4 rounded-2xl mt-4 hover:scale-[1.02] active:scale-95 transition duration-300"
                                >
                                    {editingId ? 'Save Changes' : 'Create Track'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
