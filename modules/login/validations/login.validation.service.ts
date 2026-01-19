import {
  LoginUser,
  createLoginFormSchema,
} from "./schema/login.schema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: LoginUser;
}

export class LoginValidationService {
  public validateInputData(data: LoginUser): ValidationResult {
    const validatedFields = createLoginFormSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        isValid: false,
        error: "Campos inválidos",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }
}
