import { useLogin } from "../hooks/login.hook";
import { LoginUser } from "../validations/schema/login.schema";

export function LoginViewModel() {
  const { login, isPending, error, form } = useLogin();

  const handleLogin = async (values: LoginUser) => {
    await login(values);
  };

  return {
    handleLogin,
    form,
    isPending,
    error,
  };
}
