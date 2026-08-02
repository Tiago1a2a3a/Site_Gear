# Calendário

Propósito: apresentar eventos públicos em uma grade mensal no desktop e em uma lista de próximos eventos no celular.

Limites: a primeira fatia usa dados demonstrativos locais. Não consulta Notion, não gera feed `.ics` e não integra o Google Agenda.

Entradas e saídas: recebe `CalendarEvent[]` tipado e expõe navegação mensal, legenda e detalhes acessíveis. Eventos confirmados e com data a definir possuem tratamentos visuais diferentes.

Manutenção: preserve a arquitetura Feature-First, mantenha o acesso a fontes externas exclusivamente no servidor e não permita que eventos internos cheguem às props da interface.
