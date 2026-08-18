import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevHub",
    template: "%s · DevHub",
  },
  description: "Seu espaço pessoal de desenvolvimento — notas, código, erros, ideias e projetos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
