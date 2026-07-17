# Autenticacao

Integra o Portal ao Supabase Auth por GitHub. A feature controla login, logout e
estado de sessao; dados de aprendizado pertencem a `meu-aprendizado`.

- OAuth usa PKCE e retorna por `src/app/auth/callback/route.ts`.
- Destinos de retorno aceitam somente caminhos internos.
- O Header consulta apenas o estado do Auth em uma ilha cliente e nunca consulta
  as tabelas pessoais para renderizar as paginas publicas.
- Senhas e tokens GitHub nao sao armazenados pelo Portal.
