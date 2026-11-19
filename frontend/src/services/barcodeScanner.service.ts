
import {
  BarcodeScanner,
  LensFacing,
  Resolution,
  type Barcode,
} from "@capacitor-mlkit/barcode-scanning";

import { BARCODE_FORMATS } from "../constants/barcodeFormats";

// --------------------------------------------------
// PERMISOS
// --------------------------------------------------

export const comprobarPermisoCamara = async () => {
  const resultado = await BarcodeScanner.checkPermissions();

  return resultado.camera;
};

export const solicitarPermisoCamara = async () => {
  const resultado = await BarcodeScanner.requestPermissions();

  return resultado.camera;
};

// --------------------------------------------------
// ESCÁNER
// --------------------------------------------------

export const iniciarEscaner = async () => {
  await BarcodeScanner.startScan({
    formats: BARCODE_FORMATS,
    lensFacing: LensFacing.Back,
    resolution: Resolution["1920x1080"],
  });
};

export const detenerEscaner = async () => {
  await BarcodeScanner.stopScan();
};

export const escucharCodigos = (
  callback: (barcodes: Barcode[]) => void
) => {
  return BarcodeScanner.addListener(
    "barcodesScanned",
    ({ barcodes }) => {
      callback(barcodes);
    }
  );
};

// --------------------------------------------------
// ZOOM
// --------------------------------------------------

export const obtenerZoomMinimo = async () => {
  const resultado = await BarcodeScanner.getMinZoomRatio();

  return resultado.zoomRatio;
};

export const obtenerZoomMaximo = async () => {
  const resultado = await BarcodeScanner.getMaxZoomRatio();

  return resultado.zoomRatio;
};

export const obtenerZoomActual = async () => {
  const resultado = await BarcodeScanner.getZoomRatio();

  return resultado.zoomRatio;
};

export const establecerZoom = async (valor: number) => {
  await BarcodeScanner.setZoomRatio({
    zoomRatio: valor,
  });
};

// --------------------------------------------------
// LINTERNA
// --------------------------------------------------

export const comprobarLinterna = async () => {
  const resultado = await BarcodeScanner.isTorchAvailable();

  return resultado.available;
};

export const alternarLinterna = async () => {
  await BarcodeScanner.toggleTorch();
};

// --------------------------------------------------
// AJUSTES
// --------------------------------------------------

export const abrirAjustes = async () => {
  await BarcodeScanner.openSettings();
};
