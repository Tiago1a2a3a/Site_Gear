import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Como o Portal GEAR trata dados de login e aprendizado.",
};

export default function PrivacyPage() {
  return (
    <article className="legal-page">
      <p className="status-label">
        Aprovada por Tiago Lopes em 16 de julho de 2026
      </p>
      <h1>Política de privacidade</h1>
      <p>
        O Portal GEAR usa o Supabase Auth para login com GitHub e o Supabase
        Database para guardar somente suas inscrições e aulas concluídas.
      </p>
      <h2>Dados tratados</h2>
      <ul>
        <li>
          identificador interno do usuário e identificador do provedor GitHub;
        </li>
        <li>
          nome público, nome de usuário e avatar, quando fornecidos pelo GitHub;
        </li>
        <li>inscrições em Cursos e Trilhas e datas de atividade;</li>
        <li>Aulas marcadas como concluídas e respectivas datas.</li>
      </ul>
      <p>
        O Portal não pede acesso a repositórios, organizações, Issues ou Gists e
        não armazena sua senha nem um token GitHub para essas finalidades.
      </p>
      <h2>Finalidade e compartilhamento</h2>
      <p>
        Os dados sao usados exclusivamente para autenticar a pessoa e oferecer o
        recurso Meu aprendizado. O processamento tecnico usa GitHub e Supabase
        conforme as politicas desses provedores.
      </p>
      <h2>Controle e exclusão</h2>
      <p>
        Em Meu aprendizado, na seção Configurações, a pessoa pode excluir
        permanentemente a conta. A exclusão remove o usuário, suas inscrições e
        conclusões da base ativa. A retenção técnica de backups do plano
        Supabase será verificada antes da ativação em produção e registrada na
        documentação operacional do Portal.
      </p>
      <h2>Direitos e contato</h2>
      <p>
        Pedidos de acesso, correção ou informação podem ser enviados pelos
        canais oficiais do GEAR listados no rodapé.
      </p>
    </article>
  );
}
