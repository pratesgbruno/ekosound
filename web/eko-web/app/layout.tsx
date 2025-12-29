import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AudioEngine from "./components/AudioEngine";
import { ToastProvider } from "./context/ToastContext";
import PlayerOverlay from "./components/PlayerOverlay";
import MiniPlayer from "./components/MiniPlayer";
import BottomNavigation from "./components/BottomNavigation";
import OrganicBackground from "./components/OrganicBackground";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EkoSound Player",
  description: "Experience music with glassmorphism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans flex justify-center min-h-[100dvh] bg-[#fdfbf7]`}
        suppressHydrationWarning
      >
        <OrganicBackground />

        {/* Content Shell: Global container logic - Mobile First optimized constrained width on Desktop */}
        <div className="relative w-full max-w-[480px] min-h-[100dvh] flex flex-col mx-auto shadow-2xl overflow-hidden bg-transparent">
          <ToastProvider>
            <AudioEngine />

            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-32 no-scrollbar relative z-10 w-full flex flex-col">
              {children}
            </main>

            <MiniPlayer />
            <BottomNavigation />
            <PlayerOverlay />
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
