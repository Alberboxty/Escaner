import { useEffect, useRef, useState, type RefObject } from "react";

interface ZoomRange {
  min: number;
  max: number;
  step: number;
}

export function useZoom(containerRef: RefObject<HTMLElement | null>) {
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [range, setRange] = useState<ZoomRange | null>(null);
  const [zoom, setZoomState] = useState(1);
  const [info, setInfo] = useState("Buscando vídeo…");

  useEffect(() => {
    const id = setInterval(() => {
        const video = containerRef.current?.querySelector("video");
        if (!video) return setInfo("No encuentro el <video>");

        const stream = video.srcObject as MediaStream | null;
        if (!stream) return setInfo("El vídeo aún no tiene cámara");

        const track = stream.getVideoTracks()[0];
        if (!track) return setInfo("No hay pista de vídeo");

        clearInterval(id);

        if (typeof track.getCapabilities !== "function") {
            return setInfo("getCapabilities no está disponible");
        }

        const caps = track.getCapabilities() as MediaTrackCapabilities & {
            zoom?: ZoomRange;
        };

        if (caps.zoom) {
            trackRef.current = track;
            setRange(caps.zoom);
            setZoomState(caps.zoom.min);
            setInfo(`Zoom disponible: ${caps.zoom.min} a ${caps.zoom.max}`);
        } else {
            setInfo("Sin zoom. Capacidades: " + JSON.stringify(caps));
        }
        }, 500);

        return () => clearInterval(id);
    }, [containerRef]);

    const setZoom = async (value: number) => {
        setZoomState(value);
        await trackRef.current?.applyConstraints({
        advanced: [{ zoom: value } as MediaTrackConstraintSet],
        });
    };

    const [ptz, setPtz] = useState("comprobando…");

    useEffect(() => {
    (async () => {
        const supported =
        navigator.mediaDevices.getSupportedConstraints() as Record<string, boolean>;
        let state = "no consultable";
        try {
        const s = await navigator.permissions.query({
            name: "camera",
            panTiltZoom: true,
        } as unknown as PermissionDescriptor);
        state = s.state;
        } catch {
        /* este WebView no sabe consultarlo */
        }
        setPtz(`zoom soportado: ${supported.zoom ? "sí" : "no"} · permiso PTZ: ${state}`);
    })();
    }, []);

  return { range, zoom, setZoom, info, ptz };
}