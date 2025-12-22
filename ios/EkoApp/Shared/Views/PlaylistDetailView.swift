import SwiftUI

struct PlaylistDetailView: View {
    let playlist: PlaylistModel
    @StateObject private var viewModel: PlaylistDetailViewModel
    @State private var showPaywall = false
    @State private var showShareSheet = false
    
    init(playlist: PlaylistModel) {
        self.playlist = playlist
        _viewModel = StateObject(wrappedValue: PlaylistDetailViewModel(playlistId: playlist.id ?? ""))
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Parallax Header
                GeometryReader { geometry in
                    let offset = geometry.frame(in: .global).minY
                    ZStack {
                        // Background Image logic would go here
                        Color.blue.opacity(0.3) 
                        
                        LinearGradient(colors: [.clear, Color(white: 0.07)], startPoint: .center, endPoint: .bottom)
                        
                        VStack {
                            Spacer()
                            Text(playlist.title)
                                .font(.largeTitle)
                                .bold()
                                .foregroundColor(.white)
                                .padding(.bottom, 5)
                            
                            Button(action: {
                                showShareSheet = true
                            }) {
                                HStack {
                                    Image(systemName: "square.and.arrow.up")
                                    Text("Compartilhar com Paciente")
                                }
                                .padding(.horizontal, 20)
                                .padding(.vertical, 10)
                                .background(Color.white.opacity(0.2))
                                .cornerRadius(20)
                                .foregroundColor(.white)
                            }
                            .padding(.bottom)
                        }
                    }
                    .frame(height: 300 + (offset > 0 ? offset : 0))
                    .offset(y: offset > 0 ? -offset : 0)
                }
                .frame(height: 300)
                
                // Track List
                LazyVStack(spacing: 0) {
                    ForEach(viewModel.tracks) { track in
                        TrackRow(track: track, index: viewModel.tracks.firstIndex(where: {$0.id == track.id}) ?? 0)
                            .onTapGesture {
                                if SubscriptionService.shared.isSubscriber {
                                    AudioManager.shared.playPlaylist(tracks: viewModel.tracks, startingFrom: viewModel.tracks.firstIndex(where: {$0.id == track.id}) ?? 0)
                                } else {
                                    showPaywall = true
                                }
                            }
                    }
                }
                .background(Color(white: 0.07))
            }
        }
        .edgesIgnoringSafeArea(.top)
        .background(Color(white: 0.07))
        .sheet(isPresented: $showPaywall) {
            PaywallView()
        }
        .sheet(isPresented: $showShareSheet) {
            // Generate Link
            let userId = AuthService.shared.user?.uid ?? "demo_user"
            let playlistId = playlist.id ?? "demo_playlist"
            let urlString = "https://eko-mantras.web.app/player/\(playlistId)?ref=\(userId)"
            if let url = URL(string: urlString) {
                ShareSheet(activityItems: ["Olá, aqui é seu terapeuta. Ouça esta playlist terapêutica que selecionei para você:", url])
            }
        }
        .task {
            await viewModel.loadTracks()
        }
    }
}

struct TrackRow: View {
    let track: TrackModel
    let index: Int
    
    var body: some View {
        HStack {
            Text("\(index + 1)")
                .font(.subheadline)
                .foregroundColor(.gray)
                .frame(width: 30)
            
            VStack(alignment: .leading) {
                Text(track.title)
                    .font(.body)
                    .foregroundColor(.white)
                Text(track.artist)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            Spacer()
            
            Text(formatDuration(track.duration))
                .font(.caption)
                .foregroundColor(.gray)
        }
        .padding()
        .background(Color(white: 0.07))
    }
    
    func formatDuration(_ duration: TimeInterval) -> String {
        let minutes = Int(duration) / 60
        let seconds = Int(duration) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}
