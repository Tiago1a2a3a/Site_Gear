"use client";

import Image from "next/image";
import { useState } from "react";

type ProjetoGaleriaProps = Readonly<{
  imagens?: readonly string[];
  titulo: string;
}>;

export function ProjetoGaleria({ imagens, titulo }: ProjetoGaleriaProps) {
  const galeria = imagens?.length
    ? imagens
    : ["/images/content/placeholder.svg"];
  const [indice, setIndice] = useState(0);

  function selecionar(proximoIndice: number) {
    setIndice((proximoIndice + galeria.length) % galeria.length);
  }

  return (
    <section
      aria-label={`Galeria do projeto ${titulo}`}
      className="project-gallery"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") selecionar(indice - 1);
        if (event.key === "ArrowRight") selecionar(indice + 1);
      }}
      tabIndex={0}
    >
      <div className="project-gallery__stage">
        <Image
          alt={`Imagem ${indice + 1} do projeto ${titulo}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 900px"
          src={galeria[indice]}
        />
      </div>

      {galeria.length > 1 ? (
        <div className="project-gallery__controls">
          <button onClick={() => selecionar(indice - 1)} type="button">
            Imagem anterior
          </button>
          <span aria-live="polite">
            {indice + 1} de {galeria.length}
          </span>
          <button onClick={() => selecionar(indice + 1)} type="button">
            Próxima imagem
          </button>
        </div>
      ) : null}
    </section>
  );
}
