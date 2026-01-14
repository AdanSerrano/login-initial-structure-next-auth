"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
            <AlertCircle className="size-7 text-gray-600 dark:text-gray-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ¡Ups! Algo salió mal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Lo sentimos, ha ocurrido un error inesperado. No te preocupes,
              puedes intentarlo de nuevo.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={() => reset()} className="w-full" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar de nuevo
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-500">
            Si el problema persiste, intenta recargar la página
          </p>
        </div>
      </div>
    </div>
  );
}
