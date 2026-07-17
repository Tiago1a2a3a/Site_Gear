import type { Metadata } from "next";
import Link from "next/link";

import { GitHubLoginButton } from "@features/autenticacao/components/GitHubLoginButton";
import { normalizeInternalPath } from "@shared/lib/internal-redirect";
import { createServerSupabaseClient } from "@shared/lib/supabase/server";

export const metadata: Metadata = {
  title: "Login",
  description: "Entre no Portal GEAR usando sua conta GitHub.",
  robots: { follow: false, index: false },
};

type LoginPageProps = Readonly<{
  searchParams: Promise<{ erro?: string; next?: string }>;
}>;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const next = normalizeInternalPath(query.next);
  const supabase = await createServerSupabaseClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <section className="auth-page" aria-labelledby="login-title">
      <p className="status-label">Conta GEAR</p>
      <h1 id="login-title">Entre para acompanhar seus estudos</h1>
      <p>
        O Portal usa o GitHub somente para confirmar sua identidade. Não pedimos
        acesso a repositórios, organizações, Issues ou Gists.
      </p>
      {query.erro ? (
        <p className="form-feedback form-feedback--error" role="alert">
          O login foi cancelado ou não pôde ser concluído. Nenhuma sessão foi
          criada.
        </p>
      ) : null}
      {user ? (
        <div className="auth-action-stack">
          <p>Você já está conectado.</p>
          <Link className="button button--primary" href={next}>
            Continuar
          </Link>
        </div>
      ) : (
        <GitHubLoginButton next={next} />
      )}
      <p className="auth-privacy-note">
        Ao continuar, consulte nossa{" "}
        <Link href="/privacidade">Politica de privacidade</Link> e os{" "}
        <Link href="/termos">Termos de uso</Link>.
      </p>
    </section>
  );
}
