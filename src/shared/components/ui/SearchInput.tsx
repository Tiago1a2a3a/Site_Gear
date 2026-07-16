export type SearchInputProps = Readonly<{
  id?: string;
  onChange: (valor: string) => void;
  onClear: () => void;
  placeholder?: string;
  rotulo: string;
  valor: string;
}>;

export function SearchInput({
  id = "busca-local",
  onChange,
  onClear,
  placeholder = "Digite um título, tema ou palavra-chave",
  rotulo,
  valor,
}: SearchInputProps) {
  return (
    <div className="search-bar">
      <label htmlFor={id}>{rotulo}</label>
      <div className="search-bar__control">
        <input
          autoComplete="off"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
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
