# EkoSound 2.0 - Immersive Audio Experience

EkoSound é um player de áudio moderno e imersivo construído com Next.js, focado em alta performance (60fps), UX fluida e design premium com glassmorphism.

## ✨ Destaques (EkoSound 2.0)

*   **Infraestrutura "Audio is God"**: Implementação de estado global com **Zustand** e um engine de áudio persistente. A música nunca para, mesmo que a interface do player seja minimizada ou o usuário navegue pelo app.
*   **Interface Imersiva**: Player dinâmico que alterna entre uma **MiniBar** discreta e um **Full Overlay** expansivo.
*   **Design Adaptativo**: Utiliza **ColorThief** para extrair as cores dominantes das capas dos álbuns e gerar gradientes de fundo sincronizados em tempo real.
*   **Engine de Letras (Karaokê)**: Suporte a arquivos `.lrc` com sincronização linha a linha e efeitos de foco/desfoque nas letras ativas.
*   **Motion Design**: Animações fluidas utilizando **Framer Motion** com física de mola (Spring Physics) para garantir uma sensação nativa e sem "jank".
*   **Scroll Nativo**: Listas horizontais com **CSS Scroll Snap** para uma navegação suave em dispositivos móveis.

## 🛠️ Tecnologias

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
*   **Estado Global**: [Zustand](https://github.com/pmndrs/zustand)
*   **Animações**: [Framer Motion](https://www.framer.com/motion/)
*   **Estilização**: Tailwind CSS 4 & Vanilla CSS
*   **Processamento de Imagem**: [ColorThief](https://lokeshdhakar.com/projects/color-thief/)
*   **Ícones**: Lucide React
*   **Backend/Hosting**: Firebase

## 📦 Estrutura do Projeto

```text
/app
  /components
    AudioEngine.tsx    # Lógica de áudio invisível e persistente
    PlayerOverlay.tsx  # Interface do player (Mini e Full)
    Dashboard.tsx      # Dashboard principal com busca e categorias
  /context
    ToastContext.tsx   # Sistema de notificações globais
/store
  useAudioStore.ts     # Estado centralizado (Zustand)
/utils
  lrcParser.ts         # Parser de letras sincronizadas
/public
  /music               # Arquivos de áudio e assets
```

## 🚀 Como Executar

1.  Instale as dependências:
    ```bash
    npm install
    ```

2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

3.  Acesse `http://localhost:3000`.

## 📱 Funcionalidades

*   **Busca em Tempo Real**: Filtre meditações e sons por título ou descrição.
*   **Categorias**: Navegação rápida por tags (Foco, Ansiedade, Relaxamento).
*   **Favoritos**: Sistema de persistência via `localStorage`.
*   **Controles Avançados**: Seek (barra de progresso), Volume, Mute, Avançar/Retroceder 10s.

---
Desenvolvido com foco em bem-estar e tecnologia de ponta.
