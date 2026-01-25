"use client";

import { memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const DashboardError = memo(function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-md border-destructive/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <CardTitle>Error en el Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Ha ocurrido un error al cargar esta sección. Puedes intentar recargar o volver al inicio del dashboard.
          </p>

          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar sección
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/services">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Ir al Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default DashboardError;
