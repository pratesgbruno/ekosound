import Foundation
import FirebaseFirestore
import Combine

class DataService {
    static let shared = DataService()
    private let db = Firestore.firestore()
    
    private init() {}
    
    // Generic fetch for collections
    func fetchCollection<T: Decodable>(collection: String) async throws -> [T] {
        let snapshot = try await db.collection(collection).getDocuments()
        return snapshot.documents.compactMap { document in
            try? document.data(as: T.self)
        }
    }
    
    // Fetch playlists for a specific context
    func fetchPlaylists(forContextId contextId: String) async throws -> [PlaylistModel] {
        let snapshot = try await db.collection("playlists")
            .whereField("contextId", isEqualTo: contextId)
            .getDocuments()
        
        return snapshot.documents.compactMap { document in
            try? document.data(as: PlaylistModel.self)
        }
    }
    
    // Fetch tracks for a specific playlist
    func fetchTracks(forPlaylistId playlistId: String) async throws -> [TrackModel] {
        let snapshot = try await db.collection("tracks")
            .whereField("playlistId", isEqualTo: playlistId)
            .order(by: "track_number") // Assuming there's a track_number or we sort by added order
            .getDocuments()
        
        return snapshot.documents.compactMap { document in
            try? document.data(as: TrackModel.self)
        }
    }
}
