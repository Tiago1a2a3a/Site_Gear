import Image from "next/image";
import type {
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
} from "react";
import * as runtime from "react/jsx-runtime";

type ComponentesMDX = Record<string, ElementType>;

type ModuloMDX = Readonly<{
  default: ComponentType<Readonly<{ components?: ComponentesMDX }>>;
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

function ImagemMDX({ alt = "", src }: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string") return null;

  return (
    <Image
      alt={alt}
      className="lesson-content__image"
      height={675}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 800px"
      src={src}
      width={1200}
    />
  );
}

export function AulaConteudoMDX({ codigo }: Readonly<{ codigo: string }>) {
  const modulo = new Function(codigo)(runtime) as ModuloMDX;
  const Conteudo = modulo.default;
  const components = {
    a: LinkMDX,
    img: ImagemMDX,
  };

  return (
    <div className="lesson-content">
      <Conteudo components={components} />
    </div>
  );
}
