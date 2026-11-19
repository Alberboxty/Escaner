
import { useBarcodeScanner } from "./hooks/useBarcodeScanner";

import { isNativePlatform } from "./utils/platform";

import Scanner from "./components/Scanner/Scanner";
import ZoomControl from "./components/ZoomControl/ZoomControl";
import TorchButton from "./components/TorchButton/TorchButton";
import ScanResult from "./components/ScanResult/ScanResult";
import Notice from "./components/Notice/Notice";

import "./assets/scss/app.scss";

function App() {
  const {
    resultado,
    error,
    permisoDenegado,

    rango,
    zoom,
    porcentajeZoom,
    cambiarZoom,

    tieneLinterna,
    linterna,
    alternarLinterna,

    abrirAjustes: abrirAjustesHook,
  } = useBarcodeScanner();

  const copiarResultado = async () => {
    if (!resultado) return;

    try {
      await navigator.clipboard.writeText(resultado.valor);
    } catch (e) {
      console.error("Error al copiar:", e);
    }
  };

  if (!isNativePlatform) {
    return (
      <main className="app">
        <header className="app__header">
          <h1>Escáner</h1>
          <p>
            Este escáner solo funciona dentro de la app de Android.
          </p>
        </header>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Escáner</h1>
        <p>Apunta a un código QR o de barras.</p>
      </header>

      <Scanner />

      {permisoDenegado && (
        <Notice>
          <p>
            La app necesita permiso de cámara para escanear.
          </p>

          <button
            className="btn"
            onClick={abrirAjustesHook}
          >
            Abrir ajustes
          </button>
        </Notice>
      )}

      {error && (
        <Notice variant="error">
          {error}
        </Notice>
      )}

      <section className="scanner-controls">
        <ZoomControl
          rango={rango}
          zoom={zoom}
          porcentajeZoom={porcentajeZoom}
          onChange={cambiarZoom}
        />

        {tieneLinterna && (
          <TorchButton
            activa={linterna}
            onToggle={alternarLinterna}
          />
        )}
      </section>

      <ScanResult
        resultado={resultado}
        onCopy={copiarResultado}
      />
    </main>
  );
}

export default App;
