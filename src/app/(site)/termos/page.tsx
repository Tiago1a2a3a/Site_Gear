import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Regras de uso da conta e do aprendizado no Portal GEAR.",
};

export default function TermsPage() {
  return (
    <article className="legal-page">
      <p className="status-label">
        Aprovados por Tiago Lopes em 16 de julho de 2026
      </p>
      <h1>Termos de uso</h1>
      <p>
        O conteúdo público do Portal pode ser consultado sem conta. O login com
        GitHub é opcional e serve para manter inscrições e conclusões pessoais.
      </p>
      <h2>Uso da conta</h2>
      <ul>
        <li>a pessoa deve usar uma conta GitHub sob seu controle;</li>
        <li>cada pessoa acessa somente seus proprios dados de aprendizado;</li>
        <li>tentativas de contornar controles de acesso sao proibidas;</li>
        <li>a conta pode ser excluída permanentemente nas Configurações.</li>
      </ul>
      <h2>Conteudo e progresso</h2>
      <p>
        Cursos, Trilhas e Aulas podem evoluir. O progresso e recalculado sobre o
        conteúdo publicado; novas Aulas podem alterar percentuais, e conteúdo
        removido deixa de participar do histórico e do cálculo.
      </p>
      <h2>Disponibilidade</h2>
      <p>
        O recurso pessoal pode ficar temporariamente indisponível por manutenção
        ou falha dos provedores. Essa indisponibilidade não deve impedir o
        acesso ao conteúdo público.
      </p>
    </article>
  );
}
