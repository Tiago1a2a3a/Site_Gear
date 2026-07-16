import { SponsorStrip } from "@features/patrocinadores/components/SponsorStrip";
import { Footer } from "@shared/components/layout/Footer";
import { Header } from "@shared/components/layout/Header";
import { Container } from "@shared/components/layout/Container";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo
      </a>
      <Header />
      <main className="site-main" id="conteudo-principal" tabIndex={-1}>
        <Container>{children}</Container>
      </main>
      <SponsorStrip />
      <Footer />
    </>
  );
}
