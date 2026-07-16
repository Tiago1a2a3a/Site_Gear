import type {
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
} from "react";
import * as runtime from "react/jsx-runtime";

type ModuloMDX = Readonly<{
  default: ComponentType<
    Readonly<{ components?: Record<string, ElementType> }>
  >;
}>;

function LinkMDX(props: ComponentPropsWithoutRef<"a">) {
  const externo = props.href?.startsWith("http");
  return (
    <a
      {...props}
      rel={externo ? "noreferrer" : props.rel}
      target={externo ? "_blank" : props.target}
    />
  );
}

export function ProjetoConteudoMDX({ codigo }: Readonly<{ codigo: string }>) {
  const modulo = new Function(codigo)(runtime) as ModuloMDX;
  const Conteudo = modulo.default;
  return (
    <div className="project-content">
      <Conteudo components={{ a: LinkMDX }} />
    </div>
  );
}
