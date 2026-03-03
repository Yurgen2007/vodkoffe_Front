import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <ToastProvider aria-label="Alertas del sistema" />
      {children}
    </HeroUIProvider>
  );
}
