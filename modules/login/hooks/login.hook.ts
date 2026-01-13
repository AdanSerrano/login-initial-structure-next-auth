"use client";

import { loginAction } from "@/modules/login/actions/login.actions";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  LoginUser,
  createLoginFormSchema,
} from "../validations/schema/login.schema";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const login = async (values: LoginUser) => {
    setError(null);
    startTransition(async () => {
      loginAction(values)
        .then((result) => {
          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }
          if (result?.success) {
            toast.success(result.success);
            const callbackUrl =
              searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
            router.push(callbackUrl);
            router.refresh();
          }
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : "Error al iniciar sesión";
          setError(errorMessage);
          toast.error(errorMessage);
        });
    });
  };

  const form = useForm<LoginUser>({
    resolver: zodResolver(createLoginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return {
    login,
    isPending,
    error,
    form,
  };
};
