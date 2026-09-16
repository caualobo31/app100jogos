import "./globals.css";

export const metadata = {
  title: "Jogo Certo — Área de Membros",
  description: "Acervo de jogos terapêuticos imprimíveis para psicólogas infantis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
