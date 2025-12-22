import SwiftUI

struct MiniPlayerView: View {
    @EnvironmentObject var audioManager: AudioManager
    @State private var showFullScreen = false
    
    var body: some View {
        VStack {
            HStack {
                // Placeholder Cover
                Rectangle()
                    .fill(Color.gray)
                    .frame(width: 50, height: 50)
                    .cornerRadius(8)
                    .padding(.leading)
                
                VStack(alignment: .leading) {
                    Text(audioManager.currentTrack?.title ?? "Not Playing")
                        .font(.headline)
                        .lineLimit(1)
                    Text(audioManager.currentTrack?.artist ?? "")
                        .font(.subheadline)
                        .lineLimit(1)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                Button(action: {
                    if audioManager.isPlaying {
                        audioManager.pause()
                    } else {
                        audioManager.play()
                    }
                }) {
                    Image(systemName: audioManager.isPlaying ? "pause.fill" : "play.fill")
                        .font(.title2)
                        .foregroundColor(.white)
                }
                .padding(.trailing)
            }
            .frame(height: 64)
            .background(Color(white: 0.12))
            .onTapGesture {
                showFullScreen.toggle()
            }
        }
        .sheet(isPresented: $showFullScreen) {
            FullScreenPlayerView()
                .environmentObject(audioManager)
        }
    }
}

struct FullScreenPlayerView: View {
    @EnvironmentObject var audioManager: AudioManager
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        VStack {
            // Drag Indicator
            Capsule()
                .fill(Color.gray)
                .frame(width: 40, height: 5)
                .padding(.top)
            
            Spacer()
            
            // Big Cover
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .aspectRatio(1, contentMode: .fit)
                .cornerRadius(12)
                .padding(.horizontal, 40)
                .overlay(
                    Image(systemName: "music.note")
                        .font(.system(size: 80))
                        .foregroundColor(.white.opacity(0.5))
                )
            
            Spacer()
            
            VStack(spacing: 20) {
                Text(audioManager.currentTrack?.title ?? "Title")
                    .font(.title)
                    .bold()
                
                Text(audioManager.currentTrack?.artist ?? "Artist")
                    .font(.title3)
                    .foregroundColor(.gray)
                
                // Slider (Simplified, read-only for now or needs Binding proxy)
                Slider(value: Binding(get: {
                    audioManager.currentTime
                }, set: { newValue in
                    // seek logic would be here
                }), in: 0...((audioManager.currentTrack?.duration ?? 1)))
                .padding(.horizontal)
                
                HStack(spacing: 40) {
                    Button(action: {}) {
                        Image(systemName: "backward.fill")
                            .font(.largeTitle)
                    }
                    
                    Button(action: {
                        if audioManager.isPlaying {
                            audioManager.pause()
                        } else {
                            audioManager.play()
                        }
                    }) {
                        Image(systemName: audioManager.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                            .font(.system(size: 70))
                    }
                    
                    Button(action: {
                        audioManager.next()
                    }) {
                        Image(systemName: "forward.fill")
                            .font(.largeTitle)
                    }
                }
                .foregroundColor(.white)
            }
            .padding(.bottom, 50)
        }
        .background(Color(white: 0.07).edgesIgnoringSafeArea(.all))
        .preferredColorScheme(.dark)
    }
}
