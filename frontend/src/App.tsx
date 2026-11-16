import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRef } from "react";
import { useZoom } from "./hooks/useZoom";

import './assets/scss/app.scss';

interface Resultado {
  valor: string;
  formato: string;
}

function App() {
  

  const [resultado, setResultado] = useState<Resultado | null>(null);

  const scannerRef = useRef<HTMLElement>(null);
  const { range, zoom, setZoom, info, ptz } = useZoom(scannerRef);

  const pct = range
    ? ((zoom - range.min) / (range.max - range.min)) * 100
    : 0;

  const copiar = async () => {
    if (resultado) await navigator.clipboard.writeText(resultado.valor);
  };

  

  return (
    <main className="app">
      <p style={{ fontSize: 12, wordBreak: "break-all" }}>
        {info}
        <br />
        {ptz}
      </p>
      <header className="app__header">
        <h1>Escáner</h1>
        <p>Apunta a un código QR o de barras.</p>
      </header>

      <section className="scanner" ref={scannerRef}>
        <Scanner
          constraints={{
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            zoom: true,
            advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet],
          } as MediaTrackConstraints}

          components={{ finder: true, torch: true, zoom: true }}

          onScan={(codes) => {
            const primero = codes[0];
            if (!primero) return;

            const nuevo = { valor: primero.rawValue, formato: primero.format };

            setResultado((anterior) =>
              anterior?.valor === nuevo.valor ? anterior : nuevo
            );
          }}
          formats={["qr_code", "ean_13", "code_128"]}
        />

      </section>

      <section className="zoom">
        <div className="zoom__head">
          <label htmlFor="zoom">Zoom</label>
          <span className="zoom__value">{range ? `${zoom.toFixed(1)}x` : "—"}</span>
        </div>

        <input
          id="zoom"
          className="zoom__input"
          type="range"
          min={range?.min ?? 1}
          max={range?.max ?? 5}
          step={range?.step ?? 0.1}
          value={zoom}
          disabled={!range}
          style={{ "--pct": `${pct}%` } as React.CSSProperties}
          onChange={(e) => setZoom(Number(e.target.value))}
        />

        {!range && (
          <p className="zoom__note">Zoom no disponible en este dispositivo.</p>
        )}
      </section>

      <section className="result">
        {resultado ? (
          <>
            <span className="result__format">
              {resultado.formato.replace("_", " ")}
            </span>
            <pre className="result__value">{resultado.valor}</pre>
            <button className="btn" onClick={copiar}>
              Copiar
            </button>
          </>
        ) : (
          <p className="result__empty">Todavía no has escaneado nada.</p>
        )}
      </section>
    </main>
  );
}

export default App;