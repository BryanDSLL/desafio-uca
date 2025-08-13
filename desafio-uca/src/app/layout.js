import "./globals.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

export const metadata = {
  title: "Controle UCA",
  description: "Portal de gerenciamento da UCA",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="antialiased flex flex-col min-h-screen">
        <Header/>
        <main className="p-6 flex-1">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
