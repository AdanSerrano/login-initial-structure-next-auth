"use client";

import { registerAction } from "@/modules/register/actions/register.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  RegisterUser,
  createRegisterFormSchema,
} from "../validations/schema/register.schema";

export const useRegister = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const register = async (values: RegisterUser) => {
    setError(null);

    startTransition(async () => {
      registerAction(values)
        .then((result) => {
          console.log(result);
          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }
          if (result?.success) {
            toast.success(result.success);
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          }
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : "Error al registrar usuario";
          setError(errorMessage);
          toast.error(errorMessage);
        });
    });
  };

  const form = useForm<RegisterUser>({
    resolver: zodResolver(createRegisterFormSchema),
    defaultValues: {
      email: "",
      userName: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  return {
    register,
    isPending,
    error,
    form,
  };
};
