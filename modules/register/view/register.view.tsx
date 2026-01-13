import { RegisterForm } from "./components/form/register.form";

export const RegisterView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-gray-600">Regístrate para acceder a tu cuenta</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};
