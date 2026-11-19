
import type { Resultado } from "../../types/scanner.types";

// import "../../assets/scss/components/_result.scss";

interface Props {
  resultado: Resultado | null;
  onCopy: () => void;
}

function ScanResult({ resultado, onCopy }: Props) {
  return (
    <section className="result">
      {resultado ? (
        <>
          <span className="result__format">
            {resultado.formato.replace("_", " ")}
          </span>

          <pre className="result__value">
            {resultado.valor}
          </pre>

          <button className="btn" onClick={onCopy}>
            Copiar
          </button>
        </>
      ) : (
        <p className="result__empty">
          Todavía no has escaneado nada.
        </p>
      )}
    </section>
  );
}

export default ScanResult;
