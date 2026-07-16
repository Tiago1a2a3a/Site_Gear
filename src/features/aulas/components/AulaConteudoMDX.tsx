import { ConteudoMDX } from "@shared/components/ui/ConteudoMDX";

export function AulaConteudoMDX({ codigo }: Readonly<{ codigo: string }>) {
  return <ConteudoMDX className="lesson-content" codigo={codigo} />;
}
