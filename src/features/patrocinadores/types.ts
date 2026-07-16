export type Sponsor = Readonly<{
  logo: `/${string}`;
  name: string;
  order: number;
  tier?: string;
  url: `https://${string}`;
}>;
