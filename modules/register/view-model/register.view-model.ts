import { useRegister } from "../hooks/register.hook";
import { RegisterUser } from "../validations/schema/register.schema";

export function RegisterViewModel() {
  const { register, isPending, error, form } = useRegister();

  const handleRegister = async (values: RegisterUser) => {
    await register(values);
  };

  return {
    handleRegister,
    form,
    isPending,
    error,
  };
}
