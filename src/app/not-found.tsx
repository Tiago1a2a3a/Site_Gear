import Link from "next/link";

import { Container } from "@shared/components/layout/Container";

export default function NotFound() {
  return (
    <Container as="main" className="not-found-page">
      <p className="status-label">Erro 404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço informado não corresponde a uma página do Portal.</p>
      <Link className="text-link" href="/">
        Voltar para a página inicial
      </Link>
    </Container>
  );
}
