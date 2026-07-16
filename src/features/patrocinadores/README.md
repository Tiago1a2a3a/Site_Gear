# Patrocinadores

Propósito: apresentar patrocinadores e parceiros a partir de dados locais versionados. Não usa banco, API, painel administrativo nem importa outras features.

## Manutenção dos dados

1. Adicione o logo otimizado em `public/images/sponsors/`, com autorização de uso e fundo adequado.
2. Edite apenas `data/sponsors.ts`, preenchendo `name`, `logo`, `url`, `order` e o `tier` opcional.
3. Use URL HTTPS, caminho público absoluto para o logo e uma ordem inteira não repetida.
4. Execute `npm test`, `npm run typecheck` e `npm run build` antes da Pull Request.

Os apoiadores atuais são apresentados com o mesmo peso visual. O campo `order`
serve somente para manter a exibição determinística e não representa uma
hierarquia de importância.

Para atualizar, altere a entrada existente sem mudar sua ordem casualmente. Para remover, apague a entrada e o arquivo de logo que não tiver outro uso. Uma lista vazia é válida e faz o `SponsorStrip` desaparecer por completo, sem deixar título ou espaço órfão. O `SponsorGrid` da página `/patrocinadores` consome a mesma função `getSponsors()`, portanto nome, logo, link, nível e ordem nunca devem ser duplicados na rota.

Manutenção: responsabilidade atual de @Tiago1a2a3a; revise a Parte A antes de alterar.
