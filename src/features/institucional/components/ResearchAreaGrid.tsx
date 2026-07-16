import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";
import type { ResearchArea } from "@shared/config/institutional";

export function ResearchAreaGrid({
  areas,
}: Readonly<{ areas: readonly ResearchArea[] }>) {
  return (
    <div className="research-grid">
      {areas.map((area, index) => (
        <Card className="research-card" key={area.shortCode}>
          <div className="research-card-meta">
            <Badge>{area.shortCode}</Badge>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3>{area.name}</h3>
          <p>{area.description}</p>
        </Card>
      ))}
    </div>
  );
}
