
import { useEffect, useState } from "react";
import type { PluginListenerHandle } from "@capacitor/core";

import type {
  Resultado,
  RangoZoom,
} from "../types/scanner.types";

import { isNativePlatform } from "../utils/platform";

import {
  comprobarPermisoCamara,
  solicitarPermisoCamara,
  iniciarEscaner,
  detenerEscaner,
  escucharCodigos,
  obtenerZoomMinimo,
  obtenerZoomMaximo,
  obtenerZoomActual,
  establecerZoom,
  comprobarLinterna,
  alternarLinterna as alternarLinternaService,
  abrirAjustes as abrirAjustesService,
} from "../services/barcodeScanner.service";

export function useBarcodeScanner() {
  // --------------------------------------------------
  // ESTADOS
  // --------------------------------------------------

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permisoDenegado, setPermisoDenegado] = useState(false);

  const [rango, setRango] = useState<RangoZoom | null>(null);
  const [zoom, setZoom] = useState(1);

  const [tieneLinterna, setTieneLinterna] = useState(false);
  const [linterna, setLinterna] = useState(false);

  // --------------------------------------------------
  // INICIALIZACIÓN
  // --------------------------------------------------

  useEffect(() => {
    if (!isNativePlatform) return;

    let listener: PluginListenerHandle | undefined;
    let cancelado = false;

    const iniciar = async () => {
      try {
        // 1. Comprobar permisos
        let estado = await comprobarPermisoCamara();

        if (estado !== "granted") {
          estado = await solicitarPermisoCamara();
        }

        if (cancelado) return;

        if (estado !== "granted" && estado !== "limited") {
          setPermisoDenegado(true);
          return;
        }

        // 2. Hacer transparente la interfaz
        document.documentElement.classList.add("escaneando");

        // 3. Escuchar códigos
        listener = await escucharCodigos((barcodes) => {
          if (cancelado) return;

          const primero = barcodes[0];

          const valor = primero?.rawValue || primero?.displayValue;

          if (!primero || !valor) return;

          setResultado((anterior) =>
            anterior?.valor === valor
              ? anterior
              : {
                  valor,
                  formato: primero.format,
                }
          );
        });

        if (cancelado) {
          await listener.remove();
          return;
        }

        // 4. Iniciar cámara
        await iniciarEscaner();

        if (cancelado) {
          await detenerEscaner();
          return;
        }

        // 5. Consultar zoom
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (cancelado) return;

        try {
          const min = await obtenerZoomMinimo();
          const max = await obtenerZoomMaximo();
          const actual = await obtenerZoomActual();

          if (max > min) {
            setRango({
              min,
              max: Math.min(max, 10),
            });

            setZoom(actual);
          }
        } catch {
          // Zoom no disponible
        }

        // 6. Consultar linterna
        try {
          setTieneLinterna(await comprobarLinterna());
        } catch {
          // Linterna no disponible
        }

      } catch (e) {
        if (!cancelado) {
          setError(
            e instanceof Error ? e.message : String(e)
          );
        }
      }
    };

    iniciar();

    // --------------------------------------------------
    // LIMPIEZA
    // --------------------------------------------------

    return () => {
      cancelado = true;

      document.documentElement.classList.remove("escaneando");

      listener?.remove();

      detenerEscaner().catch(() => {});
    };

  }, []);

  // --------------------------------------------------
  // ZOOM
  // --------------------------------------------------

  const cambiarZoom = async (valor: number) => {
    setZoom(valor);

    try {
      await establecerZoom(valor);
    } catch {
      // Ignorar error de zoom
    }
  };

  // --------------------------------------------------
  // LINTERNA
  // --------------------------------------------------

  const abrirAjustes = async () => {
    try {
      await abrirAjustesService();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : String(e)
      );
    }
  };

  const alternarLinterna = async () => {
    try {
      await alternarLinternaService();

      setLinterna((actual) => !actual);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : String(e)
      );
    }
  };

  // --------------------------------------------------
  // DATOS CALCULADOS
  // --------------------------------------------------

  const porcentajeZoom = rango
    ? ((zoom - rango.min) / (rango.max - rango.min)) * 100
    : 0;

  // --------------------------------------------------
  // API DEL HOOK
  // --------------------------------------------------

  return {
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

    abrirAjustes
  };
}
