import { BarcodeFormat } from "@capacitor-mlkit/barcode-scanning";

export const BARCODE_FORMATS = [
  BarcodeFormat.QrCode,
  BarcodeFormat.Ean13,
  BarcodeFormat.Ean8,
  BarcodeFormat.UpcA,
  BarcodeFormat.UpcE,
  BarcodeFormat.Code128,
  BarcodeFormat.Code93,
  BarcodeFormat.Code39,
  BarcodeFormat.Codabar,
  BarcodeFormat.Itf,
  BarcodeFormat.DataMatrix,
  BarcodeFormat.Aztec,
  BarcodeFormat.Pdf417,
];