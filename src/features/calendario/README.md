# Calendário

Propósito: apresentar eventos públicos em uma grade mensal no desktop e em uma lista de próximos eventos no celular.

Fonte: quando as credenciais existem, os eventos vêm exclusivamente de uma Data Source do Notion consultada no servidor. O navegador nunca recebe o token nem os registros privados. Enquanto o Notion ainda não estiver configurado, todos os ambientes usam dados demonstrativos locais; esse fallback temporário é substituído automaticamente assim que as duas variáveis forem cadastradas.

Campos obrigatórios no Notion: `Nome` (título), `Período` (data), `Confirmação` (select com `Confirmado` ou `A definir`) e `Público` (checkbox). `Descrição` (texto) e `Link` (URL HTTPS) são opcionais. Um evento `A definir` precisa ter início e fim da janela possível.

Configuração: crie uma integração interna no Notion, compartilhe a base com ela e configure `NOTION_API_KEY` e `NOTION_CALENDAR_DATA_SOURCE_ID` na Vercel. `SITE_URL` é opcional e deve apontar para a origem pública do portal. A consulta usa cache de cinco minutos.

Saídas: `/calendario` expõe navegação mensal, legenda, detalhes acessíveis e link individual para o Google Agenda nos eventos confirmados. `/calendario/feed.ics` publica somente os eventos confirmados para assinatura em Google Agenda, Apple Calendar e outros aplicativos compatíveis.

Segurança: a normalização é fail-closed. Registros privados, incompletos, com tipos desconhecidos ou links inseguros são descartados antes de chegar à interface ou ao feed.

Manutenção: preserve a arquitetura Feature-First, mantenha o acesso a fontes externas exclusivamente no servidor e não permita que eventos internos cheguem às props da interface.
