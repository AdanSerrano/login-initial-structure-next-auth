import { LoginForm } from "./components/form/login.form";

export const LoginView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className="text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
