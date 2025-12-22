import Foundation

class PlaylistDetailViewModel: ObservableObject {
    @Published var tracks: [TrackModel] = []
    let playlistId: String
    
    init(playlistId: String) {
        self.playlistId = playlistId
    }
    
    func loadTracks() async {
        do {
            let fetched = try await DataService.shared.fetchTracks(forPlaylistId: playlistId)
            DispatchQueue.main.async {
                self.tracks = fetched
            }
        } catch {
            print("Error loading tracks: \(error)")
        }
    }
}
