import { useCallback } from "react";
import { useLogin } from "../hooks/login.hook";
import { LoginUser } from "../validations/schema/login.schema";

export function LoginViewModel() {
  const {
    login,
    isPending,
    error,
    form,
    twoFactor,
    completeTwoFactorLogin,
    cancelTwoFactor,
    closeTwoFactorDialog,
    openTwoFactorDialog,
  } = useLogin();

  const handleLogin = useCallback(async (values: LoginUser) => {
    await login(values);
  }, [login]);

  return {
    handleLogin,
    form,
    isPending,
    error,
    twoFactor,
    completeTwoFactorLogin,
    cancelTwoFactor,
    closeTwoFactorDialog,
    openTwoFactorDialog,
  };
}
