type SearchBarProps = Readonly<{
  onChange: (valor: string) => void;
  onClear: () => void;
  rotulo: string;
  valor: string;
}>;

export function SearchBar({
  onChange,
  onClear,
  rotulo,
  valor,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="busca-local">{rotulo}</label>
      <div className="search-bar__control">
        <input
          autoComplete="off"
          id="busca-local"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite um título, tema ou palavra-chave"
          type="search"
          value={valor}
        />
        {valor ? (
          <button onClick={onClear} type="button">
            Limpar termo
          </button>
        ) : null}
      </div>
    </div>
  );
}
