import type { Metadata } from "next";

import { GitHubLoginButton } from "@features/autenticacao/components/GitHubLoginButton";
import {
  type LearningTab,
  PersonalLearningDashboard,
} from "@features/meu-aprendizado/components/PersonalLearningDashboard";
import { getLearningCatalog } from "@features/meu-aprendizado/data/catalogo";

export const metadata: Metadata = {
  title: "Meu aprendizado",
  description: "Inscrições, aulas concluídas e progresso no Portal GEAR.",
  robots: { follow: false, index: false },
};

const validTabs = new Set<LearningTab>([
  "resumo",
  "em-andamento",
  "concluidos",
  "aulas-concluidas",
  "configuracoes",
]);

type PersonalLearningPageProps = Readonly<{
  searchParams: Promise<{ tab?: string }>;
}>;

export default async function PersonalLearningPage({
  searchParams,
}: PersonalLearningPageProps) {
  const { tab } = await searchParams;
  const activeTab = validTabs.has(tab as LearningTab)
    ? (tab as LearningTab)
    : "resumo";

  return (
    <PersonalLearningDashboard
      activeTab={activeTab}
      catalog={getLearningCatalog()}
      loginAction={<GitHubLoginButton next="/meu-aprendizado" />}
    />
  );
}
