import { ConteudoMDX } from "@shared/components/ui/ConteudoMDX";

export function ProjetoConteudoMDX({ codigo }: Readonly<{ codigo: string }>) {
  return <ConteudoMDX className="project-content" codigo={codigo} />;
}
