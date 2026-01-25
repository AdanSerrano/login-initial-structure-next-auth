import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
            <Loader2 className="size-7 text-gray-600 dark:text-gray-400 animate-spin" />
          </div>

          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              Por favor espera un momento mientras procesamos tu solicitud
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
