import SwiftUI

struct LoginView: View {
    @StateObject private var authService = AuthService.shared
    @State private var email = ""
    @State private var password = ""
    @State private var isSignUp = false
    @State private var name = ""
    @State private var errorMessage = ""
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Eko")
                .font(.largeTitle)
                .bold()
                .padding(.bottom, 50)
            
            if isSignUp {
                TextField("Nome", text: $name)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .colorScheme(.light)
            }
            
            TextField("Email", text: $email)
                .autocapitalization(.none)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .colorScheme(.light)
            
            SecureField("Senha", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .colorScheme(.light)
            
            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
            }
            
            Button(action: handleAction) {
                Text(isSignUp ? "Criar Conta" : "Entrar")
                    .bold()
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(8)
                    .foregroundColor(.white)
            }
            
            Button(action: { isSignUp.toggle() }) {
                Text(isSignUp ? "Já tem conta? Entrar" : "Criar nova conta")
                    .foregroundColor(.gray)
            }
        }
        .padding()
        .background(Color(white: 0.07).edgesIgnoringSafeArea(.all))
    }
    
    func handleAction() {
        Task {
            do {
                if isSignUp {
                    try await authService.signUp(email: email, password: password, name: name)
                } else {
                    try await authService.signIn(email: email, password: password)
                }
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
}
