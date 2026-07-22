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
      <label className="sr-only" htmlFor={id}>
        {rotulo}
      </label>
      <div className="search-bar__control">
        <svg
          aria-hidden="true"
          className="search-bar__icon"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <input
          autoComplete="off"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={valor}
        />
        {valor ? (
          <button aria-label="Limpar termo" onClick={onClear} type="button">
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
