import {
  RegisterUser,
  createRegisterFormSchema,
} from "./schema/register.schema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: RegisterUser;
}

export class RegisterValidationService {
  /**
   * Valida el formato de los datos de entrada usando Zod schema
   */
  public validateInputData(data: RegisterUser): ValidationResult {
    const validatedFields = createRegisterFormSchema.safeParse(data);

    if (!validatedFields.success) {
      // Obtener el primer error para mejor UX
      const firstError = validatedFields.error.errors[0];
      return {
        isValid: false,
        error: firstError?.message ?? "Campos inválidos",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }
}
