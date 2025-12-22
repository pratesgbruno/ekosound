import Foundation
import FirebaseFirestore
import FirebaseFirestoreSwift

// MARK: - Context Model
struct ContextModel: Identifiable, Codable {
    @DocumentID var id: String?
    let title: String
    let iconUrl: String
    let colorHex: String
    
    // Helper for SwiftUI Color
    // In a real app, we'd add a computed property to convert hex to Color
}

// MARK: - Playlist Model
struct PlaylistModel: Identifiable, Codable {
    @DocumentID var id: String?
    let contextId: String
    let title: String
    let description: String
    let coverUrl: String
}

// MARK: - Track Model
struct TrackModel: Identifiable, Codable {
    @DocumentID var id: String?
    let playlistId: String
    let title: String
    let audioUrl: String // gs:// or https://
    let artist: String
    let duration: TimeInterval
}
