import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    
    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(viewModel.contexts) { context in
                        NavigationLink(destination: ContextDetailView(context: context)) {
                            ContextCard(context: context)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Eko")
            .background(Color(white: 0.07)) // #121212 approx
            .task {
                await viewModel.loadContexts()
            }
        }
    }
}

struct ContextCard: View {
    let context: ContextModel
    
    var body: some View {
        VStack {
            // Placeholder for Icon
            Image(systemName: "music.note") 
                .font(.largeTitle)
                .foregroundColor(.white)
                .frame(width: 50, height: 50)
                .background(Color.white.opacity(0.2))
                .clipShape(Circle())
            
            Text(context.title)
                .font(.headline)
                .foregroundColor(.white)
        }
        .frame(height: 150)
        .frame(maxWidth: .infinity)
        .background(GradientHelper.gradient(from: context.colorHex))
        .cornerRadius(16)
        .shadow(radius: 5)
    }
}
