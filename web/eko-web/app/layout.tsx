import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AudioEngine from "./components/AudioEngine";
import { ToastProvider } from "./context/ToastContext";
import PlayerOverlay from "./components/PlayerOverlay";


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
  title: "SonicWave Player",
  description: "Experience music with glassmorphism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans bg-[#f2efe9] flex justify-center items-center min-h-screen p-4`}
        suppressHydrationWarning
      >
        <div className="relative w-full max-w-[390px] h-[844px] bg-[#fdfbf7] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
          <ToastProvider>
            <AudioEngine />
            <PlayerOverlay />
            {children}
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
