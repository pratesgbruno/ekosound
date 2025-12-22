import SwiftUI

struct PaywallView: View {
    @StateObject private var subscriptionService = SubscriptionService.shared
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            
            Text("Eko Premium")
                .font(.largeTitle)
                .bold()
                .foregroundColor(.white)
            
            VStack(alignment: .leading, spacing: 15) {
                FeatureRow(text: "Acesso ilimitado a todos os Mantras")
                FeatureRow(text: "Áudio em Alta Qualidade")
                FeatureRow(text: "Reprodutor em Segundo Plano")
                FeatureRow(text: "Use em práticas com pacientes")
            }
            .padding()
            
            Spacer()
            
            Button(action: {
                Task {
                    await subscriptionService.purchase(productID: "monthly_29")
                    presentationMode.wrappedValue.dismiss()
                }
            }) {
                Text("Assinar Mensal (R$29,90)")
                    .bold()
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(12)
                    .foregroundColor(.white)
            }
            
            Button(action: {
                Task {
                    await subscriptionService.purchase(productID: "yearly_295")
                    presentationMode.wrappedValue.dismiss()
                }
            }) {
                Text("Assinar Anual (R$295,00)")
                    .bold()
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .cornerRadius(12)
                    .foregroundColor(.white)
            }
            
            Button("Restaurar Compras") {
                // Restore logic
            }
            .foregroundColor(.gray)
            .padding(.bottom)
        }
        .padding()
        .background(Color(white: 0.05).edgesIgnoringSafeArea(.all))
    }
}

struct FeatureRow: View {
    let text: String
    var body: some View {
        HStack {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.green)
            Text(text)
                .foregroundColor(.white)
        }
    }
}
