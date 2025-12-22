"use client";

import { Home, Search, Library, Plus, Heart, Music2, Settings, User, ListMusic } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const mainMenu = [
        { name: "Home", href: "/", icon: Home },
        { name: "Search", href: "/search", icon: Search },
        { name: "Library", href: "/library", icon: Library },
    ];

    const libraryMenu = [
        { name: "Create Playlist", href: "/playlist/new", icon: Plus },
        { name: "Liked Songs", href: "/liked", icon: Heart },
    ];

    return (
        <div className="w-60 h-full flex flex-col" style={{ background: 'var(--bg-base)' }}>
            {/* Logo */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-lg flex items-center just ify-center text-2xl transition group-hover:scale-110">
                        🧘
                    </div>
                    <span className="text-xl font-bold">Eko</span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="px-3 space-y-1">
                {mainMenu.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                    >
                        <item.icon size={24} />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Divider */}
            <div className="my-4 mx-6 h-px" style={{ background: 'var(--border-subtle)' }} />

            {/* Library Section */}
            <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
                {libraryMenu.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                    >
                        <item.icon size={24} />
                        <span>{item.name}</span>
                    </Link>
                ))}

                {/* Playlists List */}
                <div className="pt-4">
                    <p className="px-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-subdued)' }}>
                        Playlists
                    </p>
                    <div className="mt-2 space-y-1">
                        <Link href="/playlist/demo" className="sidebar-link">
                            <ListMusic size={20} />
                            <span className="truncate">Mantra Session</span>
                        </Link>
                        <Link href="/playlist/anxiety" className="sidebar-link">
                            <ListMusic size={20} />
                            <span className="truncate">Anxiety Relief</span>
                        </Link>
                        <Link href="/playlist/sleep" className="sidebar-link">
                            <ListMusic size={20} />
                            <span className="truncate">Sleep Meditation</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-highlight)] transition">
                    <div className="w-8 h-8 rounded-full overflow-hidden" style={{ background: 'var(--bg-highlight)' }}>
                        <img src="https://i.pravatar.cc/100" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">Demo User</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>Practitioner</p>
                    </div>
                    <Settings size={18} style={{ color: 'var(--text-secondary)' }} />
                </Link>
            </div>
        </div>
    );
}
