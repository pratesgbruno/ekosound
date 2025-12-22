import SwiftUI

struct ContextDetailView: View {
    let context: ContextModel
    @StateObject private var viewModel: ContextDetailViewModel
    
    init(context: ContextModel) {
        self.context = context
        _viewModel = StateObject(wrappedValue: ContextDetailViewModel(contextId: context.id ?? ""))
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                // Header
                Text(context.title)
                    .font(.largeTitle)
                    .bold()
                    .padding()
                
                LazyVStack(spacing: 12) {
                    ForEach(viewModel.playlists) { playlist in
                        NavigationLink(destination: PlaylistDetailView(playlist: playlist)) {
                            PlaylistRow(playlist: playlist)
                        }
                    }
                }
                .padding()
            }
        }
        .background(Color(white: 0.07))
        .task {
            await viewModel.loadPlaylists()
        }
    }
}

struct PlaylistRow: View {
    let playlist: PlaylistModel
    
    var body: some View {
        HStack {
            // Placeholder Cover
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 60, height: 60)
                .cornerRadius(8)
                .overlay(
                    Image(systemName: "play.circle.fill")
                        .foregroundColor(.white)
                )
            
            VStack(alignment: .leading) {
                Text(playlist.title)
                    .font(.headline)
                    .foregroundColor(.white)
                Text(playlist.description)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .lineLimit(1)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(.gray)
        }
        .padding()
        .background(Color.white.opacity(0.05))
        .cornerRadius(12)
    }
}
