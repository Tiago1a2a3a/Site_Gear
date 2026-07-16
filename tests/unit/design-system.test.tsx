import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Card } from "@shared/components/ui/Card";

afterEach(cleanup);

describe("primitivos do Design System", () => {
  it("renderiza links e botões com variantes mínimas", () => {
    const handleClick = vi.fn();

    render(
      <>
        <Button href="/aprendizado">Aprender</Button>
        <Button onClick={handleClick} variant="secondary">
          Ação local
        </Button>
      </>,
    );

    expect(screen.getByRole("link", { name: "Aprender" }).className).toContain(
      "button--primary",
    );
    fireEvent.click(screen.getByRole("button", { name: "Ação local" }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("mantém Card e Badge semanticamente neutros", () => {
    render(
      <Card as="section" aria-label="Exemplo">
        <Badge>Pesquisa</Badge>
      </Card>,
    );

    expect(screen.getByRole("region", { name: "Exemplo" })).toBeDefined();
    expect(screen.getByText("Pesquisa").tagName).toBe("SPAN");
  });
});
