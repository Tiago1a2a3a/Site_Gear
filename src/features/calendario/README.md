# Calendário

Propósito: apresentar eventos públicos em uma grade mensal no desktop e em uma lista de próximos eventos no celular.

Fonte: os eventos vêm exclusivamente de uma Data Source do Notion consultada no servidor. O navegador nunca recebe o token nem os registros privados. Se a integração não estiver configurada ou a consulta falhar, o calendário fica indisponível; o site não publica eventos demonstrativos.

Campos obrigatórios no Notion: `Nome` (título), `Período` (data), `Confirmação` (select com `Confirmado` ou `A definir`) e `Visibilidade` (multi-select com `Público` ou `Interno`). Para sair do servidor, `Público` deve ser a única opção de visibilidade selecionada. `Descrição` (texto) e `Link` (URL HTTPS) são opcionais; espaços externos no nome de `Descrição` são tolerados. Um evento `A definir` precisa ter início e fim da janela possível. Campos adicionais, como `Local` e `Tipo de Evento`, são permitidos e ignorados pelo site nesta versão.

Configuração: crie uma integração interna no Notion, compartilhe a base com ela e configure `NOTION_API_KEY` e `NOTION_CALENDAR_DATA_SOURCE_ID` na Vercel. `SITE_URL` é opcional e deve apontar para a origem pública do portal. A consulta usa cache de cinco minutos.

Saídas: `/calendario` expõe navegação mensal, legenda, detalhes acessíveis e link individual para o Google Agenda nos eventos confirmados. `/calendario/feed.ics` publica somente os eventos confirmados para assinatura em Google Agenda, Apple Calendar e outros aplicativos compatíveis.

Segurança: a normalização é fail-closed. Registros privados, incompletos, com tipos desconhecidos ou links inseguros são descartados antes de chegar à interface ou ao feed.

Manutenção: preserve a arquitetura Feature-First, mantenha o acesso a fontes externas exclusivamente no servidor e não permita que eventos internos cheguem às props da interface.
