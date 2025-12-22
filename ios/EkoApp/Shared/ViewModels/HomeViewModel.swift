import Foundation
import Combine

class HomeViewModel: ObservableObject {
    @Published var contexts: [ContextModel] = []
    
    func loadContexts() async {
        do {
            let fetchedContexts: [ContextModel] = try await DataService.shared.fetchCollection(collection: "contexts")
            DispatchQueue.main.async {
                self.contexts = fetchedContexts
            }
        } catch {
            print("Error loading contexts: \(error)")
        }
    }
}
