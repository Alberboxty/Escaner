
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "default" | "error";
}

function Notice({
  children,
  variant = "default",
}: Props) {
  return (
    <section className={`notice notice--${variant}`}>
      {children}
    </section>
  );
}

export default Notice;
