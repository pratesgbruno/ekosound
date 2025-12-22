import Foundation
import AVFoundation
import MediaPlayer
import Combine

class AudioManager: ObservableObject {
    static let shared = AudioManager()
    
    // Player
    private var player: AVQueuePlayer?
    
    // Publishers
    @Published var isPlaying: Bool = false
    @Published var currentTrack: TrackModel?
    @Published var duration: Double = 0.0
    @Published var currentTime: Double = 0.0
    
    // State
    private var tracks: [TrackModel] = []
    
    private init() {
        setupSession()
        setupRemoteCommands()
    }
    
    // MARK: - Setup
    private func setupSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to set audio session: \(error)")
        }
    }
    
    private func setupRemoteCommands() {
        let commandCenter = MPRemoteCommandCenter.shared()
        
        commandCenter.playCommand.addTarget { [weak self] _ in
            self?.play()
            return .success
        }
        
        commandCenter.pauseCommand.addTarget { [weak self] _ in
            self?.pause()
            return .success
        }
        
        commandCenter.nextTrackCommand.addTarget { [weak self] _ in
            self?.next()
            return .success
        }
        
        commandCenter.previousTrackCommand.addTarget { [weak self] _ in
            // Handle prev if needed
            return .success
        }
    }
    
    // MARK: - Controls
    func playPlaylist(tracks: [TrackModel], startingFrom index: Int = 0) {
        self.tracks = tracks
        
        // Create items
        // In a real app, you might lazily load items or handle buffering strategies carefully
        // Here we load the queue starting from the selected index
        let upcomingTracks = Array(tracks[index...])
        let items = upcomingTracks.compactMap { track -> AVPlayerItem? in
            guard let url = URL(string: track.audioUrl) else { return nil }
            let item = AVPlayerItem(url: url)
            // Store track metadata in the item for retrieval if needed, or rely on index logic
            return item
        }
        
        player = AVQueuePlayer(items: items)
        
        // Observe current item to update currentTrack
        // We need to map the playing item back to our TrackModel. 
        // A simple way is to match by URL or keep an index.
        // For Gapless playback, AVQueuePlayer handles the transition.
        
        if let firstTrack = upcomingTracks.first {
            currentTrack = firstTrack
            updateNowPlayingInfo()
        }
        
        play()
        
        // Add observer for time updates
        let interval = CMTime(seconds: 0.5, preferredTimescale: 600)
        player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            self?.currentTime = time.seconds
            self?.updateNowPlayingInfo(currentTime: time.seconds)
        }
    }
    
    func play() {
        player?.play()
        isPlaying = true
        updateNowPlayingInfo()
    }
    
    func pause() {
        player?.pause()
        isPlaying = false
        updateNowPlayingInfo()
    }
    
    func next() {
        player?.advanceToNextItem()
        // Logic to update currentTrack would need to observe player.currentItem
        // This is a simplified implementation.
    }
    
    // MARK: - Info Center
    func updateNowPlayingInfo(currentTime: Double? = nil) {
        guard let track = currentTrack else { return }
        
        var nowPlayingInfo = [String: Any]()
        nowPlayingInfo[MPMediaItemPropertyTitle] = track.title
        nowPlayingInfo[MPMediaItemPropertyArtist] = track.artist
        nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = track.duration
        
        if let time = currentTime {
            nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = time
        }
        nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = isPlaying ? 1.0 : 0.0
        
        // Add artwork if available (async load would be better)
        
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
}
