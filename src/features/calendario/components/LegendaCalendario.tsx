export function LegendaCalendario() {
  return (
    <div aria-label="Legenda do calendário" className="calendar-legend">
      <span>
        <i aria-hidden="true" className="calendar-legend__confirmed" />
        Data confirmada
      </span>
      <span>
        <i aria-hidden="true" className="calendar-legend__tentative" />
        Data a definir
      </span>
    </div>
  );
}
