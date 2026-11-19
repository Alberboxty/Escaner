
import type { RangoZoom } from "../../types/scanner.types";

// import "../../assets/scss/components/_zoom.scss";

interface Props {
  rango: RangoZoom | null;
  zoom: number;
  porcentajeZoom: number;
  onChange: (valor: number) => void;
}

function ZoomControl({
  rango,
  zoom,
  porcentajeZoom,
  onChange,
}: Props) {
  return (
    <section className="zoom">
      <div className="zoom__head">
        <label htmlFor="zoom">Zoom</label>

        <span className="zoom__value">
          {rango ? `${zoom.toFixed(1)}x` : "—"}
        </span>
      </div>

      <input
        id="zoom"
        className="zoom__input"
        type="range"
        min={rango?.min ?? 1}
        max={rango?.max ?? 5}
        step={0.1}
        value={zoom}
        disabled={!rango}
        style={{
          "--pct": `${porcentajeZoom}%`,
        } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      {!rango && (
        <p className="zoom__note">
          Zoom no disponible en este dispositivo.
        </p>
      )}
    </section>
  );
}

export default ZoomControl;
