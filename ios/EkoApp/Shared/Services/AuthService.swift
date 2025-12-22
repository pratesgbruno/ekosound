import Foundation
import FirebaseAuth
import FirebaseFirestore
import Combine

class AuthService: ObservableObject {
    static let shared = AuthService()
    @Published var user: User?
    @Published var isAuthenticated: Bool = false
    
    private init() {
        Auth.auth().addStateDidChangeListener { [weak self] _, user in
            self?.user = user
            self?.isAuthenticated = user != nil
        }
    }
    
    func signIn(email: String, password: String) async throws {
        try await Auth.auth().signIn(withEmail: email, password: password)
    }
    
    func signUp(email: String, password: String, name: String) async throws {
        let result = try await Auth.auth().createUser(withEmail: email, password: password)
        // Create user document
        let userModel = [
            "email": email,
            "name": name,
            "is_subscriber": false,
            "revenuecat_id": "" // Assigned later
        ] as [String : Any]
        
        try await Firestore.firestore().collection("users").document(result.user.uid).setData(userModel)
    }
    
    func signOut() {
        try? Auth.auth().signOut()
    }
}
