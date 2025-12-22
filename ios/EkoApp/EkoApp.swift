import SwiftUI
import FirebaseCore

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()
    return true
  }
}

@main
struct EkoApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @StateObject private var audioManager = AudioManager.shared
    @StateObject private var authService = AuthService.shared
    @StateObject private var subscriptionService = SubscriptionService.shared
    
    var body: some Scene {
        WindowGroup {
            if authService.isAuthenticated {
                ZStack(alignment: .bottom) {
                    NavigationView {
                        HomeView()
                    }
                    .preferredColorScheme(.dark)
                    
                    if audioManager.currentTrack != nil {
                        MiniPlayerView()
                            .padding(.bottom, 0)
                    }
                }
                .environmentObject(audioManager)
                .environmentObject(authService)
                .environmentObject(subscriptionService)
            } else {
                LoginView()
                    .environmentObject(authService)
                    .preferredColorScheme(.dark)
            }
        }
    }
}
