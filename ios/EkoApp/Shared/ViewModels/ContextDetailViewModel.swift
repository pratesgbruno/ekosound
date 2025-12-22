import Foundation

class ContextDetailViewModel: ObservableObject {
    @Published var playlists: [PlaylistModel] = []
    let contextId: String
    
    init(contextId: String) {
        self.contextId = contextId
    }
    
    func loadPlaylists() async {
        do {
            let fetched = try await DataService.shared.fetchPlaylists(forContextId: contextId)
            DispatchQueue.main.async {
                self.playlists = fetched
            }
        } catch {
            print("Error loading playlists: \(error)")
        }
    }
}
