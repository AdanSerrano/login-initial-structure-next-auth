import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicLinkForm } from "../components/form/magic-link.form";
import { Wand2 } from "lucide-react";

export const MagicLinkRequestView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <Card className="w-full max-w-md border-border/40 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-2">
            <Wand2 className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold sm:text-2xl">
            Magic Link
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Inicia sesión sin contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MagicLinkForm />
        </CardContent>
      </Card>
    </div>
  );
};
